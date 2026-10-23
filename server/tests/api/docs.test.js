import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// app.js імпортує роути, а роути — базу. Базу підміняємо, щоб тест не потребував Postgres
vi.mock('../../src/db.js', () => ({ prisma: {} }));

const { app } = await import('../../src/app.js');

describe('Документація API', () => {
  it('GET /api/openapi.json віддає контракт з усіма ендпоінтами', async () => {
    const res = await request(app).get('/api/openapi.json');

    expect(res.status).toBe(200);
    expect(res.body.openapi).toMatch(/^3\./);
    // Додав ендпоінт у код, а в контракт забув — цей тест нагадає
    expect(Object.keys(res.body.paths)).toEqual(['/health', '/listings', '/listings/{id}']);
  });

  it('GET /api/docs/ віддає сторінку Swagger UI', async () => {
    const res = await request(app).get('/api/docs/');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
    expect(res.text).toContain('swagger-ui');
  });
});
