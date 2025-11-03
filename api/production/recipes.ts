import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = getPrisma();

  try {
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
      const { randomUUID } = await import('crypto');

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

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in production recipes endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
