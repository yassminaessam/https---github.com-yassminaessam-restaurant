import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const prisma = getPrisma();
    
    const warehouses = await prisma.warehouse.findMany({
      select: {
        code: true,
        name: true,
        type: true,
        location: true,
      },
    });

    const itemCategories = await prisma.itemCategory.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    res.json({
      warehouses,
      categories: itemCategories,
    });
  } catch (error: any) {
    console.error('Error fetching topology:', error);
    res.status(500).json({ error: 'Failed to fetch topology', message: error.message });
  }
}
