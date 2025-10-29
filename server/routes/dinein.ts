import { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";

// Get all table areas
export const getTableAreas: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const areas = await prisma.tableArea.findMany({
      include: {
        tables: true
      },
      orderBy: { name: 'asc' }
    });
    res.json(areas);
  } catch (error) {
    console.error("Error fetching table areas:", error);
    res.status(500).json({ error: "Failed to fetch table areas" });
  }
};

// Create new table area
export const createTableArea: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const area = await prisma.tableArea.create({
      data: req.body,
      include: {
        tables: true
      }
    });
    res.status(201).json(area);
  } catch (error) {
    console.error("Error creating table area:", error);
    res.status(500).json({ error: "Failed to create table area" });
  }
};

// Get all dine-in tables
export const getDineInTables: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const tables = await prisma.dineInTable.findMany({
      include: {
        area: true,
        activeOrders: {
          where: {
            status: {
              in: ['PENDING', 'PREPARING', 'READY']
            }
          },
          include: {
            items: {
              include: {
                item: true
              }
            }
          }
        }
      },
      orderBy: [
        { areaId: 'asc' },
        { tableNumber: 'asc' }
      ]
    });
    res.json(tables);
  } catch (error) {
    console.error("Error fetching dine-in tables:", error);
    res.status(500).json({ error: "Failed to fetch dine-in tables" });
  }
};

// Create or update dine-in table
export const upsertDineInTable: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { areaId, tableNumber } = req.body;

    const table = await prisma.dineInTable.upsert({
      where: {
        areaId_tableNumber: {
          areaId,
          tableNumber
        }
      },
      update: req.body,
      create: req.body,
      include: {
        area: true
      }
    });

    res.json(table);
  } catch (error) {
    console.error("Error upserting dine-in table:", error);
    res.status(500).json({ error: "Failed to upsert dine-in table" });
  }
};

// Update table status
export const updateTableStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, currentGuestName, guestCount } = req.body;
    const prisma = getPrisma();

    const table = await prisma.dineInTable.update({
      where: { id },
      data: {
        status,
        currentGuestName,
        guestCount
      },
      include: {
        area: true,
        activeOrders: {
          include: {
            items: {
              include: {
                item: true
              }
            }
          }
        }
      }
    });

    res.json(table);
  } catch (error) {
    console.error("Error updating table status:", error);
    res.status(500).json({ error: "Failed to update table status" });
  }
};

// Create order for table
export const createTableOrder: RequestHandler = async (req, res) => {
  try {
    const { tableId, items, warehouseId } = req.body;
    const prisma = getPrisma();

    const order = await prisma.$transaction(async (tx) => {
      // Get table info
      const table = await tx.dineInTable.findUnique({
        where: { id: tableId }
      });

      if (!table) {
        throw new Error("Table not found");
      }

      // Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => 
        sum + (item.quantity * item.unitPrice), 0);
      const taxAmount = items.reduce((sum: number, item: any) => 
        sum + (item.taxAmount || 0), 0);
      const totalAmount = subtotal + taxAmount;

      // Create POS order
      const newOrder = await tx.posOrder.create({
        data: {
          orderNumber: `TBL-${table.tableNumber}-${Date.now()}`,
          orderType: 'DINE_IN',
          tableId,
          subtotal,
          taxAmount,
          totalAmount,
          status: 'PENDING',
          items: {
            create: items.map((item: any) => ({
              itemId: item.itemId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              taxAmount: item.taxAmount || 0,
              totalPrice: item.quantity * item.unitPrice + (item.taxAmount || 0)
            }))
          }
        },
        include: {
          items: {
            include: {
              item: true
            }
          },
          table: {
            include: {
              area: true
            }
          }
        }
      });

      // Update table status to occupied
      await tx.dineInTable.update({
        where: { id: tableId },
        data: {
          status: 'OCCUPIED'
        }
      });

      // Deduct items from warehouse
      if (warehouseId) {
        for (const item of items) {
          await tx.stockLedger.create({
            data: {
              warehouseId,
              itemId: item.itemId,
              quantity: -item.quantity,
              transactionType: 'POS_SALE',
              referenceId: newOrder.id,
              notes: `Dine-in order ${newOrder.orderNumber}`
            }
          });
        }
      }

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating table order:", error);
    res.status(500).json({ error: "Failed to create table order" });
  }
};

// Complete table order (checkout)
export const completeTableOrder: RequestHandler = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod } = req.body;
    const prisma = getPrisma();

    const result = await prisma.$transaction(async (tx) => {
      // Get order details
      const order = await tx.posOrder.findUnique({
        where: { id: orderId },
        include: {
          table: true,
          items: true
        }
      });

      if (!order) {
        throw new Error("Order not found");
      }

      // Create payment
      await tx.payment.create({
        data: {
          amount: order.totalAmount,
          paymentMethod: paymentMethod || 'CASH',
          referenceType: 'POS_ORDER',
          referenceId: orderId,
          notes: `Table ${order.table?.tableNumber} payment`
        }
      });

      // Update order status
      const completedOrder = await tx.posOrder.update({
        where: { id: orderId },
        data: {
          status: 'COMPLETED',
          paidAt: new Date()
        },
        include: {
          items: {
            include: {
              item: true
            }
          },
          table: {
            include: {
              area: true
            }
          }
        }
      });

      // Free up the table
      if (order.tableId) {
        await tx.dineInTable.update({
          where: { id: order.tableId },
          data: {
            status: 'AVAILABLE',
            currentGuestName: null,
            guestCount: null
          }
        });
      }

      return completedOrder;
    });

    res.json(result);
  } catch (error) {
    console.error("Error completing table order:", error);
    res.status(500).json({ error: "Failed to complete table order" });
  }
};
