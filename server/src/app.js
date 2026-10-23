import { readFileSync } from 'node:fs';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { listingsRouter } from './routes/listings.js';

// Контракт API лежить у server/openapi.yaml. Читаємо його один раз під час старту
const openapi = YAML.parse(readFileSync(new URL('../openapi.yaml', import.meta.url), 'utf8'));

// app створюється окремо від app.listen(), щоб тести могли
// "смикати" ендпоінти через Supertest без запуску реального сервера
export const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/listings', listingsRouter);

// Документація: сирий контракт (для Postman, генераторів клієнта) і Swagger UI для людей.
// Підключаємо ДО обробника 404, інакше він перехопить ці адреси
app.get('/api/openapi.json', (req, res) => {
  res.json(openapi);
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));

// Невідомий маршрут
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Express 5 сам передає сюди помилки з async-обробників
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
