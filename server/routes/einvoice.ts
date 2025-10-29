import { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";

// Get all invoices
export const getInvoices: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { status, startDate, endDate } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        posOrder: {
          include: {
            items: {
              include: {
                item: true
              }
            }
          }
        },
        tax: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

// Get single invoice by ID
export const getInvoiceById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = getPrisma();

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        posOrder: {
          include: {
            items: {
              include: {
                item: true
              }
            }
          }
        },
        tax: true
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
};

// Create invoice from POS order
export const createInvoice: RequestHandler = async (req, res) => {
  try {
    const { posOrderId, customerVatNumber, customerName, customerAddress } = req.body;
    const prisma = getPrisma();

    const invoice = await prisma.$transaction(async (tx) => {
      // Get POS order with items
      const posOrder = await tx.posOrder.findUnique({
        where: { id: posOrderId },
        include: {
          items: {
            include: {
              item: true
            }
          }
        }
      });

      if (!posOrder) {
        throw new Error("POS order not found");
      }

      // Get default tax rate
      const defaultTax = await tx.tax.findFirst({
        where: { isDefault: true }
      });

      // Create invoice
      const newInvoice = await tx.invoice.create({
        data: {
          invoiceNumber: `INV-${Date.now()}`,
          posOrderId,
          taxId: defaultTax?.id,
          subtotal: posOrder.subtotal,
          taxAmount: posOrder.taxAmount,
          totalAmount: posOrder.totalAmount,
          customerVatNumber: customerVatNumber || null,
          customerName: customerName || null,
          customerAddress: customerAddress || null,
          status: 'PENDING',
          einvoiceStatus: 'NOT_SENT'
        },
        include: {
          posOrder: {
            include: {
              items: {
                include: {
                  item: true
                }
              }
            }
          },
          tax: true
        }
      });

      return newInvoice;
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ error: "Failed to create invoice" });
  }
};

// Submit invoice to ZATCA (E-Invoice)
export const submitToZatca: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = getPrisma();

    // In a real implementation, this would:
    // 1. Generate the invoice XML according to ZATCA specs
    // 2. Sign the XML with the proper certificate
    // 3. Submit to ZATCA API
    // 4. Store the response (UUID, QR code, etc.)

    // For now, we'll just update the status
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        einvoiceStatus: 'SUBMITTED',
        einvoiceUuid: `ZATCA-${Date.now()}`, // This would be from ZATCA response
        submittedAt: new Date()
      },
      include: {
        posOrder: {
          include: {
            items: {
              include: {
                item: true
              }
            }
          }
        },
        tax: true
      }
    });

    res.json(invoice);
  } catch (error) {
    console.error("Error submitting to ZATCA:", error);
    res.status(500).json({ error: "Failed to submit to ZATCA" });
  }
};

// Get invoice statistics
export const getInvoiceStats: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { startDate, endDate } = req.query;

    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const [total, pending, submitted, approved, rejected] = await Promise.all([
      prisma.invoice.count({ where }),
      prisma.invoice.count({ where: { ...where, einvoiceStatus: 'PENDING' } }),
      prisma.invoice.count({ where: { ...where, einvoiceStatus: 'SUBMITTED' } }),
      prisma.invoice.count({ where: { ...where, einvoiceStatus: 'APPROVED' } }),
      prisma.invoice.count({ where: { ...where, einvoiceStatus: 'REJECTED' } })
    ]);

    const totalAmount = await prisma.invoice.aggregate({
      where,
      _sum: {
        totalAmount: true
      }
    });

    res.json({
      total,
      pending,
      submitted,
      approved,
      rejected,
      totalAmount: totalAmount._sum.totalAmount || 0
    });
  } catch (error) {
    console.error("Error fetching invoice stats:", error);
    res.status(500).json({ error: "Failed to fetch invoice statistics" });
  }
};
