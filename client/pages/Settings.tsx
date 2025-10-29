import { useState, useEffect } from "react";
import {
  Building2,
  Settings as SettingsIcon,
  Receipt,
  Globe,
  Bell,
  Database,
  Lock,
  Palette,
  Mail,
  Clock,
  DollarSign,
  FileText,
  Shield,
  Save,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Types
interface BusinessConfig {
  name: string;
  nameEn: string;
  taxId: string;
  commercialReg: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
}

interface TaxConfig {
  defaultVatRate: number;
  serviceTaxRate: number;
  enableTableTax: boolean;
  enableDeliveryTax: boolean;
  enableMinibarTax: boolean;
  taxInclusive: boolean;
  taxAuthority: string;
}

interface SystemConfig {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  currencySymbol: string;
  decimalPlaces: number;
  enableRTL: boolean;
}

interface IntegrationConfig {
  name: string;
  type: string;
  status: "connected" | "disconnected" | "error";
  description: string;
  enabled: boolean;
}

interface NotificationConfig {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  lowStockAlert: boolean;
  orderAlerts: boolean;
  invoiceAlerts: boolean;
  stockThreshold: number;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("business");
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Business Configuration
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>({
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
  });

  // Tax Configuration
  const [taxConfig, setTaxConfig] = useState<TaxConfig>({
    defaultVatRate: 14,
    serviceTaxRate: 12,
    enableTableTax: true,
    enableDeliveryTax: true,
    enableMinibarTax: true,
    taxInclusive: false,
    taxAuthority: "مصلحة الضرائب المصرية",
  });

  // System Configuration
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    language: "ar",
    timezone: "Africa/Cairo",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    currency: "EGP",
    currencySymbol: "ج.م",
    decimalPlaces: 2,
    enableRTL: true,
  });

  // Notification Configuration
  const [notificationConfig, setNotificationConfig] =
    useState<NotificationConfig>({
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      lowStockAlert: true,
      orderAlerts: true,
      invoiceAlerts: true,
      stockThreshold: 10,
    });

  // Integration Configuration
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
    {
      name: "مصلحة الضرائب المصرية",
      type: "e-invoice",
      status: "connected",
      description: "نظام الفواتير الإلكترونية",
      enabled: true,
    },
    {
      name: "WhatsApp Business",
      type: "messaging",
      status: "connected",
      description: "إشعارات العملاء والطلبات",
      enabled: true,
    },
    {
      name: "Google Analytics",
      type: "analytics",
      status: "disconnected",
      description: "تحليلات وإحصائيات الموقع",
      enabled: false,
    },
    {
      name: "Payment Gateway",
      type: "payment",
      status: "connected",
      description: "بوابة الدفع الإلكتروني",
      enabled: true,
    },
    {
      name: "SMS Provider",
      type: "messaging",
      status: "connected",
      description: "خدمة الرسائل النصية",
      enabled: true,
    },
  ]);

  // Load settings from API on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/settings");
      
      if (!response.ok) {
        throw new Error("Failed to load settings");
      }

      const data = await response.json();

      // Update state with loaded settings
      if (data.business_config) {
        setBusinessConfig(data.business_config);
      }
      if (data.tax_config) {
        setTaxConfig(data.tax_config);
      }
      if (data.system_config) {
        setSystemConfig(data.system_config);
      }
      if (data.notification_config) {
        setNotificationConfig(data.notification_config);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      // If no settings exist, initialize defaults
      await initializeDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaults = async () => {
    try {
      const response = await fetch("/api/settings/initialize", {
        method: "POST",
      });

      if (response.ok) {
        await loadSettings();
      }
    } catch (error) {
      console.error("Error initializing settings:", error);
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      const settingsToSave = {
        business_config: businessConfig,
        tax_config: taxConfig,
        system_config: systemConfig,
        notification_config: notificationConfig,
      };

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings: settingsToSave }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const result = await response.json();
      
      setHasChanges(false);
      alert("✅ " + result.message);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("❌ فشل في حفظ الإعدادات. حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = async () => {
    if (confirm("هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟")) {
      await initializeDefaults();
      setHasChanges(false);
      alert("تم إعادة تعيين الإعدادات!");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      disconnected: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      error: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    const labels = {
      connected: "متصل",
      disconnected: "غير متصل",
      error: "خطأ",
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getIntegrationIcon = (type: string) => {
    const icons = {
      "e-invoice": Receipt,
      messaging: Mail,
      analytics: Globe,
      payment: DollarSign,
    };
    const IconComponent = icons[type as keyof typeof icons] || Globe;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-slate-600 animate-spin" />
            <p className="text-lg font-semibold">جاري تحميل الإعدادات...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 border-b border-white/10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">الإعدادات</h1>
                <p className="text-slate-200 mt-1">
                  تكوين إعدادات النظام والمعاملات التجارية وخيارات التكامل
                </p>
              </div>
            </div>
            {hasChanges && (
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-4 py-2 text-sm">
                توجد تغييرات غير محفوظة
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Action Buttons */}
        <div className="mb-6 flex gap-3 justify-end">
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={handleResetSettings}
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة تعيين
          </Button>
          <Button
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
            onClick={handleSaveSettings}
            disabled={!hasChanges || saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
              </>
            )}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
          <TabsList className="bg-white/10 border border-white/20 mb-6">
            <TabsTrigger value="business" className="data-[state=active]:bg-white/20">
              <Building2 className="w-4 h-4 ml-2" />
              معلومات الشركة
            </TabsTrigger>
            <TabsTrigger value="tax" className="data-[state=active]:bg-white/20">
              <Receipt className="w-4 h-4 ml-2" />
              إعدادات الضرائب
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-white/20">
              <Globe className="w-4 h-4 ml-2" />
              تفضيلات النظام
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white/20">
              <Bell className="w-4 h-4 ml-2" />
              الإشعارات
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-white/20">
              <Database className="w-4 h-4 ml-2" />
              التكاملات
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-white/20">
              <Lock className="w-4 h-4 ml-2" />
              الأمان
            </TabsTrigger>
          </TabsList>

          {/* Business Configuration Tab */}
          <TabsContent value="business" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slate-600" />
                  معلومات الشركة الأساسية
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>اسم الشركة (عربي)</Label>
                    <Input
                      value={businessConfig.name}
                      onChange={(e) => {
                        setBusinessConfig({ ...businessConfig, name: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="اسم الشركة بالعربية"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم الشركة (English)</Label>
                    <Input
                      value={businessConfig.nameEn}
                      onChange={(e) => {
                        setBusinessConfig({ ...businessConfig, nameEn: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="Company Name in English"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الرقم الضريبي</Label>
                    <Input
                      value={businessConfig.taxId}
                      onChange={(e) => {
                        setBusinessConfig({ ...businessConfig, taxId: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="123-456-789"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>رقم السجل التجاري</Label>
                    <Input
                      value={businessConfig.commercialReg}
                      onChange={(e) => {
                        setBusinessConfig({
                          ...businessConfig,
                          commercialReg: e.target.value,
                        });
                        setHasChanges(true);
                      }}
                      placeholder="CR-2024-001"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>العنوان</Label>
                    <Input
                      value={businessConfig.address}
                      onChange={(e) => {
                        setBusinessConfig({ ...businessConfig, address: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="العنوان الكامل"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>المدينة</Label>
                    <Input
                      value={businessConfig.city}
                      onChange={(e) => {
                        setBusinessConfig({ ...businessConfig, city: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="المدينة"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الدولة</Label>
                    <Input
                      value={businessConfig.country}
                      onChange={(e) => {
                        setBusinessConfig({ ...businessConfig, country: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="الدولة"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>رقم الهاتف</Label>
                    <Input
                      value={businessConfig.phone}
                      onChange={(e) => {
                        setBusinessConfig({ ...businessConfig, phone: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="+20 2 1234 5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      value={businessConfig.email}
                      onChange={(e) => {
                        setBusinessConfig({ ...businessConfig, email: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="info@company.com"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>الموقع الإلكتروني</Label>
                    <Input
                      type="url"
                      value={businessConfig.website}
                      onChange={(e) => {
                        setBusinessConfig({ ...businessConfig, website: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="https://company.com"
                      dir="ltr"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Configuration Tab */}
          <TabsContent value="tax" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-slate-600" />
                  معدلات الضرائب
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>نسبة ضريبة القيمة المضافة الافتراضية (%)</Label>
                    <Input
                      type="number"
                      value={taxConfig.defaultVatRate}
                      onChange={(e) => {
                        setTaxConfig({
                          ...taxConfig,
                          defaultVatRate: parseFloat(e.target.value),
                        });
                        setHasChanges(true);
                      }}
                      placeholder="14"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>نسبة ضريبة الخدمة (%)</Label>
                    <Input
                      type="number"
                      value={taxConfig.serviceTaxRate}
                      onChange={(e) => {
                        setTaxConfig({
                          ...taxConfig,
                          serviceTaxRate: parseFloat(e.target.value),
                        });
                        setHasChanges(true);
                      }}
                      placeholder="12"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>الجهة الضريبية</Label>
                    <Input
                      value={taxConfig.taxAuthority}
                      onChange={(e) => {
                        setTaxConfig({ ...taxConfig, taxAuthority: e.target.value });
                        setHasChanges(true);
                      }}
                      placeholder="مصلحة الضرائب المصرية"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-600" />
                  إعدادات تطبيق الضريبة
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">تفعيل الضريبة على طاولات الطعام</p>
                      <p className="text-sm text-muted-foreground">
                        تطبيق الضرائب على طلبات قاعة الطعام
                      </p>
                    </div>
                    <Switch
                      checked={taxConfig.enableTableTax}
                      onCheckedChange={(checked) => {
                        setTaxConfig({ ...taxConfig, enableTableTax: checked });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">تفعيل الضريبة على التوصيل</p>
                      <p className="text-sm text-muted-foreground">
                        تطبيق الضرائب على طلبات التوصيل
                      </p>
                    </div>
                    <Switch
                      checked={taxConfig.enableDeliveryTax}
                      onCheckedChange={(checked) => {
                        setTaxConfig({ ...taxConfig, enableDeliveryTax: checked });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">تفعيل الضريبة على المنى بار</p>
                      <p className="text-sm text-muted-foreground">
                        تطبيق الضرائب على مشتريات المنى بار
                      </p>
                    </div>
                    <Switch
                      checked={taxConfig.enableMinibarTax}
                      onCheckedChange={(checked) => {
                        setTaxConfig({ ...taxConfig, enableMinibarTax: checked });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">الضريبة شاملة في السعر</p>
                      <p className="text-sm text-muted-foreground">
                        الأسعار تشمل الضريبة بدلاً من إضافتها عند الدفع
                      </p>
                    </div>
                    <Switch
                      checked={taxConfig.taxInclusive}
                      onCheckedChange={(checked) => {
                        setTaxConfig({ ...taxConfig, taxInclusive: checked });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Configuration Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-slate-600" />
                  اللغة والمنطقة الزمنية
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>اللغة الافتراضية</Label>
                    <Select
                      value={systemConfig.language}
                      onValueChange={(value) => {
                        setSystemConfig({ ...systemConfig, language: value });
                        setHasChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>المنطقة الزمنية</Label>
                    <Select
                      value={systemConfig.timezone}
                      onValueChange={(value) => {
                        setSystemConfig({ ...systemConfig, timezone: value });
                        setHasChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Cairo">Cairo (GMT+2)</SelectItem>
                        <SelectItem value="Asia/Riyadh">Riyadh (GMT+3)</SelectItem>
                        <SelectItem value="Asia/Dubai">Dubai (GMT+4)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>تنسيق التاريخ</Label>
                    <Select
                      value={systemConfig.dateFormat}
                      onValueChange={(value) => {
                        setSystemConfig({ ...systemConfig, dateFormat: value });
                        setHasChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>تنسيق الوقت</Label>
                    <Select
                      value={systemConfig.timeFormat}
                      onValueChange={(value) => {
                        setSystemConfig({ ...systemConfig, timeFormat: value });
                        setHasChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 ساعة</SelectItem>
                        <SelectItem value="12h">12 ساعة (AM/PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-slate-600" />
                  إعدادات العملة
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>العملة الافتراضية</Label>
                    <Select
                      value={systemConfig.currency}
                      onValueChange={(value) => {
                        setSystemConfig({ ...systemConfig, currency: value });
                        setHasChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EGP">جنيه مصري (EGP)</SelectItem>
                        <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                        <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                        <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                        <SelectItem value="EUR">يورو (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>رمز العملة</Label>
                    <Input
                      value={systemConfig.currencySymbol}
                      onChange={(e) => {
                        setSystemConfig({
                          ...systemConfig,
                          currencySymbol: e.target.value,
                        });
                        setHasChanges(true);
                      }}
                      placeholder="ج.م"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>عدد المنازل العشرية</Label>
                    <Select
                      value={systemConfig.decimalPlaces.toString()}
                      onValueChange={(value) => {
                        setSystemConfig({
                          ...systemConfig,
                          decimalPlaces: parseInt(value),
                        });
                        setHasChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 (بدون كسور)</SelectItem>
                        <SelectItem value="2">2 (مثال: 10.50)</SelectItem>
                        <SelectItem value="3">3 (مثال: 10.500)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-slate-600" />
                  المظهر والعرض
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">تفعيل الكتابة من اليمين لليسار (RTL)</p>
                      <p className="text-sm text-muted-foreground">
                        تنسيق الواجهة للغات العربية
                      </p>
                    </div>
                    <Switch
                      checked={systemConfig.enableRTL}
                      onCheckedChange={(checked) => {
                        setSystemConfig({ ...systemConfig, enableRTL: checked });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-slate-600" />
                  قنوات الإشعارات
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">إشعارات البريد الإلكتروني</p>
                      <p className="text-sm text-muted-foreground">
                        استلام التنبيهات عبر البريد الإلكتروني
                      </p>
                    </div>
                    <Switch
                      checked={notificationConfig.emailNotifications}
                      onCheckedChange={(checked) => {
                        setNotificationConfig({
                          ...notificationConfig,
                          emailNotifications: checked,
                        });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">إشعارات الرسائل النصية (SMS)</p>
                      <p className="text-sm text-muted-foreground">
                        استلام التنبيهات عبر الرسائل النصية
                      </p>
                    </div>
                    <Switch
                      checked={notificationConfig.smsNotifications}
                      onCheckedChange={(checked) => {
                        setNotificationConfig({
                          ...notificationConfig,
                          smsNotifications: checked,
                        });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">الإشعارات الفورية (Push)</p>
                      <p className="text-sm text-muted-foreground">
                        استلام التنبيهات الفورية على المتصفح
                      </p>
                    </div>
                    <Switch
                      checked={notificationConfig.pushNotifications}
                      onCheckedChange={(checked) => {
                        setNotificationConfig({
                          ...notificationConfig,
                          pushNotifications: checked,
                        });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-slate-600" />
                  أنواع التنبيهات
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">تنبيهات انخفاض المخزون</p>
                      <p className="text-sm text-muted-foreground">
                        إشعارات عندما ينخفض المخزون عن الحد الأدنى
                      </p>
                    </div>
                    <Switch
                      checked={notificationConfig.lowStockAlert}
                      onCheckedChange={(checked) => {
                        setNotificationConfig({
                          ...notificationConfig,
                          lowStockAlert: checked,
                        });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">تنبيهات الطلبات</p>
                      <p className="text-sm text-muted-foreground">
                        إشعارات عند استلام طلبات جديدة
                      </p>
                    </div>
                    <Switch
                      checked={notificationConfig.orderAlerts}
                      onCheckedChange={(checked) => {
                        setNotificationConfig({
                          ...notificationConfig,
                          orderAlerts: checked,
                        });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">تنبيهات الفواتير</p>
                      <p className="text-sm text-muted-foreground">
                        إشعارات عن الفواتير والمدفوعات
                      </p>
                    </div>
                    <Switch
                      checked={notificationConfig.invoiceAlerts}
                      onCheckedChange={(checked) => {
                        setNotificationConfig({
                          ...notificationConfig,
                          invoiceAlerts: checked,
                        });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>حد تنبيه المخزون (الكمية)</Label>
                    <Input
                      type="number"
                      value={notificationConfig.stockThreshold}
                      onChange={(e) => {
                        setNotificationConfig({
                          ...notificationConfig,
                          stockThreshold: parseInt(e.target.value),
                        });
                        setHasChanges(true);
                      }}
                      placeholder="10"
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      سيتم إرسال تنبيه عندما تنخفض الكمية عن هذا الحد
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4">
            {integrations.map((integration, index) => (
              <Card
                key={index}
                className="bg-white/95 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-slate-100 rounded-lg">
                        {getIntegrationIcon(integration.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{integration.name}</h3>
                          {getStatusBadge(integration.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {integration.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {integration.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={integration.enabled}
                        onCheckedChange={(checked) => {
                          const newIntegrations = [...integrations];
                          newIntegrations[index].enabled = checked;
                          setIntegrations(newIntegrations);
                          setHasChanges(true);
                        }}
                      />
                      <Button variant="outline" size="sm">
                        تكوين
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-600" />
                  إعدادات الأمان
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">المصادقة الثنائية (2FA)</p>
                      <p className="text-sm text-muted-foreground">
                        تفعيل المصادقة الثنائية لجميع المستخدمين
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">تسجيل جميع العمليات</p>
                      <p className="text-sm text-muted-foreground">
                        تتبع جميع الأنشطة والتغييرات في النظام
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">قفل الحساب بعد محاولات فاشلة</p>
                      <p className="text-sm text-muted-foreground">
                        قفل الحساب بعد 5 محاولات تسجيل دخول فاشلة
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-slate-600" />
                  النسخ الاحتياطي
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">النسخ الاحتياطي التلقائي</p>
                      <p className="text-sm text-muted-foreground">
                        إنشاء نسخة احتياطية يومياً من البيانات
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">
                          آخر نسخة احتياطية
                        </p>
                        <p className="text-sm text-blue-700">
                          27 أكتوبر 2025 - 02:00 صباحاً
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                          تنزيل النسخة الاحتياطية
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
