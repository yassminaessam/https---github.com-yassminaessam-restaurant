import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = getPrisma();

  try {
    if (req.method === 'GET') {
      const orders = await prisma.productionOrder.findMany({
        include: {
          Recipe: {
            select: {
              id: true,
              name: true,
              code: true,
              yieldQty: true,
              yieldUom: true,
            },
          },
          User: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
      const { recipeId, userId, plannedQty } = req.body;
      const { randomUUID } = await import('crypto');

      const order = await prisma.productionOrder.create({
        data: {
          id: randomUUID(),
          poNumber: `PROD-${Date.now()}`,
          recipeId,
          userId,
          plannedQty,
          status: 'draft',
          updatedAt: new Date(),
        },
        include: {
          Recipe: true,
          User: true,
        },
      });

      return res.status(201).json(order);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in production orders endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
