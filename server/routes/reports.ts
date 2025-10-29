import type { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";
import { getStockSummary } from "../lib/fefo";

// GET /api/inventory/stock-summary?warehouseId=xxx
export const getStockSummaryReport: RequestHandler = async (req, res) => {
  try {
    const { warehouseId } = req.query;
    const summary = await getStockSummary(warehouseId as string | undefined);
    res.json({ summary });
  } catch (err: any) {
    console.error("Stock summary error:", err);
    res.status(500).json({ error: err.message || "Failed to get stock summary" });
  }
};

// GET /api/inventory/movements?limit=50
export const getRecentMovements: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const limit = parseInt(req.query.limit as string) || 50;

    const movements = await prisma.stockLedger.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        item: true,
        warehouse: true,
        batch: true,
      },
    });

    const formattedMovements = movements.map((m) => ({
      id: m.id,
      date: m.createdAt.toISOString().split("T")[0],
      itemName: m.item.name,
      itemSku: m.item.sku,
      warehouse: m.warehouse.name,
      movementType: m.movementType,
      qty: m.qty,
      reference: m.reference,
      lotNumber: m.batch?.lotNumber || null,
      expiryDate: m.batch?.expiryDate || null,
      costAmount: m.costAmount,
    }));

    res.json({ movements: formattedMovements });
  } catch (err: any) {
    console.error("Movements error:", err);
    res.status(500).json({ error: err.message || "Failed to get movements" });
  }
};
