import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma.js';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = getPrisma();

  if (req.method === 'GET') {
    try {
      const items = await prisma.item.findMany({
        include: {
          ItemPrice: true,
        },
      });

      const formattedItems = items.map((item) => ({
        ...item,
        prices: item.ItemPrice,
      }));

      res.json(formattedItems);
    } catch (error: any) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Failed to fetch items', message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { sku, name, baseUom, category, initialStock, warehouseId, salePrice, costPrice } = req.body;

      if (!sku || !name || !baseUom) {
        return res.status(400).json({ error: 'sku, name, baseUom are required' });
      }

      const item = await prisma.item.create({
        data: {
          id: randomUUID(),
          sku,
          name,
          category: category || 'General',
          baseUom,
        },
      });

      if (initialStock && warehouseId) {
        await prisma.stockBatch.create({
          data: {
            id: randomUUID(),
            itemId: item.id,
            warehouseId,
            qtyOnHand: initialStock,
            costPrice: costPrice || 0,
          },
        });
      }

      if (salePrice && costPrice) {
        await prisma.itemPrice.create({
          data: {
            id: randomUUID(),
            itemId: item.id,
            salePrice,
            costPrice,
            updatedAt: new Date(),
          },
        });
      }

      res.status(201).json({ success: true, item });
    } catch (error: any) {
      console.error('Error creating item:', error);
      res.status(500).json({ error: 'Failed to create item', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
