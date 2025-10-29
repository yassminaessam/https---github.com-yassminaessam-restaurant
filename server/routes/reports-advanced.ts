import { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";

// Get sales report
export const getSalesReport: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { startDate, endDate, orderType } = req.query;

    const where: any = {
      status: 'COMPLETED'
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    if (orderType) {
      where.orderType = orderType;
    }

    const orders = await prisma.posOrder.findMany({
      where,
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
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate summary
    const summary = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      totalTax: orders.reduce((sum, order) => sum + order.taxAmount, 0),
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length 
        : 0,
      byOrderType: {} as Record<string, { count: number; revenue: number }>
    };

    // Group by order type
    orders.forEach(order => {
      if (!summary.byOrderType[order.orderType]) {
        summary.byOrderType[order.orderType] = { count: 0, revenue: 0 };
      }
      summary.byOrderType[order.orderType].count++;
      summary.byOrderType[order.orderType].revenue += order.totalAmount;
    });

    res.json({ summary, orders });
  } catch (error) {
    console.error("Error fetching sales report:", error);
    res.status(500).json({ error: "Failed to fetch sales report" });
  }
};

// Get inventory valuation report
export const getInventoryValuation: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();

    // Get all warehouses with their items
    const warehouses = await prisma.warehouse.findMany({
      include: {
        stockBatches: {
          include: {
            item: {
              include: {
                currentPrice: true
              }
            }
          },
          where: {
            currentQuantity: {
              gt: 0
            }
          }
        }
      }
    });

    const valuation = warehouses.map(warehouse => {
      let totalValue = 0;
      let totalItems = 0;

      const items = warehouse.stockBatches.map(batch => {
        const value = batch.currentQuantity * (batch.item.currentPrice?.price || batch.unitCost);
        totalValue += value;
        totalItems += batch.currentQuantity;

        return {
          itemCode: batch.item.code,
          itemName: batch.item.name,
          quantity: batch.currentQuantity,
          unitCost: batch.unitCost,
          currentPrice: batch.item.currentPrice?.price || 0,
          totalValue: value
        };
      });

      return {
        warehouseCode: warehouse.code,
        warehouseName: warehouse.name,
        totalItems,
        totalValue,
        items
      };
    });

    const grandTotal = valuation.reduce((sum, wh) => sum + wh.totalValue, 0);

    res.json({ valuation, grandTotal });
  } catch (error) {
    console.error("Error fetching inventory valuation:", error);
    res.status(500).json({ error: "Failed to fetch inventory valuation" });
  }
};

// Get best selling items report
export const getBestSellingItems: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { startDate, endDate, limit = '20' } = req.query;

    const where: any = {
      posOrder: {
        status: 'COMPLETED'
      }
    };

    if (startDate || endDate) {
      where.posOrder.createdAt = {};
      if (startDate) where.posOrder.createdAt.gte = new Date(startDate as string);
      if (endDate) where.posOrder.createdAt.lte = new Date(endDate as string);
    }

    const items = await prisma.posOrderItem.groupBy({
      by: ['itemId'],
      where,
      _sum: {
        quantity: true,
        totalPrice: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: parseInt(limit as string)
    });

    // Get item details
    const itemDetails = await Promise.all(
      items.map(async (item) => {
        const itemInfo = await prisma.item.findUnique({
          where: { id: item.itemId },
          include: {
            currentPrice: true
          }
        });

        return {
          itemCode: itemInfo?.code,
          itemName: itemInfo?.name,
          quantitySold: item._sum.quantity || 0,
          revenue: item._sum.totalPrice || 0,
          orderCount: item._count.id
        };
      })
    );

    res.json(itemDetails);
  } catch (error) {
    console.error("Error fetching best selling items:", error);
    res.status(500).json({ error: "Failed to fetch best selling items" });
  }
};

// Get purchase orders report
export const getPurchaseOrdersReport: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { startDate, endDate, status } = req.query;

    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    if (status) {
      where.status = status;
    }

    const orders = await prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: true,
        lines: {
          include: {
            item: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const summary = {
      totalOrders: orders.length,
      totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      byStatus: {} as Record<string, { count: number; amount: number }>,
      bySupplier: {} as Record<string, { count: number; amount: number }>
    };

    orders.forEach(order => {
      // By status
      if (!summary.byStatus[order.status]) {
        summary.byStatus[order.status] = { count: 0, amount: 0 };
      }
      summary.byStatus[order.status].count++;
      summary.byStatus[order.status].amount += order.totalAmount;

      // By supplier
      const supplierName = order.supplier.name;
      if (!summary.bySupplier[supplierName]) {
        summary.bySupplier[supplierName] = { count: 0, amount: 0 };
      }
      summary.bySupplier[supplierName].count++;
      summary.bySupplier[supplierName].amount += order.totalAmount;
    });

    res.json({ summary, orders });
  } catch (error) {
    console.error("Error fetching purchase orders report:", error);
    res.status(500).json({ error: "Failed to fetch purchase orders report" });
  }
};

// Get delivery performance report
export const getDeliveryPerformance: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { startDate, endDate } = req.query;

    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const deliveries = await prisma.deliveryOrder.findMany({
      where,
      include: {
        driver: true,
        posOrder: true
      }
    });

    const driverStats: Record<string, any> = {};

    deliveries.forEach(delivery => {
      if (delivery.driver) {
        const driverName = delivery.driver.name;
        if (!driverStats[driverName]) {
          driverStats[driverName] = {
            totalDeliveries: 0,
            completedDeliveries: 0,
            totalRevenue: 0,
            totalDeliveryFees: 0
          };
        }

        driverStats[driverName].totalDeliveries++;
        if (delivery.status === 'DELIVERED') {
          driverStats[driverName].completedDeliveries++;
        }
        driverStats[driverName].totalRevenue += delivery.posOrder.totalAmount;
        driverStats[driverName].totalDeliveryFees += delivery.deliveryFee;
      }
    });

    res.json({
      totalDeliveries: deliveries.length,
      completedDeliveries: deliveries.filter(d => d.status === 'DELIVERED').length,
      driverStats
    });
  } catch (error) {
    console.error("Error fetching delivery performance:", error);
    res.status(500).json({ error: "Failed to fetch delivery performance" });
  }
};
