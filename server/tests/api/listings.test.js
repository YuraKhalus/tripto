import { describe, it, expect, vi, beforeEach } from 'vitest';
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

beforeEach(() => {
  vi.clearAllMocks();
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
});
