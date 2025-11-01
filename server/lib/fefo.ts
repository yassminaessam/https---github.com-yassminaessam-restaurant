import { getPrisma } from "../lib/prisma";

/**
 * FEFO (First Expired, First Out) Allocation
 * Allocates stock from batches with earliest expiry dates first
 */
export async function allocateStockFEFO(params: {
  itemId: string;
  warehouseId: string;
  qtyNeeded: number;
}): Promise<
  Array<{
    batchId: string | null;
    qty: number;
    lotNumber: string | null;
    expiryDate: Date | null;
    costPrice: number;
  }>
> {
  const prisma = getPrisma();
  const { itemId, warehouseId, qtyNeeded } = params;

  // Get all available batches sorted by expiry date (FEFO)
  const batches = await prisma.stockBatch.findMany({
    where: {
      itemId,
      warehouseId: warehouseId,
      qtyOnHand: { gt: 0 },
    },
    orderBy: [
      { expiryDate: "asc" }, // Earliest expiry first (FEFO)
      { createdAt: "asc" }, // Then oldest batch (FIFO)
    ],
  });

  const allocations: Array<{
    batchId: string | null;
    qty: number;
    lotNumber: string | null;
    expiryDate: Date | null;
    costPrice: number;
  }> = [];

  let remainingQty = qtyNeeded;

  // Allocate from batches
  for (const batch of batches) {
    if (remainingQty <= 0) break;

    const qtyToAllocate = Math.min(Number(batch.qtyOnHand), remainingQty);

    allocations.push({
      batchId: batch.id,
      qty: qtyToAllocate,
      lotNumber: batch.lotNumber,
      expiryDate: batch.expiryDate,
      costPrice: Number(batch.costPrice),
    });

    remainingQty -= qtyToAllocate;
  }

  // If still need more quantity, allocate from general stock (no batch)
  if (remainingQty > 0) {
    allocations.push({
      batchId: null,
      qty: remainingQty,
      lotNumber: null,
      expiryDate: null,
      costPrice: 0,
    });
  }

  return allocations;
}

/**
 * Update batch quantities after allocation
 */
export async function updateBatchQuantities(
  allocations: Array<{ batchId: string | null; qty: number }>
) {
  const prisma = getPrisma();

  for (const allocation of allocations) {
    if (!allocation.batchId) continue;

    await prisma.stockBatch.update({
      where: { id: allocation.batchId },
      data: {
        qtyOnHand: { decrement: allocation.qty },
      },
    });
  }
}

/**
 * Get stock summary by warehouse
 */
export async function getStockSummary(warehouseId?: string) {
  const prisma = getPrisma();

  try {
    const where = warehouseId ? { warehouseId } : {};

    // Aggregate stock ledger entries to get current stock levels
    const ledgerEntries = await prisma.stockLedger.findMany({
      where,
      include: {
        Item: true,
        Warehouse: true,
      },
    });

    // Group by item and warehouse
    const summary = ledgerEntries.reduce((acc: any, entry) => {
      const key = `${entry.itemId}-${entry.warehouseId}`;
      if (!acc[key]) {
        acc[key] = {
          itemId: entry.itemId,
          itemName: entry.Item.name,
          itemSku: entry.Item.sku,
          warehouseId: entry.warehouseId,
          warehouseName: entry.Warehouse.name,
          warehouseCode: entry.Warehouse.code,
          totalQty: 0,
          totalValue: 0,
        };
      }
      // Convert Decimal to number
      acc[key].totalQty += Number(entry.qty);
      acc[key].totalValue += Number(entry.costAmount || 0);
      return acc;
    }, {});

    return Object.values(summary);
  } catch (error) {
    console.error("Error in getStockSummary:", error);
    throw error;
  }
}

/**
 * Check if there's enough stock available
 */
export async function checkStockAvailability(params: {
  itemId: string;
  warehouseId: string;
  qtyNeeded: number;
}): Promise<{ available: boolean; currentStock: number }> {
  const prisma = getPrisma();
  const { itemId, warehouseId, qtyNeeded } = params;

  // Sum all ledger entries for this item in this warehouse
  const ledgerSum = await prisma.stockLedger.aggregate({
    where: {
      itemId,
      warehouseId,
    },
    _sum: {
      qty: true,
    },
  });

  const currentStock = Number(ledgerSum._sum.qty || 0);

  return {
    available: currentStock >= qtyNeeded,
    currentStock,
  };
}
