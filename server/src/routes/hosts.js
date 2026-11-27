import { Router } from 'express';
import { prisma } from '../db.js';
import { toHostDetails } from '../mappers/host.js';

export const hostsRouter = Router();

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
