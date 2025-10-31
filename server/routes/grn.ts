import type { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";

// POST /api/inventory/grn
// Body: { warehouseCode, supplierName?, items: [{ sku, qty, unitCost?, lotNumber?, expiryDate? }] }
export const createGRN: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { warehouseCode, supplierName, items } = req.body;

    if (!warehouseCode || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "warehouseCode and items[] are required" });
    }

    const warehouse = await prisma.warehouse.findUnique({ where: { code: warehouseCode } });
    if (!warehouse) return res.status(404).json({ error: `Warehouse ${warehouseCode} not found` });

    // Create GRN header
    const grn = await prisma.goodsReceiptNote.create({
      data: {
        grnNumber: `GRN-${Date.now()}`,
        poId: null,
        warehouseId: warehouse.id,
        status: "posted",
        grnDate: new Date(),
      },
    });

    // Process each item
    for (const line of items) {
      const { sku, qty, unitCost, lotNumber, expiryDate } = line;
      if (!sku || !qty) continue;

      const item = await prisma.item.findUnique({ where: { sku } });
      if (!item) {
        console.warn(`Item ${sku} not found, skipping`);
        continue;
      }

      // Create GRN line
      await prisma.goodsReceiptLine.create({
        data: {
          grnId: grn.id,
          itemId: item.id,
          qtyReceived: qty,
          lotNumber: lotNumber || null,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          costPrice: unitCost || 0,
        },
      });

      // Record stock ledger entry (IN)
      await prisma.stockLedger.create({
        data: {
          itemId: item.id,
          warehouseId: warehouse.id,
          batchId: null,
          movementType: "in",
          reference: grn.grnNumber,
          qty,
          costAmount: (unitCost || 0) * qty,
        },
      });
    }

    res.json({ grnNumber: grn.grnNumber, id: grn.id });
  } catch (err: any) {
    console.error("GRN error:", err);
    res.status(500).json({ error: err.message || "Failed to create GRN" });
  }
};
