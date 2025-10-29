import type { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";

// GET /api/inventory/topology
export const getTopology: RequestHandler = async (_req, res) => {
  try {
    const prisma = getPrisma();
    const warehouses = await prisma.warehouse.findMany({
      orderBy: { code: "asc" },
      include: { locations: { orderBy: { code: "asc" } } },
    });
    res.json({ warehouses });
  } catch (err: any) {
    if (String(err?.message || "").includes("DATABASE_URL is not set")) {
      return res.status(503).json({ error: "Database not configured", hint: "Set DATABASE_URL in .env then run: pnpm prisma:generate && pnpm prisma:migrate && pnpm prisma:seed" });
    }
    res.status(500).json({ error: "Failed to fetch topology" });
  }
};

// GET /api/inventory/items - Get all items
export const getItems: RequestHandler = async (_req, res) => {
  try {
    const prisma = getPrisma();
    const items = await prisma.item.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        sku: true,
        name: true,
        uom: true,
        avgCost: true,
        category: true
      }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
};
