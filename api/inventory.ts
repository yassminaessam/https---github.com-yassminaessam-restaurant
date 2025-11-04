import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../server/lib/prisma.js';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const prisma = getPrisma();
  const path = req.url?.split('/api/inventory')[1]?.split('?')[0] || '';

  try {
    // /api/inventory/topology - GET warehouses and categories
    if (path === '/topology' && req.method === 'GET') {
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

      return res.json({
        warehouses,
        categories: categories.map(c => ({ name: c.category })),
      });
    }

    // /api/inventory/stock-summary - GET stock summary
    if (path === '/stock-summary' && req.method === 'GET') {
      const stockBatches = await prisma.stockBatch.findMany({
        include: {
          Item: {
            select: {
              sku: true,
              name: true,
              baseUom: true,
              category: true,
            },
          },
          Warehouse: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      });

      const summary = stockBatches.map((batch) => ({
        itemSku: batch.Item.sku,
        itemName: batch.Item.name,
        warehouseCode: batch.Warehouse.code,
        warehouseName: batch.Warehouse.name,
        quantity: batch.qtyOnHand,
        baseUom: batch.Item.baseUom,
        category: batch.Item.category,
        lotNumber: batch.lotNumber,
        expiryDate: batch.expiryDate,
      }));

      return res.json(summary);
    }

    // /api/inventory/movements - GET stock movements
    if (path === '/movements' && req.method === 'GET') {
      const { limit = '50' } = req.query;
      
      const movements = await prisma.stockLedger.findMany({
        take: parseInt(limit as string),
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          Item: {
            select: {
              name: true,
              sku: true,
            },
          },
          Warehouse: {
            select: {
              name: true,
              code: true,
            },
          },
        },
      });

      return res.json(movements);
    }

    // /api/inventory/items - GET all items or POST create item
    if (path === '/items') {
      if (req.method === 'GET') {
        const items = await prisma.item.findMany({
          include: {
            ItemPrice: true,
          },
        });

        const formattedItems = items.map((item) => ({
          ...item,
          prices: item.ItemPrice,
        }));

        return res.json(formattedItems);
      }

      if (req.method === 'POST') {
        const { sku, name, baseUom, category, initialStock, warehouseId, salePrice, costPrice, initial } = req.body;

        if (!sku || !name || !baseUom) {
          return res.status(400).json({ error: 'sku, name, baseUom are required' });
        }

        const item = await prisma.item.create({
          data: {
            id: randomUUID(),
            sku,
            name,
            category: category || 'General',
            baseUom,
          },
        });

        // Handle both old format (initialStock/warehouseId) and new format (initial object)
        const quantity = initial?.quantity ?? initialStock;
        const warehouse = initial?.warehouseCode ?? warehouseId;
        const cost = initial?.avgCost ?? costPrice;

        if (quantity && warehouse) {
          // Find warehouse by code
          const warehouseRecord = await prisma.warehouse.findFirst({
            where: { code: warehouse },
          });

          if (warehouseRecord) {
            await prisma.stockBatch.create({
              data: {
                id: randomUUID(),
                itemId: item.id,
                warehouseId: warehouseRecord.id,
                qtyOnHand: quantity,
                costPrice: cost || 0,
              },
            });

            // Create ledger entry
            await prisma.stockLedger.create({
              data: {
                id: randomUUID(),
                itemId: item.id,
                warehouseId: warehouseRecord.id,
                movementType: 'INITIAL',
                reference: `INIT-${item.sku}`,
                qty: quantity,
                costAmount: quantity * (cost || 0),
              },
            });
          }
        }

        if (salePrice && costPrice) {
          await prisma.itemPrice.create({
            data: {
              id: randomUUID(),
              itemId: item.id,
              salePrice,
              costPrice,
              updatedAt: new Date(),
            },
          });
        }

        return res.status(201).json({ success: true, item });
      }
    }

    // /api/inventory/grn - POST create goods receipt
    if (path === '/grn' && req.method === 'POST') {
      const { warehouseId, items } = req.body;

      if (!warehouseId || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'warehouseId and items[] are required' });
      }

      const result = await prisma.$transaction(async (tx: any) => {
        const grnId = randomUUID();
        const grnNumber = `GRN-${Date.now()}`;
        
        const grn = await tx.goodsReceiptNote.create({
          data: {
            id: grnId,
            grnNumber,
            warehouseId,
            status: 'completed',
            grnDate: new Date(),
            updatedAt: new Date(),
          },
        });

        for (const item of items) {
          await tx.goodsReceiptLine.create({
            data: {
              id: randomUUID(),
              grnId,
              itemId: item.itemId,
              qtyReceived: item.quantity,
              costPrice: item.costPrice || 0,
              createdAt: new Date(),
            },
          });

          await tx.stockBatch.create({
            data: {
              id: randomUUID(),
              itemId: item.itemId,
              warehouseId,
              qtyOnHand: item.quantity,
              costPrice: item.costPrice || 0,
              lotNumber: item.lotNumber || null,
              expiryDate: item.expiryDate || null,
            },
          });

          await tx.stockLedger.create({
            data: {
              id: randomUUID(),
              itemId: item.itemId,
              warehouseId,
              movementType: 'GRN',
              reference: grnNumber,
              qty: item.quantity,
              costAmount: item.quantity * (item.costPrice || 0),
            },
          });
        }

        return grn;
      });

      return res.status(201).json({ success: true, grn: result });
    }

    // /api/inventory/transfer - POST create stock transfer
    if (path === '/transfer' && req.method === 'POST') {
      const { fromWarehouseId, toWarehouseId, items, userId } = req.body;

      if (!fromWarehouseId || !toWarehouseId || !items) {
        return res.status(400).json({ error: 'fromWarehouseId, toWarehouseId, and items[] required' });
      }

      const result = await prisma.$transaction(async (tx: any) => {
        const transferId = randomUUID();
        const transferNumber = `TRF-${Date.now()}`;

        const transfer = await tx.stockTransfer.create({
          data: {
            id: transferId,
            transferNumber,
            fromWarehouseId,
            toWarehouseId,
            userId: userId || randomUUID(),
            status: 'completed',
            updatedAt: new Date(),
          },
        });

        for (const item of items) {
          await tx.stockTransferLine.create({
            data: {
              id: randomUUID(),
              transferId,
              itemId: item.itemId,
              qty: item.quantity,
            },
          });

          const fromBatches = await tx.stockBatch.findMany({
            where: {
              itemId: item.itemId,
              warehouseId: fromWarehouseId,
              qtyOnHand: { gt: 0 },
            },
            orderBy: { receivedAt: 'asc' },
          });

          let remainingQty = parseFloat(item.quantity);
          
          for (const batch of fromBatches) {
            if (remainingQty <= 0) break;
            
            const qtyToTransfer = Math.min(parseFloat(batch.qtyOnHand.toString()), remainingQty);
            
            await tx.stockBatch.update({
              where: { id: batch.id },
              data: { qtyOnHand: parseFloat(batch.qtyOnHand.toString()) - qtyToTransfer },
            });

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

      return res.status(201).json(result);
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    console.error('Error in inventory handler:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
