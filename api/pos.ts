import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../server/lib/prisma.js';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = getPrisma();
  const path = req.url?.split('/api/pos')[1]?.split('?')[0] || '';

  try {
    // /api/pos/sale - POST create POS sale
    if (path === '/sale' && req.method === 'POST') {
      const { warehouseId, items, customerName, customerPhone, type } = req.body;

      if (!warehouseId || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'warehouseId and items[] required' });
      }

      const result = await prisma.$transaction(async (tx: any) => {
        const orderId = randomUUID();
        const orderNumber = `POS-${Date.now()}`;

        let subtotal = 0;

        // Process each item and calculate totals
        const orderItems = [];
        for (const item of items) {
          const itemPrice = await tx.itemPrice.findFirst({
            where: { itemId: item.itemId },
            orderBy: { createdAt: 'desc' },
          });

          const unitPrice = itemPrice?.salePrice || 0;
          const lineTotal = parseFloat(item.quantity) * parseFloat(unitPrice.toString());
          subtotal += lineTotal;

          orderItems.push({
            id: randomUUID(),
            orderId,
            itemId: item.itemId,
            qty: item.quantity,
            unitPrice,
            lineTotal,
          });
        }

        // Create POS order
        const order = await tx.posOrder.create({
          data: {
            id: orderId,
            orderNumber,
            type: type || 'takeaway',
            subtotal,
            total: subtotal,
            status: 'completed',
            customerName,
            customerPhone,
            updatedAt: new Date(),
          },
        });

        // Create order items
        for (const orderItem of orderItems) {
          await tx.posOrderItem.create({
            data: orderItem,
          });
        }

        // Deduct stock using FIFO
        for (const item of items) {
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

            await tx.stockBatch.update({
              where: { id: batch.id },
              data: { qtyOnHand: parseFloat(batch.qtyOnHand.toString()) - qtyToDeduct },
            });

            await tx.stockLedger.create({
              data: {
                id: randomUUID(),
                itemId: item.itemId,
                warehouseId,
                batchId: batch.id,
                movementType: 'SALE',
                reference: orderNumber,
                qty: -qtyToDeduct,
              },
            });

            remainingQty -= qtyToDeduct;
          }

          if (remainingQty > 0) {
            throw new Error(`Insufficient stock for item ${item.itemId}`);
          }
        }

        return { order, success: true };
      });

      return res.status(201).json(result);
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    console.error('Error in POS handler:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
