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
        id: true,
        code: true,
        name: true,
        type: true,
      },
    });

    const categories = await prisma.item.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    res.json({
      warehouses,
      categories: categories.map(c => ({ name: c.category })),
    });
  } catch (error: any) {
    console.error('Error fetching topology:', error);
    res.status(500).json({ error: 'Failed to fetch topology', message: error.message });
  }
}
