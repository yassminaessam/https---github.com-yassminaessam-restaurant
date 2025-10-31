import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

function getPrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!prisma) {
    prisma = new PrismaClient({
      log: ["error", "warn"],
    });
  }
  return prisma;
}

async function getStockSummary(warehouseId?: string) {
  const prisma = getPrisma();
  const where = warehouseId ? { warehouseId } : {};

  const ledgerEntries = await prisma.stockLedger.findMany({
    where,
    include: {
      item: true,
      warehouse: true,
    },
  });

  const summary = ledgerEntries.reduce((acc: any, entry) => {
    const key = `${entry.itemId}-${entry.warehouseId}`;
    if (!acc[key]) {
      acc[key] = {
        itemId: entry.itemId,
        name: entry.item.name,
        code: entry.item.sku,
        sku: entry.item.sku,
        category: entry.item.category,
        warehouseCode: entry.warehouse.code,
        warehouse: entry.warehouse.name,
        onHand: 0,
        unit: entry.item.baseUom,
        avgCost: 0,
        totalValue: 0,
      };
    }
    acc[key].onHand += Number(entry.qty);
    acc[key].totalValue += Number(entry.costAmount || 0);
    return acc;
  }, {});

  const result = Object.values(summary);
  return result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { warehouseId } = req.query;
    const summary = await getStockSummary(warehouseId as string | undefined);
    return res.json(summary);
  } catch (err: any) {
    console.error("Stock summary error:", err);
    return res.status(500).json({ error: err.message || "Failed to get stock summary" });
  }
}
