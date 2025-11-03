import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma.js';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const prisma = getPrisma();
    const { fromWarehouse, toWarehouse, items } = req.body;

    if (!fromWarehouse || !toWarehouse || !items) {
      return res.status(400).json({ error: 'fromWarehouse, toWarehouse, and items[] required' });
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const transferId = randomUUID();

      for (const item of items) {
        const fromStock = await tx.stockLevel.findUnique({
          where: {
            itemSku_warehouseCode: {
              itemSku: item.sku,
              warehouseCode: fromWarehouse,
            },
          },
        });

        if (!fromStock || fromStock.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.sku} in ${fromWarehouse}`);
        }

        await tx.stockLevel.update({
          where: {
            itemSku_warehouseCode: {
              itemSku: item.sku,
              warehouseCode: fromWarehouse,
            },
          },
          data: {
            quantity: fromStock.quantity - item.quantity,
          },
        });

        const toStock = await tx.stockLevel.findUnique({
          where: {
            itemSku_warehouseCode: {
              itemSku: item.sku,
              warehouseCode: toWarehouse,
            },
          },
        });

        if (toStock) {
          await tx.stockLevel.update({
            where: {
              itemSku_warehouseCode: {
                itemSku: item.sku,
                warehouseCode: toWarehouse,
              },
            },
            data: {
              quantity: toStock.quantity + item.quantity,
            },
          });
        } else {
          await tx.stockLevel.create({
            data: {
              itemSku: item.sku,
              warehouseCode: toWarehouse,
              quantity: item.quantity,
            },
          });
        }
      }

      return { transferId, success: true };
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating transfer:', error);
    res.status(500).json({ error: 'Failed to create transfer', message: error.message });
  }
}
