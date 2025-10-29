import { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";

// Get all drivers
export const getDrivers: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const drivers = await prisma.driver.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
};

// Create new driver
export const createDriver: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const driver = await prisma.driver.create({
      data: req.body
    });
    res.status(201).json(driver);
  } catch (error) {
    console.error("Error creating driver:", error);
    res.status(500).json({ error: "Failed to create driver" });
  }
};

// Update driver
export const updateDriver: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = getPrisma();
    const driver = await prisma.driver.update({
      where: { id },
      data: req.body
    });
    res.json(driver);
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({ error: "Failed to update driver" });
  }
};

// Get all delivery orders
export const getDeliveryOrders: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { status } = req.query;

    const where = status ? { status: status as string } : {};

    const orders = await prisma.deliveryOrder.findMany({
      where,
      include: {
        driver: true,
        posOrder: {
          include: {
            items: {
              include: {
                item: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching delivery orders:", error);
    res.status(500).json({ error: "Failed to fetch delivery orders" });
  }
};

// Create new delivery order
export const createDeliveryOrder: RequestHandler = async (req, res) => {
  try {
    const { items, warehouseId, driverId, customerInfo, ...orderData } = req.body;
    const prisma = getPrisma();

    const order = await prisma.$transaction(async (tx) => {
      // Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => 
        sum + (item.quantity * item.unitPrice), 0);
      const taxAmount = items.reduce((sum: number, item: any) => 
        sum + (item.taxAmount || 0), 0);
      const deliveryFee = orderData.deliveryFee || 0;
      const totalAmount = subtotal + taxAmount + deliveryFee;

      // Create POS order first
      const posOrder = await tx.posOrder.create({
        data: {
          orderNumber: `DEL-${Date.now()}`,
          orderType: 'DELIVERY',
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
          }
        }
      });

      // Create delivery order
      const deliveryOrder = await tx.deliveryOrder.create({
        data: {
          posOrderId: posOrder.id,
          driverId: driverId || null,
          deliveryAddress: customerInfo.address,
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          deliveryFee,
          status: 'PENDING'
        },
        include: {
          driver: true,
          posOrder: {
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

      // Deduct items from warehouse
      if (warehouseId) {
        for (const item of items) {
          await tx.stockLedger.create({
            data: {
              warehouseId,
              itemId: item.itemId,
              quantity: -item.quantity,
              transactionType: 'POS_SALE',
              referenceId: posOrder.id,
              notes: `Delivery order ${posOrder.orderNumber}`
            }
          });
        }
      }

      return deliveryOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating delivery order:", error);
    res.status(500).json({ error: "Failed to create delivery order" });
  }
};

// Assign driver to delivery
export const assignDriver: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverId } = req.body;
    const prisma = getPrisma();

    const order = await prisma.deliveryOrder.update({
      where: { id },
      data: {
        driverId,
        status: 'ASSIGNED'
      },
      include: {
        driver: true,
        posOrder: {
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

    res.json(order);
  } catch (error) {
    console.error("Error assigning driver:", error);
    res.status(500).json({ error: "Failed to assign driver" });
  }
};

// Get all delivery areas
export const getDeliveryAreas: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const areas = await prisma.deliveryArea.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(areas);
  } catch (error) {
    console.error("Error fetching delivery areas:", error);
    res.status(500).json({ error: "Failed to fetch delivery areas" });
  }
};

// Create new delivery area
export const createDeliveryArea: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { name, deliveryFee, estimatedTime } = req.body;
    
    // Generate unique code from name
    const code = name.replace(/\s+/g, '_').toUpperCase();
    
    const area = await prisma.deliveryArea.create({
      data: {
        code,
        name,
        deliveryFee,
        estimatedTime,
        isActive: true
      }
    });
    res.status(201).json(area);
  } catch (error) {
    console.error("Error creating delivery area:", error);
    res.status(500).json({ error: "Failed to create delivery area" });
  }
};

// Update delivery area
export const updateDeliveryArea: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = getPrisma();
    const area = await prisma.deliveryArea.update({
      where: { id },
      data: req.body
    });
    res.json(area);
  } catch (error) {
    console.error("Error updating delivery area:", error);
    res.status(500).json({ error: "Failed to update delivery area" });
  }
};

// Update delivery status
export const updateDeliveryStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const prisma = getPrisma();

    const updateData: any = { status };

    // Set timestamps based on status
    if (status === 'PICKED_UP') {
      updateData.pickedUpAt = new Date();
    } else if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }

    const order = await prisma.deliveryOrder.update({
      where: { id },
      data: updateData,
      include: {
        driver: true,
        posOrder: {
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

    // If delivered, update POS order and create payment
    if (status === 'DELIVERED') {
      await prisma.$transaction(async (tx) => {
        await tx.posOrder.update({
          where: { id: order.posOrderId },
          data: {
            status: 'COMPLETED',
            paidAt: new Date()
          }
        });

        await tx.payment.create({
          data: {
            amount: order.posOrder.totalAmount,
            paymentMethod: 'CASH',
            referenceType: 'POS_ORDER',
            referenceId: order.posOrderId,
            notes: `Delivery order payment`
          }
        });
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({ error: "Failed to update delivery status" });
  }
};
