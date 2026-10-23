import { PrismaClient } from '@prisma/client';

// Один клієнт на весь застосунок: він тримає пул з'єднань до Postgres
export const prisma = new PrismaClient();
