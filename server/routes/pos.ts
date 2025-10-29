import type { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";
import { allocateStockFEFO, updateBatchQuantities, checkStockAvailability } from "../lib/fefo";

// POST /api/pos/sale
// Body: { warehouseCode (KITCHEN/BUFFET/FRIDGE/ROOM-101), items: [{ sku, qty, unitPrice }], customerName?, roomNumber?, paymentMethod? }
export const createSale: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { warehouseCode, items, customerName, roomNumber, paymentMethod } = req.body;

    if (!warehouseCode || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "warehouseCode and items[] are required" });
    }

    // Find the warehouse
    const warehouse = await prisma.warehouse.findUnique({
      where: { code: warehouseCode },
    });
    if (!warehouse) return res.status(404).json({ error: `Warehouse ${warehouseCode} not found` });

    let subtotal = 0;
    let taxAmount = 0;
    const orderItems: any[] = [];

    // First, validate stock availability for all items
    for (const line of items) {
      const { sku, qty } = line;
      if (!sku || !qty) continue;

      const item = await prisma.item.findUnique({ where: { sku } });
      if (!item) continue;

      const stockCheck = await checkStockAvailability({
        itemId: item.id,
        warehouseId: warehouse.id,
        qtyNeeded: qty,
      });

      if (!stockCheck.available) {
        return res.status(400).json({
          error: `لا توجد كمية كافية من ${item.name}. المتاح: ${stockCheck.currentStock}, المطلوب: ${qty}`,
        });
      }
    }

    // Process sale
    for (const line of items) {
      const { sku, qty, unitPrice } = line;
      if (!sku || !qty || !unitPrice) continue;

      const item = await prisma.item.findUnique({ where: { sku } });
      if (!item) continue;

      const lineTotal = qty * unitPrice;
      const lineTax = lineTotal * 0.14; // 14% tax (Egypt VAT)
      subtotal += lineTotal;
      taxAmount += lineTax;

      orderItems.push({
        itemId: item.id,
        qty,
        unitPrice,
        taxRate: 14,
        discount: 0,
        lineTotal: lineTotal + lineTax,
      });

      // Use FEFO allocation for stock deduction
      const allocations = await allocateStockFEFO({
        itemId: item.id,
        warehouseId: warehouse.id,
        qtyNeeded: qty,
      });

      // Update batch quantities
      await updateBatchQuantities(allocations);

      // Record ledger entries for each batch allocation
      for (const allocation of allocations) {
        await prisma.stockLedger.create({
          data: {
            itemId: item.id,
            warehouseId: warehouse.id,
            batchId: allocation.batchId,
            movementType: "out",
            reference: `SALE-${Date.now()}`,
            qty: -allocation.qty,
            costAmount: -(allocation.costPrice * allocation.qty),
          },
        });
      }
    }

    const total = subtotal + taxAmount;

    const order = await prisma.posOrder.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        type: roomNumber ? "dine_in" : "takeaway",
        status: "paid",
        source: "pos",
        subtotal,
        taxAmount,
        discountAmount: 0,
        total,
        customerName: customerName || null,
        customerPhone: roomNumber || null,
        paidAt: new Date(),
        items: { create: orderItems },
        payments: {
          create: {
            method: paymentMethod || "cash",
            amount: total,
            reference: roomNumber || null,
          },
        },
      },
    });

    res.json({ orderNumber: order.orderNumber, total, id: order.id });
  } catch (err: any) {
    console.error("POS sale error:", err);
    res.status(500).json({ error: err.message || "Failed to create sale" });
  }
};
