import { Router } from 'express';
import { prisma } from '../db.js';
import { buildMeta, parsePagination } from '../utils/pagination.js';
import { toHostDetails } from '../mappers/host.js';
import { cardSelect, toListingCard } from '../mappers/listing.js';

export const hostsRouter = Router();

// GET /api/hosts/:id — картка господаря
hostsRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid host id' });
  }

  const host = await prisma.host.findUnique({
    where: { id },
    include: {
      _count: {
        select: { listings: true },
      },
    },
  });

  if (!host) {
    return res.status(404).json({ error: 'Host not found' });
  }

  res.json({ data: toHostDetails(host) });
});

// GET /api/hosts/:id/listings — усі житла господаря з пагінацією
hostsRouter.get('/:id/listings', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid host id' });
  }

  const host = await prisma.host.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!host) {
    return res.status(404).json({ error: 'Host not found' });
  }

  const { page, limit, skip, take } = parsePagination(req.query);

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where: { hostId: id },
      select: cardSelect,
      orderBy: { id: 'asc' },
      skip,
      take,
    }),
    prisma.listing.count({
      where: { hostId: id },
    }),
  ]);

  res.json({
    data: listings.map(toListingCard),
    meta: buildMeta({ page, limit, total }),
  });
});
