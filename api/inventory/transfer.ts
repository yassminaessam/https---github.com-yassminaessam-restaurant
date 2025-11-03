import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../../server/lib/prisma.js';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const prisma = getPrisma();
    const { fromWarehouseId, toWarehouseId, items, userId } = req.body;

    if (!fromWarehouseId || !toWarehouseId || !items) {
      return res.status(400).json({ error: 'fromWarehouseId, toWarehouseId, and items[] required' });
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const transferId = randomUUID();
      const transferNumber = `TRF-${Date.now()}`;

      // Create transfer record
      const transfer = await tx.stockTransfer.create({
        data: {
          id: transferId,
          transferNumber,
          fromWarehouseId,
          toWarehouseId,
          userId: userId || randomUUID(), // Placeholder if no user
          status: 'completed',
          updatedAt: new Date(),
        },
      });

      for (const item of items) {
        // Create transfer line
        await tx.stockTransferLine.create({
          data: {
            id: randomUUID(),
            transferId,
            itemId: item.itemId,
            qty: item.quantity,
          },
        });

        // Get stock from source warehouse
        const fromBatches = await tx.stockBatch.findMany({
          where: {
            itemId: item.itemId,
            warehouseId: fromWarehouseId,
            qtyOnHand: { gt: 0 },
          },
          orderBy: { receivedAt: 'asc' }, // FIFO
        });

        let remainingQty = parseFloat(item.quantity);
        
        for (const batch of fromBatches) {
          if (remainingQty <= 0) break;
          
          const qtyToTransfer = Math.min(parseFloat(batch.qtyOnHand.toString()), remainingQty);
          
          // Reduce source batch
          await tx.stockBatch.update({
            where: { id: batch.id },
            data: { qtyOnHand: parseFloat(batch.qtyOnHand.toString()) - qtyToTransfer },
          });

          // Create batch in destination
          await tx.stockBatch.create({
            data: {
              id: randomUUID(),
              itemId: item.itemId,
              warehouseId: toWarehouseId,
              qtyOnHand: qtyToTransfer,
              costPrice: batch.costPrice,
              lotNumber: batch.lotNumber,
              expiryDate: batch.expiryDate,
            },
          });

          // Record movements
          await tx.stockLedger.create({
            data: {
              id: randomUUID(),
              itemId: item.itemId,
              warehouseId: fromWarehouseId,
              movementType: 'TRANSFER_OUT',
              reference: transferNumber,
              qty: -qtyToTransfer,
            },
          });

          await tx.stockLedger.create({
            data: {
              id: randomUUID(),
              itemId: item.itemId,
              warehouseId: toWarehouseId,
              movementType: 'TRANSFER_IN',
              reference: transferNumber,
              qty: qtyToTransfer,
            },
          });

          remainingQty -= qtyToTransfer;
        }

        if (remainingQty > 0) {
          throw new Error(`Insufficient stock for item ${item.itemId}`);
        }
      }

      return { transfer, success: true };
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating transfer:', error);
    res.status(500).json({ error: 'Failed to create transfer', message: error.message });
  }
}
