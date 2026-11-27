import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Підміняємо справжню базу "двійником" (mock).
// Так тест перевіряє ЛИШЕ логіку ендпоінта, не потребує Docker і працює за мілісекунди.
vi.mock('../../src/db.js', () => ({
  prisma: {
    listing: {
      findUnique: vi.fn(),
    },
    review: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

const { prisma } = await import('../../src/db.js');
const { app } = await import('../../src/app.js');

// date — саме Date, бо toReview() викликає toISOString()
const fakeReviews = [
  {
    id: 2,
    airbnbId: 'airbnb-2',
    listingId: 1,
    reviewerName: 'John',
    date: new Date('2026-09-17'),
    comments: 'Great place!',
  },
  {
    id: 1,
    airbnbId: 'airbnb-1',
    listingId: 1,
    reviewerName: 'Marta',
    date: new Date('2026-09-17'),
    comments: null,
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/listings/:id/reviews', () => {
  it('повертає сторінку відгуків і мету пагінації', async () => {
    prisma.listing.findUnique.mockResolvedValue({ id: 1 });
    prisma.review.findMany.mockResolvedValue(fakeReviews);
    prisma.review.count.mockResolvedValue(12);

    const res = await request(app).get('/api/listings/1/reviews?page=2&limit=5');

    expect(res.status).toBe(200);
    expect(res.body.meta).toEqual({ page: 2, limit: 5, total: 12, totalPages: 3 });

    // Точна структура: лише поля з toReview(), без службових полів Prisma
    expect(res.body.data).toEqual([
      { id: 2, reviewerName: 'John', date: '2026-09-17', comments: 'Great place!' },
      { id: 1, reviewerName: 'Marta', date: '2026-09-17', comments: null },
    ]);

    // Дата без часу: YYYY-MM-DD
    expect(res.body.data[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(res.body.data[0]).not.toHaveProperty('listingId');
    expect(res.body.data[0]).not.toHaveProperty('airbnbId');

    expect(prisma.review.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { listingId: 1 },
        orderBy: [{ date: 'desc' }, { id: 'desc' }],
        skip: 5,
        take: 5,
      }),
    );

    // total рахує лише відгуки цього житла — той самий where, що й у findMany
    expect(prisma.review.count).toHaveBeenCalledWith({ where: { listingId: 1 } });
  });

  it('повертає 404, якщо житла немає, і не читає відгуки', async () => {
    prisma.listing.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/listings/999/reviews');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Listing not found' });
    expect(prisma.review.findMany).not.toHaveBeenCalled();
    expect(prisma.review.count).not.toHaveBeenCalled();
  });

  it('повертає 400 на нечисловий id і навіть не йде в базу', async () => {
    const res = await request(app).get('/api/listings/abc/reviews');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid listing id' });
    expect(prisma.listing.findUnique).not.toHaveBeenCalled();
    expect(prisma.review.findMany).not.toHaveBeenCalled();
    expect(prisma.review.count).not.toHaveBeenCalled();
  });

  it('повертає 200 з порожнім масивом, якщо у житла немає відгуків', async () => {
    prisma.listing.findUnique.mockResolvedValue({ id: 1 });
    prisma.review.findMany.mockResolvedValue([]);
    prisma.review.count.mockResolvedValue(0);

    const res = await request(app).get('/api/listings/1/reviews');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });
  });
});
