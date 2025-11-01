import { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";

// Get all suppliers
export const getSuppliers: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const suppliers = await prisma.supplier.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
};

// Create new supplier
export const createSupplier: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const supplier = await prisma.supplier.create({
      data: req.body
    });
    res.status(201).json(supplier);
  } catch (error) {
    console.error("Error creating supplier:", error);
    res.status(500).json({ error: "Failed to create supplier" });
  }
};

// Update supplier
export const updateSupplier: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = getPrisma();
    const supplier = await prisma.supplier.update({
      where: { id },
      data: req.body
    });
    res.json(supplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ error: "Failed to update supplier" });
  }
};

// Get all purchase orders
export const getPurchaseOrders: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const orders = await prisma.purchaseOrder.findMany({
      include: {
        Supplier: true,
        PurchaseOrderLine: {
          include: {
            Item: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    res.status(500).json({ error: "Failed to fetch purchase orders" });
  }
};

// Create new purchase order
export const createPurchaseOrder: RequestHandler = async (req, res) => {
  try {
    const { supplierId, lines, ...orderData } = req.body;
    const prisma = getPrisma();

    const order = await prisma.$transaction(async (tx) => {
      // Create the purchase order
      const newOrder = await tx.purchaseOrder.create({
        data: {
          ...orderData,
          supplierId,
          PurchaseOrderLine: {
            create: lines.map((line: any) => ({
              itemId: line.itemId,
              qty: line.quantity,
              unitPrice: line.unitPrice,
              totalAmount: line.totalPrice
            }))
          }
        },
        include: {
          Supplier: true,
          PurchaseOrderLine: {
            include: {
              Item: true
            }
          }
        }
      });

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating purchase order:", error);
    res.status(500).json({ error: "Failed to create purchase order" });
  }
};

// Update purchase order status
export const updatePurchaseOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const prisma = getPrisma();

    const order = await prisma.purchaseOrder.update({
      where: { id },
      data: { status },
      include: {
        Supplier: true,
        PurchaseOrderLine: {
          include: {
            Item: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    console.error("Error updating purchase order:", error);
    res.status(500).json({ error: "Failed to update purchase order" });
  }
};
