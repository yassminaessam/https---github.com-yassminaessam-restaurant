import { RequestHandler } from "express";
import { randomUUID } from "crypto";
import { getPrisma } from "../lib/prisma";

// Get all settings
export const getSettings: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const settings = await prisma.systemSettings.findMany();
    
    // Transform to an object with key-value pairs
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);

    res.json(settingsObj);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "فشل في جلب الإعدادات" });
  }
};

// Get specific setting by key
export const getSettingByKey: RequestHandler = async (req, res) => {
  try {
    const { key } = req.params;
    const prisma = getPrisma();
    
    const setting = await prisma.systemSettings.findUnique({
      where: { key },
    });

    if (!setting) {
      return res.status(404).json({ error: "الإعداد غير موجود" });
    }

    res.json(setting.value);
  } catch (error) {
    console.error("Error fetching setting:", error);
    res.status(500).json({ error: "فشل في جلب الإعداد" });
  }
};

// Update or create setting
export const upsertSetting: RequestHandler = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({ error: "القيمة مطلوبة" });
    }

    const prisma = getPrisma();
    const setting = await prisma.systemSettings.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { id: randomUUID(), key, value, updatedAt: new Date() },
    });

    res.json({
      success: true,
      message: "تم حفظ الإعداد بنجاح",
      setting,
    });
  } catch (error) {
    console.error("Error saving setting:", error);
    res.status(500).json({ error: "فشل في حفظ الإعداد" });
  }
};

// Update multiple settings at once
export const updateSettings: RequestHandler = async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ error: "البيانات غير صحيحة" });
    }

    const prisma = getPrisma();
    // Use transaction to update all settings
    const updates = await prisma.$transaction(
      Object.entries(settings).map(([key, value]) =>
        prisma.systemSettings.upsert({
          where: { key },
          update: { value: value as any, updatedAt: new Date() },
          create: { id: randomUUID(), key, value: value as any, updatedAt: new Date() },
        })
      )
    );

    res.json({
      success: true,
      message: "تم حفظ الإعدادات بنجاح",
      count: updates.length,
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    res.status(500).json({ error: "فشل في حفظ الإعدادات" });
  }
};

// Initialize default settings
export const initializeDefaultSettings: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const defaultSettings = {
      business_config: {
        name: "مطعم فيوجن",
        nameEn: "Fusion Restaurant",
        taxId: "123-456-789",
        commercialReg: "CR-2024-001",
        address: "شارع التحرير، وسط البلد",
        city: "القاهرة",
        country: "مصر",
        phone: "+20 2 1234 5678",
        email: "info@fusion-restaurant.com",
        website: "https://fusion-restaurant.com",
        logo: "/logo.png",
      },
      tax_config: {
        defaultVatRate: 14,
        serviceTaxRate: 12,
        enableTableTax: true,
        enableDeliveryTax: true,
        enableMinibarTax: true,
        taxInclusive: false,
        taxAuthority: "مصلحة الضرائب المصرية",
      },
      system_config: {
        language: "ar",
        timezone: "Africa/Cairo",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        currency: "EGP",
        currencySymbol: "ج.م",
        decimalPlaces: 2,
        enableRTL: true,
      },
      notification_config: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        lowStockAlert: true,
        orderAlerts: true,
        invoiceAlerts: true,
        stockThreshold: 10,
      },
    };

    const created = await prisma.$transaction(
      Object.entries(defaultSettings).map(([key, value]) =>
        prisma.systemSettings.upsert({
          where: { key },
          update: { value, updatedAt: new Date() },
          create: { id: randomUUID(), key, value, updatedAt: new Date() },
        })
      )
    );

    res.json({
      success: true,
      message: "تم تهيئة الإعدادات الافتراضية بنجاح",
      count: created.length,
    });
  } catch (error) {
    console.error("Error initializing settings:", error);
    res.status(500).json({ error: "فشل في تهيئة الإعدادات" });
  }
};
