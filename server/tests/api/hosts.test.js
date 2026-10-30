import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('../../src/db.js', () => ({
  prisma: {
    host: {
      findUnique: vi.fn(),
    },
  },
}));

const { prisma } = await import('../../src/db.js');
const { app } = await import('../../src/app.js');

const fakeHost = {
  id: 7,
  airbnbId: '12345678',
  name: 'Marta',
  pictureUrl: 'https://example.com/host.jpg',
  isSuperhost: true,
  since: new Date('2020-05-15'),
  _count: {
    listings: 5,
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/hosts/:id', () => {
  it('повертає дані господаря та кількість оголошень', async () => {
    prisma.host.findUnique.mockResolvedValue(fakeHost);

    const res = await request(app).get('/api/hosts/7');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      id: 7,
      airbnbId: '12345678',
      name: 'Marta',
      pictureUrl: 'https://example.com/host.jpg',
      isSuperhost: true,
      since: fakeHost.since,
      listingsCount: 5,
    });
    expect(prisma.host.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 7 },
        include: {
          _count: {
            select: { listings: true },
          },
        },
      })
    );
  });

  it('повертає 404, якщо господаря немає', async () => {
    prisma.host.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/hosts/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Host not found' });
  });

  it('повертає 400 на нечисловий id і навіть не йде в базу', async () => {
    const res = await request(app).get('/api/hosts/abc');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid host id' });
    expect(prisma.host.findUnique).not.toHaveBeenCalled();
  });

  it('повертає 400 на від\'ємний id і навіть не йде в базу', async () => {
    const res = await request(app).get('/api/hosts/-1');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid host id' });
    expect(prisma.host.findUnique).not.toHaveBeenCalled();
  });

  it('повертає 400 на нульовий id і навіть не йде в базу', async () => {
    const res = await request(app).get('/api/hosts/0');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid host id' });
    expect(prisma.host.findUnique).not.toHaveBeenCalled();
  });
});
