import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma.js';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const prisma = getPrisma();
    const { warehouseCode, items } = req.body;

    if (!warehouseCode || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'warehouseCode and items[] are required' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const grnId = randomUUID();
      
      const grn = await tx.goodsReceiptNote.create({
        data: {
          id: grnId,
          warehouseCode,
          receivedDate: new Date(),
          status: 'COMPLETED',
        },
      });

      for (const item of items) {
        await tx.goodsReceiptItem.create({
          data: {
            id: randomUUID(),
            grnId,
            itemSku: item.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice || 0,
          },
        });

        const existingStock = await tx.stockLevel.findUnique({
          where: {
            itemSku_warehouseCode: {
              itemSku: item.sku,
              warehouseCode,
            },
          },
        });

        if (existingStock) {
          await tx.stockLevel.update({
            where: {
              itemSku_warehouseCode: {
                itemSku: item.sku,
                warehouseCode,
              },
            },
            data: {
              quantity: existingStock.quantity + item.quantity,
            },
          });
        } else {
          await tx.stockLevel.create({
            data: {
              itemSku: item.sku,
              warehouseCode,
              quantity: item.quantity,
            },
          });
        }
      }

      return grn;
    });

    res.status(201).json({ success: true, grn: result });
  } catch (error: any) {
    console.error('Error creating GRN:', error);
    res.status(500).json({ error: 'Failed to create GRN', message: error.message });
  }
}
