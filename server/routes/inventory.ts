import type { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";
import { randomUUID } from "crypto";

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

// POST /api/inventory/items - Create a new item (and optionally initial stock)
export const createItem: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();

    const {
      sku,
      name,
      category,
      baseUom,
      initial,
    }: {
      sku: string;
      name: string;
      category?: string;
      baseUom: string;
      initial?: { quantity?: number; warehouseCode?: string; avgCost?: number };
    } = req.body || {};

    if (!sku || !name || !baseUom) {
      return res.status(400).json({ error: "sku, name, baseUom are required" });
    }

    // Create Item
    const item = await prisma.item.create({
      data: {
        id: randomUUID(),
        sku,
        name,
        category: category || "uncategorized",
        baseUom,
        type: "finished_good",
      },
    });

    // Optional: create initial stock ledger entry if provided
    if (initial && (initial.quantity || 0) > 0) {
      if (!initial.warehouseCode) {
        return res.status(400).json({ error: "warehouseCode is required for initial stock" });
      }

      const warehouse = await prisma.warehouse.findUnique({ where: { code: initial.warehouseCode } });
      if (!warehouse) {
        return res.status(404).json({ error: `Warehouse ${initial.warehouseCode} not found` });
      }

      const qty = Number(initial.quantity || 0);
      const avgCost = Number(initial.avgCost || 0);

      await prisma.stockLedger.create({
        data: {
          id: randomUUID(),
          itemId: item.id,
          warehouseId: warehouse.id,
          movementType: "in",
          reference: "INITIAL_STOCK",
          qty,
          costAmount: qty * avgCost,
        },
      });
    }

    return res.status(201).json({ item });
  } catch (err: any) {
    if (String(err?.message).includes("Unique constraint failed on the fields: (`sku`)")) {
      return res.status(409).json({ error: "SKU already exists" });
    }
    console.error("Create item error:", err);
    return res.status(500).json({ error: err.message || "Failed to create item" });
  }
};
