import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';

// Підміняємо справжню базу "двійником" (mock).
// Так тест перевіряє ЛИШЕ логіку ендпоінта, не потребує Docker і працює за мілісекунди.
vi.mock('../../src/db.js', () => ({
  prisma: {
    listing: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

const { prisma } = await import('../../src/db.js');
const { app } = await import('../../src/app.js');

const fakeListing = {
  id: 1,
  name: 'Sunny flat in Gràcia',
  pictureUrl: 'https://example.com/1.jpg',
  neighbourhood: 'la Vila de Gràcia',
  roomType: 'Entire home/apt',
  accommodates: 4,
  price: '120.00', // Prisma Decimal у JSON — рядок
  rating: 4.8,
  reviewsCount: 57,
  latitude: 41.40,
  longitude: 2.15,
};

// Те, що мапер має віддати для короткої картки
const expectedCard = {
  id: 1,
  name: 'Sunny flat in Gràcia',
  pictureUrl: 'https://example.com/1.jpg',
  neighbourhood: 'la Vila de Gràcia',
  roomType: 'Entire home/apt',
  accommodates: 4,
  price: 120,
  rating: 4.8,
  reviewsCount: 57,
  location: { lat: 41.40, lng: 2.15 },
};

const fakeHost = {
  id: 7,
  name: 'Marta',
  pictureUrl: 'https://example.com/host.jpg',
  isSuperhost: true,
  since: new Date('2020-05-01T00:00:00.000Z'),
};

const fakeDetails = {
  ...fakeListing,
  description: 'A bright flat near the metro.',
  neighbourhoodGroup: 'Gràcia',
  propertyType: 'Entire rental unit',
  bathroomsText: '1 bath',
  bedrooms: 2,
  beds: 3,
  amenities: ['Wifi', 'Kitchen'],
  minimumNights: 2,
  host: fakeHost,
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('GET /api/listings', () => {
  it('повертає сторінку оголошень і мету пагінації', async () => {
    prisma.listing.findMany.mockResolvedValue([fakeListing]);
    prisma.listing.count.mockResolvedValue(41);

    const res = await request(app).get('/api/listings?page=2&limit=20');

    expect(res.status).toBe(200);
    expect(res.body.meta).toEqual({ page: 2, limit: 20, total: 41, totalPages: 3 });
    expect(res.body.data[0].price).toBe(120); // мапер перетворив рядок на число
    // Перевіряємо, що в базу пішли правильні skip/take
    expect(prisma.listing.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 20, take: 20 }));
  });

  it('мапить картку рівно за контрактом, без зайвих полів із бази', async () => {
    prisma.listing.findMany.mockResolvedValue([fakeListing]);
    prisma.listing.count.mockResolvedValue(1);

    const res = await request(app).get('/api/listings');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([expectedCard]);
  });

  it('бере з бази лише поля картки й сортує за id', async () => {
    prisma.listing.findMany.mockResolvedValue([]);
    prisma.listing.count.mockResolvedValue(0);

    await request(app).get('/api/listings');

    expect(prisma.listing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          id: true,
          name: true,
          price: true,
          latitude: true,
          longitude: true,
        }),
        orderBy: { id: 'asc' },
      }),
    );
  });

  it('без параметрів віддає першу сторінку з лімітом 20', async () => {
    prisma.listing.findMany.mockResolvedValue([]);
    prisma.listing.count.mockResolvedValue(0);

    const res = await request(app).get('/api/listings');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });
    expect(prisma.listing.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 0, take: 20 }));
  });

  it('не дає попросити більше 100 записів на сторінку', async () => {
    prisma.listing.findMany.mockResolvedValue([]);
    prisma.listing.count.mockResolvedValue(250);

    const res = await request(app).get('/api/listings?page=2&limit=5000');

    expect(res.status).toBe(200);
    expect(res.body.meta).toEqual({ page: 2, limit: 100, total: 250, totalPages: 3 });
    expect(prisma.listing.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 100, take: 100 }));
  });

  it('нормалізує невалідні page і limit замість помилки', async () => {
    prisma.listing.findMany.mockResolvedValue([]);
    prisma.listing.count.mockResolvedValue(0);

    const res = await request(app).get('/api/listings?page=abc&limit=0');

    expect(res.status).toBe(200);
    expect(res.body.meta).toEqual({ page: 1, limit: 20, total: 0, totalPages: 0 });
    expect(prisma.listing.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 0, take: 20 }));
  });

  it('лишає price = null, якщо ціни немає', async () => {
    prisma.listing.findMany.mockResolvedValue([{ ...fakeListing, price: null }]);
    prisma.listing.count.mockResolvedValue(1);

    const res = await request(app).get('/api/listings');

    expect(res.status).toBe(200);
    expect(res.body.data[0].price).toBeNull();
  });

  it('повертає 500, якщо база впала', async () => {
    // Ховаємо очікуваний console.error з error-middleware, щоб не засмічувати вивід тестів
    vi.spyOn(console, 'error').mockImplementation(() => {});
    prisma.listing.findMany.mockRejectedValue(new Error('DB is down'));
    prisma.listing.count.mockResolvedValue(0);

    const res = await request(app).get('/api/listings');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });
});

describe('GET /api/listings/:id', () => {
  it('повертає 404, якщо житла немає', async () => {
    prisma.listing.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/listings/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Listing not found' });
  });

  it('повертає 400 на нечисловий id і навіть не йде в базу', async () => {
    const res = await request(app).get('/api/listings/abc');

    expect(res.status).toBe(400);
    expect(prisma.listing.findUnique).not.toHaveBeenCalled();
  });

  it.each(['0', '-1', '1.5', 'NaN'])('повертає 400 на невалідний id "%s"', async (id) => {
    const res = await request(app).get(`/api/listings/${id}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid listing id' });
    expect(prisma.listing.findUnique).not.toHaveBeenCalled();
  });

  it('повертає повну картку житла разом із хостом', async () => {
    prisma.listing.findUnique.mockResolvedValue(fakeDetails);

    const res = await request(app).get('/api/listings/1');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      ...expectedCard,
      description: 'A bright flat near the metro.',
      neighbourhoodGroup: 'Gràcia',
      propertyType: 'Entire rental unit',
      bathroomsText: '1 bath',
      bedrooms: 2,
      beds: 3,
      amenities: ['Wifi', 'Kitchen'],
      minimumNights: 2,
      host: {
        id: 7,
        name: 'Marta',
        pictureUrl: 'https://example.com/host.jpg',
        isSuperhost: true,
        since: '2020-05-01T00:00:00.000Z',
      },
    });
    // id з URL перетворено на число, хост підтягується одним запитом
    expect(prisma.listing.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { host: true },
    });
  });

  it('повертає host = null, якщо хост не приєднаний', async () => {
    prisma.listing.findUnique.mockResolvedValue({ ...fakeDetails, host: null });

    const res = await request(app).get('/api/listings/1');

    expect(res.status).toBe(200);
    expect(res.body.data.host).toBeNull();
    expect(res.body.data.id).toBe(1);
  });

  it('повертає 500, якщо база впала', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    prisma.listing.findUnique.mockRejectedValue(new Error('DB is down'));

    const res = await request(app).get('/api/listings/1');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });
});
