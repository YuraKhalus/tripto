export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

/**
 * Перетворює query-параметри на параметри для Prisma.
 * { page: '3', limit: '20' } -> { page: 3, limit: 20, skip: 40, take: 20 }
 * Сміття, від'ємні числа й завеликий limit не ламають запит, а замінюються безпечними значеннями.
 */
export function parsePagination(query = {}) {
  const rawPage = Number.parseInt(query.page, 10);
  const rawLimit = Number.parseInt(query.limit, 10);

  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? DEFAULT_LIMIT : Math.min(rawLimit, MAX_LIMIT);

  return { page, limit, skip: (page - 1) * limit, take: limit };
}

/** Мета-інформація для відповіді зі списком */
export function buildMeta({ page, limit, total }) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}
