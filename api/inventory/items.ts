import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = getPrisma();

  if (req.method === 'GET') {
    try {
      const items = await prisma.item.findMany({
        include: {
          category: true,
          prices: true,
        },
      });

      const formattedItems = items.map((item) => ({
        ...item,
        prices: item.prices.reduce((acc, price) => {
          acc[price.warehouseCode] = price.unitPrice;
          return acc;
        }, {} as Record<string, number>),
      }));

      res.json(formattedItems);
    } catch (error: any) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Failed to fetch items', message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { sku, name, baseUom, categoryId, initialStock, warehouseCode, unitPrice } = req.body;

      if (!sku || !name || !baseUom) {
        return res.status(400).json({ error: 'sku, name, baseUom are required' });
      }

      const item = await prisma.item.create({
        data: {
          sku,
          name,
          baseUom,
          categoryId: categoryId || null,
        },
      });

      if (initialStock && warehouseCode) {
        if (!warehouseCode) {
          return res.status(400).json({ error: 'warehouseCode is required for initial stock' });
        }

        await prisma.stockLevel.create({
          data: {
            itemSku: sku,
            warehouseCode,
            quantity: initialStock,
          },
        });
      }

      if (unitPrice && warehouseCode) {
        await prisma.itemPrice.create({
          data: {
            itemSku: sku,
            warehouseCode,
            unitPrice,
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
