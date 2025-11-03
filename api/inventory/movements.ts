import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const prisma = getPrisma();
    const { limit = '50' } = req.query;
    
    const movements = await prisma.stockMovement.findMany({
      take: parseInt(limit as string),
      orderBy: {
        movementDate: 'desc',
      },
      include: {
        item: {
          select: {
            name: true,
          },
        },
        warehouse: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(movements);
  } catch (error: any) {
    console.error('Error fetching movements:', error);
    res.status(500).json({ error: 'Failed to fetch movements', message: error.message });
  }
}
