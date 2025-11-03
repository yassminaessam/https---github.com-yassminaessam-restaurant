import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../server/lib/prisma';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = getPrisma();
  const path = req.url?.split('/api/production')[1]?.split('?')[0] || '';

  try {
    // /api/production/orders
    if (path === '/orders') {
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
    }

    // /api/production/recipes
    if (path === '/recipes') {
      if (req.method === 'GET') {
        const recipes = await prisma.recipe.findMany({
          include: {
            RecipeLine: {
              include: {
                Item: {
                  select: {
                    id: true,
                    sku: true,
                    name: true,
                    baseUom: true,
                  },
                },
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        });

        return res.status(200).json(recipes);
      }

      if (req.method === 'POST') {
        const { code, name, description, yieldQty, yieldUom, ingredients } = req.body;

        const recipe = await prisma.recipe.create({
          data: {
            id: randomUUID(),
            code,
            name,
            description,
            yieldQty: yieldQty || 1,
            yieldUom: yieldUom || 'piece',
            updatedAt: new Date(),
            RecipeLine: {
              create: ingredients.map((ing: any) => ({
                id: randomUUID(),
                itemId: ing.itemId,
                qty: ing.qty,
                uom: ing.uom,
              })),
            },
          },
          include: {
            RecipeLine: {
              include: {
                Item: true,
              },
            },
          },
        });

        return res.status(201).json(recipe);
      }
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    console.error('Error in production handler:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
