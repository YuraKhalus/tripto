import { Router } from 'express';
import { prisma } from '../db.js';
import { parsePagination, buildMeta } from '../utils/pagination.js';
import { toListingCard, toListingDetails } from '../mappers/listing.js';

export const listingsRouter = Router();

// Поля, потрібні для картки. Беремо лише їх, а не весь рядок (опис може бути довгим)
const cardSelect = {
  id: true,
  name: true,
  pictureUrl: true,
  neighbourhood: true,
  roomType: true,
  accommodates: true,
  price: true,
  rating: true,
  reviewsCount: true,
  latitude: true,
  longitude: true,
};

// GET /api/listings?page=1&limit=20
listingsRouter.get('/', async (req, res) => {
  const { page, limit, skip, take } = parsePagination(req.query);

  // Два запити паралельно: сторінка даних + загальна кількість
  const [listings, total] = await Promise.all([
    prisma.listing.findMany({ select: cardSelect, orderBy: { id: 'asc' }, skip, take }),
    prisma.listing.count(),
  ]);

  res.json({ data: listings.map(toListingCard), meta: buildMeta({ page, limit, total }) });
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
