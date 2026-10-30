import { Router } from "express";
import { prisma } from "../db.js";
//import { listingsRouter } from "./listings";

export const hostsRouter = Router();

hostsRouter.get("/:id/listings", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: "Invalid host id" });
    }

    const hostListings = await prisma.host.findUnique({
        where: { id },
        include: { listings: true },
    });

    if (!hostListings) {
        return res.status(404).json({ error: "Host not found" });
    }

    console.log(hostListings);

    res.json({ data: hostListings });
});
