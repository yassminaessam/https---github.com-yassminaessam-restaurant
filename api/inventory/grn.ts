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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== GRN CREATE START ===');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    const prisma = getPrisma();
    const { warehouseCode, supplierName, items } = req.body;

    console.log('GRN Request:', { warehouseCode, supplierName, itemsCount: items?.length });

    if (!warehouseCode || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "warehouseCode and items[] are required" });
    }

    const warehouse = await prisma.warehouse.findUnique({ where: { code: warehouseCode } });
    if (!warehouse) {
      console.error(`Warehouse not found: ${warehouseCode}`);
      return res.status(404).json({ error: `Warehouse ${warehouseCode} not found` });
    }

    console.log('Creating GRN for warehouse:', warehouse.id);

    // Create GRN header
    const grn = await prisma.goodsReceiptNote.create({
      data: {
        grnNumber: `GRN-${Date.now()}`,
        warehouseId: warehouse.id,
        status: "posted",
        grnDate: new Date(),
      },
    });

    console.log('GRN created:', grn.grnNumber);

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

    console.log('GRN completed successfully');
    return res.status(200).json({ grnNumber: grn.grnNumber, id: grn.id });
  } catch (err: any) {
    console.error("=== GRN ERROR ===");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    return res.status(500).json({ 
      error: err.message || "Failed to create GRN", 
      details: err.toString(),
      name: err.name 
    });
  }
}
