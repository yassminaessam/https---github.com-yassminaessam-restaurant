import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const prisma = getPrisma();
    
    const stockBatches = await prisma.stockBatch.findMany({
      include: {
        Item: {
          select: {
            sku: true,
            name: true,
            baseUom: true,
            category: true,
          },
        },
        Warehouse: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    const summary = stockBatches.map((batch) => ({
      itemSku: batch.Item.sku,
      itemName: batch.Item.name,
      warehouseCode: batch.Warehouse.code,
      warehouseName: batch.Warehouse.name,
      quantity: batch.qtyOnHand,
      baseUom: batch.Item.baseUom,
      category: batch.Item.category,
      lotNumber: batch.lotNumber,
      expiryDate: batch.expiryDate,
    }));

    res.json(summary);
  } catch (error: any) {
    console.error('Error fetching stock summary:', error);
    res.status(500).json({ error: 'Failed to fetch stock summary', message: error.message });
  }
}
