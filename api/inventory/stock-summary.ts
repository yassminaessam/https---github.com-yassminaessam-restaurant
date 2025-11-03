import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const prisma = getPrisma();
    
    const stockLevels = await prisma.stockLevel.findMany({
      include: {
        item: {
          select: {
            sku: true,
            name: true,
            baseUom: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        warehouse: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    const summary = stockLevels.map((level) => ({
      itemSku: level.itemSku,
      itemName: level.item.name,
      warehouseCode: level.warehouseCode,
      warehouseName: level.warehouse.name,
      quantity: level.quantity,
      baseUom: level.item.baseUom,
      category: level.item.category?.name || 'Uncategorized',
    }));

    res.json(summary);
  } catch (error: any) {
    console.error('Error fetching stock summary:', error);
    res.status(500).json({ error: 'Failed to fetch stock summary', message: error.message });
  }
}
