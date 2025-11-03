import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma.js';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const prisma = getPrisma();
    const { warehouseId, items } = req.body;

    if (!warehouseId || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'warehouseId and items[] are required' });
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const grnId = randomUUID();
      const grnNumber = `GRN-${Date.now()}`;
      
      const grn = await tx.goodsReceiptNote.create({
        data: {
          id: grnId,
          grnNumber,
          warehouseId,
          status: 'completed',
          grnDate: new Date(),
          updatedAt: new Date(),
        },
      });

      for (const item of items) {
        await tx.goodsReceiptLine.create({
          data: {
            id: randomUUID(),
            grnId,
            itemId: item.itemId,
            qtyReceived: item.quantity,
            costPrice: item.costPrice || 0,
            createdAt: new Date(),
          },
        });

        // Create or update stock batch
        await tx.stockBatch.create({
          data: {
            id: randomUUID(),
            itemId: item.itemId,
            warehouseId,
            qtyOnHand: item.quantity,
            costPrice: item.costPrice || 0,
            lotNumber: item.lotNumber || null,
            expiryDate: item.expiryDate || null,
          },
        });

        // Record in stock ledger
        await tx.stockLedger.create({
          data: {
            id: randomUUID(),
            itemId: item.itemId,
            warehouseId,
            movementType: 'GRN',
            reference: grnNumber,
            qty: item.quantity,
            costAmount: item.quantity * (item.costPrice || 0),
          },
        });
      }

      return grn;
    });

    res.status(201).json({ success: true, grn: result });
  } catch (error: any) {
    console.error('Error creating GRN:', error);
    res.status(500).json({ error: 'Failed to create GRN', message: error.message });
  }
}
