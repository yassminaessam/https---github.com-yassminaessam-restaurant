import { RequestHandler } from "express";
import { v4 as uuid } from "uuid";
import { getPrisma } from "../lib/prisma";

const prisma = getPrisma();

// إضافة بيانات تجريبية شاملة
export const seedTestData: RequestHandler = async (req, res) => {
  const startTime = Date.now();
  
  try {
    // استخدام Transaction لضمان إضافة جميع البيانات معاً
    const result = await prisma.$transaction(async (tx) => {
      // 1. إضافة مستودعات
      const mainWarehouse = await tx.warehouse.create({
        data: {
          id: uuid(),
          code: "WH-MAIN",
          name: "المستودع الرئيسي",
          type: "storage"
        }
      });

      const kitchenWarehouse = await tx.warehouse.create({
        data: {
          id: uuid(),
          code: "WH-KITCHEN",
          name: "مستودع المطبخ",
          type: "production"
        }
      });

      // 2. إضافة أصناف
      const items = await Promise.all([
        tx.item.create({
          data: {
            id: uuid(),
            sku: "ITEM-001",
            name: "أرز بسمتي - كيس 5 كجم",
            category: "مواد خام",
            type: "raw_material",
            baseUom: "kg"
          }
        }),
        tx.item.create({
          data: {
            id: uuid(),
            sku: "ITEM-002",
            name: "دجاج طازج - كجم",
            category: "لحوم",
            type: "raw_material",
            baseUom: "kg"
          }
        }),
        tx.item.create({
          data: {
            id: uuid(),
            sku: "ITEM-003",
            name: "بيبسي - علبة 330 مل",
            category: "مشروبات",
            type: "finished_good",
            baseUom: "piece"
          }
        }),
        tx.item.create({
          data: {
            id: uuid(),
            sku: "ITEM-004",
            name: "برجر لحم",
            category: "وجبات",
            type: "finished_good",
            baseUom: "piece"
          }
        })
      ]);

      // 3. إضافة أسعار للأصناف
      await Promise.all(items.map(item => 
        tx.itemPrice.create({
          data: {
            id: uuid(),
            itemId: item.id,
            currency: "EGP",
            salePrice: Math.random() * 100 + 50, // سعر عشوائي بين 50-150
            costPrice: Math.random() * 50 + 20,  // تكلفة عشوائية بين 20-70
            taxRate: 14,
            updatedAt: new Date()
          }
        })
      ));

      // 4. إضافة مخزون (Stock Batches)
      const batches = await Promise.all([
        tx.stockBatch.create({
          data: {
            id: uuid(),
            itemId: items[0].id,
            lotNumber: "LOT-001",
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            qtyOnHand: 100,
            costPrice: 35,
            warehouseId: mainWarehouse.id
          }
        }),
        tx.stockBatch.create({
          data: {
            id: uuid(),
            itemId: items[1].id,
            lotNumber: "LOT-002",
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            qtyOnHand: 50,
            costPrice: 65,
            warehouseId: mainWarehouse.id
          }
        }),
        tx.stockBatch.create({
          data: {
            id: uuid(),
            itemId: items[2].id,
            qtyOnHand: 200,
            costPrice: 8,
            warehouseId: mainWarehouse.id
          }
        })
      ]);

      // 5. إضافة حركات مخزون
      await Promise.all(batches.map(batch =>
        tx.stockLedger.create({
          data: {
            id: uuid(),
            itemId: batch.itemId,
            warehouseId: batch.warehouseId,
            batchId: batch.id,
            movementType: "in",
            reference: "INITIAL-STOCK",
            qty: batch.qtyOnHand,
            costAmount: Number(batch.qtyOnHand) * Number(batch.costPrice)
          }
        })
      ));

      // 6. إضافة موردين
      const suppliers = await Promise.all([
        tx.supplier.create({
          data: {
            id: uuid(),
            code: "SUP-001",
            name: "شركة المواد الغذائية",
            contact: "01012345678"
          }
        }),
        tx.supplier.create({
          data: {
            id: uuid(),
            code: "SUP-002",
            name: "مورد اللحوم الطازجة",
            contact: "01098765432"
          }
        })
      ]);

      // 7. إضافة مستخدمين
      const users = await Promise.all([
        tx.user.create({
          data: {
            id: uuid(),
            email: "admin@restaurant.com",
            name: "المدير العام",
            password: "123456", // في الإنتاج يجب استخدام hash
            role: "admin"
          }
        }),
        tx.user.create({
          data: {
            id: uuid(),
            email: "cashier@restaurant.com",
            name: "أمين الصندوق",
            password: "123456",
            role: "staff"
          }
        })
      ]);

      // 8. إضافة أمر شراء
      const po = await tx.purchaseOrder.create({
        data: {
          id: uuid(),
          poNumber: `PO-${Date.now()}`,
          supplierId: suppliers[0].id,
          status: "draft",
          poDate: new Date(),
          expectedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        }
      });

      await Promise.all([
        tx.purchaseOrderLine.create({
          data: {
            id: uuid(),
            poId: po.id,
            itemId: items[0].id,
            qty: 50,
            unitPrice: 35,
            totalAmount: 50 * 35
          }
        }),
        tx.purchaseOrderLine.create({
          data: {
            id: uuid(),
            poId: po.id,
            itemId: items[1].id,
            qty: 30,
            unitPrice: 65,
            totalAmount: 30 * 65
          }
        })
      ]);

      // 9. إضافة وصفة إنتاج
      const recipe = await tx.recipe.create({
        data: {
          id: uuid(),
          code: "REC-001",
          name: "برجر لحم مع بطاطس",
          description: "وجبة برجر كاملة",
          yieldQty: 1,
          yieldUom: "piece",
          updatedAt: new Date()
        }
      });

      await Promise.all([
        tx.recipeLine.create({
          data: {
            id: uuid(),
            recipeId: recipe.id,
            itemId: items[0].id, // أرز
            qty: 0.2,
            uom: "kg"
          }
        }),
        tx.recipeLine.create({
          data: {
            id: uuid(),
            recipeId: recipe.id,
            itemId: items[1].id, // دجاج
            qty: 0.15,
            uom: "kg"
          }
        })
      ]);

      // 10. إضافة مناطق طاولات
      const tableArea = await tx.tableArea.create({
        data: {
          id: uuid(),
          code: "AREA-1",
          name: "القاعة الرئيسية"
        }
      });

      // 11. إضافة طاولات
      await Promise.all([1, 2, 3, 4, 5].map(num =>
        tx.dineInTable.create({
          data: {
            id: uuid(),
            tableNumber: num,
            areaId: tableArea.id,
            capacity: 4,
            status: "free",
            updatedAt: new Date()
          }
        })
      ));

      // 12. إضافة سائقين
      await Promise.all([
        tx.driver.create({
          data: {
            id: uuid(),
            code: "DRV-001",
            name: "محمد أحمد",
            phone: "01011111111",
            status: "available",
            vehicleNumber: "أ ب ج 1234",
            vehicleType: "دراجة نارية"
          }
        }),
        tx.driver.create({
          data: {
            id: uuid(),
            code: "DRV-002",
            name: "أحمد محمود",
            phone: "01022222222",
            status: "available",
            vehicleNumber: "د ه و 5678",
            vehicleType: "سيارة"
          }
        })
      ]);

      // 13. إضافة مناطق توصيل
      await Promise.all([
        tx.deliveryArea.create({
          data: {
            id: uuid(),
            code: "AREA-MAADI",
            name: "المعادي",
            deliveryFee: 25,
            estimatedTime: 30,
            updatedAt: new Date()
          }
        }),
        tx.deliveryArea.create({
          data: {
            id: uuid(),
            code: "AREA-HELIOPOLIS",
            name: "مصر الجديدة",
            deliveryFee: 30,
            estimatedTime: 40,
            updatedAt: new Date()
          }
        })
      ]);

      // 14. إضافة غرف فندقية
      await Promise.all([101, 102, 103, 201, 202].map(num =>
        tx.hotelRoom.create({
          data: {
            id: uuid(),
            roomNumber: num.toString(),
            floor: Math.floor(num / 100),
            category: num > 200 ? "deluxe" : "standard",
            status: "available"
          }
        })
      ));

      // 15. إضافة أمر بيع
      const posOrder = await tx.posOrder.create({
        data: {
          id: uuid(),
          orderNumber: `ORD-${Date.now()}`,
          userId: users[1].id,
          type: "dine_in",
          status: "completed",
          source: "pos",
          subtotal: 150,
          taxAmount: 21,
          discountAmount: 0,
          total: 171,
          customerName: "عميل تجريبي",
          updatedAt: new Date(),
          paidAt: new Date()
        }
      });

      await Promise.all([
        tx.posOrderItem.create({
          data: {
            id: uuid(),
            orderId: posOrder.id,
            itemId: items[3].id, // برجر
            qty: 2,
            unitPrice: 50,
            taxRate: 14,
            discount: 0,
            lineTotal: 100
          }
        }),
        tx.posOrderItem.create({
          data: {
            id: uuid(),
            orderId: posOrder.id,
            itemId: items[2].id, // بيبسي
            qty: 2,
            unitPrice: 25,
            taxRate: 14,
            discount: 0,
            lineTotal: 50
          }
        })
      ]);

      await tx.payment.create({
        data: {
          id: uuid(),
          orderId: posOrder.id,
          method: "cash",
          amount: 171,
          reference: null
        }
      });

      // 16. إضافة إعدادات النظام
      await tx.systemSettings.createMany({
        data: [
          {
            id: uuid(),
            key: "restaurant_name",
            value: JSON.stringify({ ar: "مطعم النجمة الذهبية", en: "Golden Star Restaurant" }),
            updatedAt: new Date()
          },
          {
            id: uuid(),
            key: "tax_rate",
            value: JSON.stringify({ rate: 14, type: "percentage" }),
            updatedAt: new Date()
          },
          {
            id: uuid(),
            key: "currency",
            value: JSON.stringify({ code: "EGP", symbol: "ج.م" }),
            updatedAt: new Date()
          }
        ]
      });

      return {
        warehouses: 2,
        items: items.length,
        batches: batches.length,
        suppliers: suppliers.length,
        users: users.length,
        purchaseOrders: 1,
        recipes: 1,
        tableAreas: 1,
        tables: 5,
        drivers: 2,
        deliveryAreas: 2,
        hotelRooms: 5,
        posOrders: 1,
        settings: 3
      };
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    res.json({
      success: true,
      message: "تم إضافة البيانات التجريبية بنجاح",
      duration: `${duration}ms`,
      data: result
    });
  } catch (error: any) {
    console.error("خطأ في إضافة البيانات:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// حذف جميع البيانات التجريبية
export const clearTestData: RequestHandler = async (req, res) => {
  const startTime = Date.now();
  
  try {
    await prisma.$transaction(async (tx) => {
      // يجب الحذف بترتيب معكوس (من الجداول التابعة إلى الرئيسية)
      await tx.payment.deleteMany();
      await tx.posOrderItem.deleteMany();
      await tx.invoice.deleteMany();
      await tx.posOrder.deleteMany();
      
      await tx.productionOutput.deleteMany();
      await tx.productionConsumption.deleteMany();
      await tx.productionOrder.deleteMany();
      await tx.recipeLine.deleteMany();
      await tx.recipe.deleteMany();
      
      await tx.goodsReceiptLine.deleteMany();
      await tx.goodsReceiptNote.deleteMany();
      await tx.purchaseOrderLine.deleteMany();
      await tx.purchaseOrder.deleteMany();
      
      await tx.stockTransferLine.deleteMany();
      await tx.stockTransfer.deleteMany();
      await tx.stockCountLine.deleteMany();
      await tx.stockCount.deleteMany();
      await tx.stockLedger.deleteMany();
      await tx.stockBatch.deleteMany();
      
      await tx.roomCharge.deleteMany();
      await tx.folio.deleteMany();
      await tx.hotelRoom.deleteMany();
      
      await tx.dineInTable.deleteMany();
      await tx.tableArea.deleteMany();
      
      await tx.deliveryOrder.deleteMany();
      await tx.deliveryArea.deleteMany();
      await tx.driver.deleteMany();
      
      await tx.itemPrice.deleteMany();
      await tx.item.deleteMany();
      
      await tx.supplier.deleteMany();
      await tx.user.deleteMany();
      await tx.warehouse.deleteMany();
      
      await tx.systemSettings.deleteMany();
      await tx.auditLog.deleteMany();
      await tx.syncQueue.deleteMany();
      await tx.tax.deleteMany();
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    res.json({
      success: true,
      message: "تم حذف جميع البيانات بنجاح",
      duration: `${duration}ms`
    });
  } catch (error: any) {
    console.error("خطأ في حذف البيانات:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// عرض إحصائيات قاعدة البيانات
export const getDbStats: RequestHandler = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const stats = await prisma.$transaction(async (tx) => {
      const [
        warehouses,
        items,
        batches,
        suppliers,
        users,
        purchaseOrders,
        recipes,
        tableAreas,
        tables,
        drivers,
        deliveryAreas,
        hotelRooms,
        posOrders,
        settings,
        stockMovements
      ] = await Promise.all([
        tx.warehouse.count(),
        tx.item.count(),
        tx.stockBatch.count(),
        tx.supplier.count(),
        tx.user.count(),
        tx.purchaseOrder.count(),
        tx.recipe.count(),
        tx.tableArea.count(),
        tx.dineInTable.count(),
        tx.driver.count(),
        tx.deliveryArea.count(),
        tx.hotelRoom.count(),
        tx.posOrder.count(),
        tx.systemSettings.count(),
        tx.stockLedger.count()
      ]);

      return {
        warehouses,
        items,
        batches,
        suppliers,
        users,
        purchaseOrders,
        recipes,
        tableAreas,
        tables,
        drivers,
        deliveryAreas,
        hotelRooms,
        posOrders,
        settings,
        stockMovements
      };
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    res.json({
      success: true,
      duration: `${duration}ms`,
      stats
    });
  } catch (error: any) {
    console.error("خطأ في جلب الإحصائيات:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// اختبار أداء الاستعلامات
export const performanceTest: RequestHandler = async (req, res) => {
  try {
    const tests = [];

    // 1. اختبار استعلام بسيط
    const simpleStart = Date.now();
    await prisma.item.findMany({ take: 10 });
    tests.push({
      name: "Simple Query (10 items)",
      duration: `${Date.now() - simpleStart}ms`
    });

    // 2. اختبار استعلام مع علاقات
    const relationStart = Date.now();
    await prisma.item.findMany({
      take: 10,
      include: {
        ItemPrice: true,
        StockBatch: true
      }
    });
    tests.push({
      name: "Query with Relations",
      duration: `${Date.now() - relationStart}ms`
    });

    // 3. اختبار استعلام معقد
    const complexStart = Date.now();
    await prisma.posOrder.findMany({
      take: 10,
      include: {
        PosOrderItem: {
          include: {
            Item: true
          }
        },
        Payment: true,
        User: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    tests.push({
      name: "Complex Query (Orders with Items)",
      duration: `${Date.now() - complexStart}ms`
    });

    // 4. اختبار Aggregation
    const aggStart = Date.now();
    await prisma.posOrder.aggregate({
      _sum: {
        total: true,
        taxAmount: true
      },
      _count: true,
      _avg: {
        total: true
      }
    });
    tests.push({
      name: "Aggregation Query",
      duration: `${Date.now() - aggStart}ms`
    });

    // 5. اختبار Raw Query
    const rawStart = Date.now();
    await prisma.$queryRaw`SELECT COUNT(*) FROM "Item"`;
    tests.push({
      name: "Raw SQL Query",
      duration: `${Date.now() - rawStart}ms`
    });

    res.json({
      success: true,
      tests,
      totalDuration: tests.reduce((sum, t) => sum + parseInt(t.duration), 0) + "ms"
    });
  } catch (error: any) {
    console.error("خطأ في اختبار الأداء:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// عرض جميع البيانات
export const getAllData: RequestHandler = async (req, res) => {
  try {
    const data = await prisma.$transaction(async (tx) => {
      const [
        items,
        warehouses,
        suppliers,
        posOrders,
        stockBatches
      ] = await Promise.all([
        tx.item.findMany({
          take: 10,
          include: { ItemPrice: true }
        }),
        tx.warehouse.findMany(),
        tx.supplier.findMany(),
        tx.posOrder.findMany({
          take: 10,
          include: {
            PosOrderItem: {
              include: { Item: true }
            },
            Payment: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        tx.stockBatch.findMany({
          take: 10,
          include: {
            Item: true,
            Warehouse: true
          }
        })
      ]);

      return {
        items,
        warehouses,
        suppliers,
        posOrders,
        stockBatches
      };
    });

    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error("خطأ في جلب البيانات:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
