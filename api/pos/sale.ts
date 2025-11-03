import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma.js';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const prisma = getPrisma();
    const { warehouseId, items, customerName, paymentMethod } = req.body;

    if (!warehouseId || !items) {
      return res.status(400).json({ error: 'warehouseId and items[] are required' });
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const orderId = randomUUID();
      const orderNumber = `POS-${Date.now()}`;
      let subtotal = 0;

      // Create POS order
      const order = await tx.posOrder.create({
        data: {
          id: orderId,
          orderNumber,
          type: 'pos',
          status: 'completed',
          customerName: customerName || null,
          subtotal: 0, // Will update after calculating
          total: 0,
          updatedAt: new Date(),
        },
      });

      for (const item of items) {
        // Get stock batches (FIFO)
        const batches = await tx.stockBatch.findMany({
          where: {
            itemId: item.itemId,
            warehouseId,
            qtyOnHand: { gt: 0 },
          },
          orderBy: { receivedAt: 'asc' },
        });

        let remainingQty = parseFloat(item.quantity);
        
        for (const batch of batches) {
          if (remainingQty <= 0) break;
          
          const qtyToDeduct = Math.min(parseFloat(batch.qtyOnHand.toString()), remainingQty);
          
          // Reduce stock
          await tx.stockBatch.update({
            where: { id: batch.id },
            data: { qtyOnHand: parseFloat(batch.qtyOnHand.toString()) - qtyToDeduct },
          });

          // Record movement
          await tx.stockLedger.create({
            data: {
              id: randomUUID(),
              itemId: item.itemId,
              warehouseId,
              movementType: 'SALE',
              reference: orderNumber,
              qty: -qtyToDeduct,
              costAmount: qtyToDeduct * parseFloat(batch.costPrice.toString()),
            },
          });

          remainingQty -= qtyToDeduct;
        }

        if (remainingQty > 0) {
          throw new Error(`Insufficient stock for item ${item.itemId}`);
        }

        // Create order item
        const lineTotal = item.quantity * (item.unitPrice || 0);
        subtotal += lineTotal;

        await tx.posOrderItem.create({
          data: {
            id: randomUUID(),
            orderId,
            itemId: item.itemId,
            qty: item.quantity,
            unitPrice: item.unitPrice || 0,
            lineTotal,
          },
        });
      }

      // Update order totals
      await tx.posOrder.update({
        where: { id: orderId },
        data: {
          subtotal,
          total: subtotal,
          paidAt: new Date(),
        },
      });

      return {
        orderId,
        orderNumber,
        totalAmount: subtotal,
        itemCount: items.length,
        success: true,
      };
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Failed to create sale', message: error.message });
  }
}
