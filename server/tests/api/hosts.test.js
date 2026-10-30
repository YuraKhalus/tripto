import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Підміняємо базу "двійником" (моком), додаючи host і listing
vi.mock('../../src/db.js', () => ({
  prisma: {
    host: {
      findUnique: vi.fn(),
    },
    listing: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

const { prisma } = await import('../../src/db.js');
const { app } = await import('../../src/app.js');

const fakeHost = {
  id: 1,
  name: 'John Doe',
};

const fakeListing = {
  id: 10,
  name: 'Cozy apartment in Eixample',
  pictureUrl: 'https://example.com/host-listing.jpg',
  neighbourhood: 'Eixample',
  roomType: 'Entire home/apt',
  accommodates: 2,
  price: '95.00',
  rating: 4.9,
  reviewsCount: 30,
  latitude: 41.38,
  longitude: 2.17,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /hosts/:id/listings', () => {
  it('повертає сторінку оголошень конкретного хоста і мету пагінації', async () => {

    prisma.host.findUnique.mockResolvedValue(fakeHost);
    prisma.listing.findMany.mockResolvedValue([fakeListing]);
    prisma.listing.count.mockResolvedValue(5);

    const res = await request(app).get('/api/hosts/1/listings?page=1&limit=10');

    expect(res.status).toBe(200);
    expect(res.body.meta).toEqual({ page: 1, limit: 10, total: 5, totalPages: 1 });
    expect(res.body.data.length).toBe(1);
    
    expect(prisma.listing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ 
        where: { hostId: 1 }, 
        skip: 0, 
        take: 10 
      })
    );
    expect(prisma.listing.count).toHaveBeenCalledWith({ where: { hostId: 1 } });
  });

  it('повертає 404, якщо такого хоста немає', async () => {
    prisma.host.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/hosts/9999/listings');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Host not found' });
    expect(prisma.listing.findMany).not.toHaveBeenCalled();
  });

  it('повертає 400 на нечисловий id хоста і не йде в базу', async () => {
    const res = await request(app).get('/api/hosts/abc/listings');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid host id' });
    expect(prisma.host.findUnique).not.toHaveBeenCalled();
  });
});