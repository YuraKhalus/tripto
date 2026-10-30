import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Підміняємо справжню базу "двійником" (mock).
// Роут /top-rated викликає лише prisma.listing.findMany, тому інших методів тут немає.
vi.mock('../../src/db.js', () => ({
  prisma: {
    listing: {
      findMany: vi.fn(),
    },
  },
}));

const { prisma } = await import('../../src/db.js');
const { app } = await import('../../src/app.js');

const fakeListing = {
  id: 118,
  name: 'Mediterranean Barcelona Apartments, Penthouse A',
  pictureUrl: 'https://example.com/118.jpg',
  neighbourhood: 'Porta',
  roomType: 'Entire home/apt',
  accommodates: 4,
  price: '189.00', // Prisma Decimal у JSON — рядок
  rating: 5,
  reviewsCount: 50,
  latitude: 41.4305114746094,
  longitude: 2.17860698699951,
};

const expectedCard = {
  id: 118,
  name: 'Mediterranean Barcelona Apartments, Penthouse A',
  pictureUrl: 'https://example.com/118.jpg',
  neighbourhood: 'Porta',
  roomType: 'Entire home/apt',
  accommodates: 4,
  price: 189, // мапер перетворив рядок на число
  rating: 5,
  reviewsCount: 50,
  location: { lat: 41.4305114746094, lng: 2.17860698699951 },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/listings/top-rated', () => {
  it('повертає картки оголошень у data, а в базу йде limit за замовчуванням 10', async () => {
    prisma.listing.findMany.mockResolvedValue([fakeListing]);

    const res = await request(app).get('/api/listings/top-rated');

    expect(res.status).toBe(200);
    // toEqual на всьому тілі: заодно гарантує, що в відповіді немає зайвих полів (наприклад, meta)
    expect(res.body).toEqual({ data: [expectedCard] });
    expect(prisma.listing.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.listing.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 10 }));
  });

  it('передає в базу переданий limit як take', async () => {
    prisma.listing.findMany.mockResolvedValue([fakeListing]);

    const res = await request(app).get('/api/listings/top-rated?limit=5');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [expectedCard] });
    expect(prisma.listing.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 5 }));
  });

  it('сортує за рейтингом, потім за кількістю відгуків, потім за id', async () => {
    prisma.listing.findMany.mockResolvedValue([fakeListing]);

    await request(app).get('/api/listings/top-rated');

    expect(prisma.listing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }, { id: 'asc' }],
      }),
    );
  });

  it.each([
    ['мінімальне значення', 1],
    ['максимальне значення', 50],
  ])('приймає граничний limit: %s (%i)', async (_name, limit) => {
    prisma.listing.findMany.mockResolvedValue([fakeListing]);

    const res = await request(app).get(`/api/listings/top-rated?limit=${limit}`);

    expect(res.status).toBe(200);
    expect(prisma.listing.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: limit }));
  });

  it.each([
    ['нуль', '0'],
    ['від’ємне число', '-5'],
    ['більше за максимум', '51'],
    ['не число', 'abc'],
  ])('повертає 400, якщо limit некоректний: %s, і не йде в базу', async (_name, limit) => {
    const res = await request(app).get(`/api/listings/top-rated?limit=${limit}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid limit' });
    expect(prisma.listing.findMany).not.toHaveBeenCalled();
  });
});