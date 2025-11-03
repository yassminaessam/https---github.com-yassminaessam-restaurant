import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../server/lib/prisma';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = getPrisma();
  const path = req.url?.split('/api/purchasing')[1]?.split('?')[0] || '';

  try {
    // /api/purchasing/orders
    if (path === '/orders') {
      if (req.method === 'GET') {
        const orders = await prisma.purchaseOrder.findMany({
          include: {
            Supplier: {
              select: {
                id: true,
                name: true,
                contact: true,
              },
            },
            PurchaseOrderLine: {
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
            createdAt: 'desc',
          },
        });

        return res.status(200).json(orders);
      }

      if (req.method === 'POST') {
        const { supplierId, expectedDate, lines } = req.body;

        const order = await prisma.purchaseOrder.create({
          data: {
            id: randomUUID(),
            poNumber: `PO-${Date.now()}`,
            supplierId,
            poDate: new Date(),
            expectedDate: new Date(expectedDate),
            status: 'draft',
            updatedAt: new Date(),
            PurchaseOrderLine: {
              create: lines.map((line: any) => ({
                id: randomUUID(),
                itemId: line.itemId,
                qty: line.qty,
                unitPrice: line.unitPrice,
                totalAmount: line.qty * line.unitPrice,
              })),
            },
          },
          include: {
            Supplier: true,
            PurchaseOrderLine: {
              include: {
                Item: true,
              },
            },
          },
        });

        return res.status(201).json(order);
      }
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    console.error('Error in purchasing handler:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
