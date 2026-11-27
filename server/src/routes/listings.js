import { Router } from 'express';
import { prisma } from '../db.js';
import { parsePagination, buildMeta } from '../utils/pagination.js';
import { parseLimit } from '../utils/limit.js';
import { cardSelect, toListingCard, toListingDetails } from '../mappers/listing.js';
import { toReview } from '../mappers/review.js';

export const listingsRouter = Router();

// GET /api/listings?page=1&limit=20
listingsRouter.get('/', async (req, res) => {
  const { page, limit, skip, take } = parsePagination(req.query);

  // Два запити паралельно: сторінка даних + загальна кількість
  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      select: cardSelect,
      orderBy: { id: 'asc' },
      skip,
      take,
    }),
    prisma.listing.count(),
  ]);

  res.json({
    data: listings.map(toListingCard),
    meta: buildMeta({ page, limit, total }),
  });
});

// GET /api/listings/top-rated?limit=10
// Стоїть ВИЩЕ за /:id, інакше Express прийме "top-rated" за id і поверне 400
listingsRouter.get('/top-rated', async (req, res) => {
  const limit = parseLimit(req.query.limit, { defaultValue: 10, max: 50 });

  if (limit === null) {
    return res.status(400).json({ error: 'Invalid limit' });
  }

  const listings = await prisma.listing.findMany({
    where: { rating: { not: null }, reviewsCount: { gte: 10 } },
    select: cardSelect,
    orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }, { id: 'asc' }],
    take: limit,
  });

  res.json({ data: listings.map(toListingCard) });
});

// GET /api/listings/:id
listingsRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid listing id' });
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { host: true },
  });

  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  res.json({ data: toListingDetails(listing) });
});

listingsRouter.get('/:id/reviews', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid listing id' });
  }

  const listing = await prisma.listing.findUnique({ where: { id }, select: { id: true } });

  if (listing === null) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const { page, limit, skip, take } = parsePagination(req.query);
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { listingId: id },
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
      skip,
      take,
    }),
    prisma.review.count({ where: { listingId: id } }),
  ]);

  res.json({ data: reviews.map(toReview), meta: buildMeta({ page, limit, total }) });
});
