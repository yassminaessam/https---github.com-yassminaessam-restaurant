import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma.js';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const prisma = getPrisma();
    const { warehouseCode, items, customerName, paymentMethod } = req.body;

    if (!warehouseCode || !items) {
      return res.status(400).json({ error: 'warehouseCode and items[] are required' });
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const saleId = randomUUID();
      let totalAmount = 0;

      for (const item of items) {
        const stock = await tx.stockLevel.findUnique({
          where: {
            itemSku_warehouseCode: {
              itemSku: item.sku,
              warehouseCode,
            },
          },
        });

        if (!stock || stock.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.sku}`);
        }

        await tx.stockLevel.update({
          where: {
            itemSku_warehouseCode: {
              itemSku: item.sku,
              warehouseCode,
            },
          },
          data: {
            quantity: stock.quantity - item.quantity,
          },
        });

        totalAmount += (item.unitPrice || 0) * item.quantity;
      }

      return {
        saleId,
        totalAmount,
        itemCount: items.length,
        success: true,
      };
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Failed to create sale', message: error.message });
  }
}
