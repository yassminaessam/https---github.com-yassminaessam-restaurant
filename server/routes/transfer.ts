import type { RequestHandler } from "express";
import { v4 as uuid } from "uuid";
import { getPrisma } from "../lib/prisma";
import { allocateStockFEFO, updateBatchQuantities, checkStockAvailability } from "../lib/fefo";

// POST /api/inventory/transfer
// Body: { fromWarehouse, toWarehouse, items: [{ sku, qty }], userId? }
export const createTransfer: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { fromWarehouse, toWarehouse, items, userId } = req.body;

    if (!fromWarehouse || !toWarehouse || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: "fromWarehouse, toWarehouse, and items[] required" });
    }

    const fromWh = await prisma.warehouse.findUnique({ where: { code: fromWarehouse } });
    const toWh = await prisma.warehouse.findUnique({ where: { code: toWarehouse } });
    if (!fromWh || !toWh) return res.status(404).json({ error: "Warehouse not found" });

    // Find or create a user for this transfer (in production, use authenticated user)
    let user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
    if (!user) {
      user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: { id: uuid(), email: "system@restaurant.local", name: "System", password: null, role: "admin", updatedAt: new Date() },
        });
      }
    }

    const transfer = await prisma.stockTransfer.create({
      data: {
        id: uuid(),
        transferNumber: `TR-${Date.now()}`,
        fromWarehouseId: fromWh.id,
        toWarehouseId: toWh.id,
        userId: user.id,
        status: "closed",
        updatedAt: new Date(),
      },
    });

    for (const line of items) {
      const { sku, qty } = line;
      if (!sku || !qty) continue;

      const item = await prisma.item.findUnique({ where: { sku } });
      if (!item) continue;

      // Check stock availability at source warehouse
      const stockCheck = await checkStockAvailability({
        itemId: item.id,
        warehouseId: fromWh.id,
        qtyNeeded: qty,
      });

      if (!stockCheck.available) {
        return res.status(400).json({
          error: `لا توجد كمية كافية من ${item.name}. المتاح: ${stockCheck.currentStock}, المطلوب: ${qty}`,
        });
      }

      await prisma.stockTransferLine.create({
        data: { id: uuid(), transferId: transfer.id, itemId: item.id, qty },
      });

      // Use FEFO allocation from source warehouse
      const allocations = await allocateStockFEFO({
        itemId: item.id,
        warehouseId: fromWh.id,
        qtyNeeded: qty,
      });

      // Update batch quantities
      await updateBatchQuantities(allocations);

      // Record ledger entries for each batch allocation
      for (const allocation of allocations) {
        // Deduct from source (OUT)
        await prisma.stockLedger.create({
          data: {
            id: uuid(),
            itemId: item.id,
            warehouseId: fromWh.id,
            batchId: allocation.batchId,
            movementType: "transfer",
            reference: transfer.transferNumber,
            qty: -allocation.qty,
            costAmount: -(allocation.costPrice * allocation.qty),
          },
        });

        // Add to destination (IN)
        await prisma.stockLedger.create({
          data: {
            id: uuid(),
            itemId: item.id,
            warehouseId: toWh.id,
            batchId: allocation.batchId,
            movementType: "transfer",
            reference: transfer.transferNumber,
            qty: allocation.qty,
            costAmount: allocation.costPrice * allocation.qty,
          },
        });
      }
    }

    res.json({ transferNumber: transfer.transferNumber, id: transfer.id });
  } catch (err: any) {
    console.error("Transfer error:", err);
    res.status(500).json({ error: err.message || "Failed to create transfer" });
  }
};
