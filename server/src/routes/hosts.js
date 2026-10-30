import { Router } from "express";
import { prisma } from "../db.js";
import { toListingDetails } from "../mappers/listing.js";
import { buildMeta, parsePagination } from "../utils/pagination.js";
import { cardSelect } from "./listings.js";

export const hostsRouter = Router();

hostsRouter.get("/:id/listings", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: "Invalid host id" });
    }

    const host = await prisma.host.findUnique({
        where: { id },
        include: { listings: true },
    });

    if (!host) {
        return res.status(404).json({ error: "Host not found" });
    }

    console.log(host);

    const { page, limit, skip, take } = parsePagination(req.query);

    const [listings, total] = await Promise.all([
        prisma.listing.findMany({
            where: { hostId: id },
            select: cardSelect,
            orderBy: { id: "asc" },
            skip,
            take,
        }),
        prisma.listing.count({
            where: { hostId: id },
        }),
    ]);

    res.json({
        data: listings.map(toListingDetails),
        meta: buildMeta({ page, limit, total }),
    });
});
