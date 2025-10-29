import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  Download,
  FileText,
  PieChart,
  Activity,
  Target,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  RefreshCw,
  Eye,
  Printer,
  Share2,
  Settings,
  Clock,
  CheckCircle2,
  AlertCircle,
  Warehouse,
  Truck,
  Receipt,
  CreditCard,
  Coins,
  Boxes,
} from "lucide-react";

interface SalesMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: any;
  color: string;
}

interface ReportCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  reports: number;
  lastGenerated?: string;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  soldQuantity: number;
  revenue: number;
  profit: number;
  margin: number;
}

interface InventoryMetric {
  id: string;
  metric: string;
  current: number;
  previous: number;
  change: number;
  status: "good" | "warning" | "critical";
}

// Sample data
const salesMetrics: SalesMetric[] = [
  {
    id: "1",
    title: "إجمالي المبيعات",
    value: "125,840 ج.م",
    change: 12.5,
    trend: "up",
    icon: DollarSign,
    color: "from-green-500 to-green-600",
  },
  {
    id: "2",
    title: "عدد الطلبات",
    value: "1,245",
    change: 8.3,
    trend: "up",
    icon: ShoppingCart,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "3",
    title: "متوسط قيمة الطلب",
    value: "101 ج.م",
    change: 3.8,
    trend: "up",
    icon: Receipt,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "4",
    title: "العملاء الجدد",
    value: "342",
    change: 15.2,
    trend: "up",
    icon: Users,
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "5",
    title: "هامش الربح",
    value: "32.5%",
    change: -2.1,
    trend: "down",
    icon: Percent,
    color: "from-amber-500 to-amber-600",
  },
  {
    id: "6",
    title: "تكلفة المنتجات المباعة",
    value: "84,890 ج.م",
    change: 5.4,
    trend: "up",
    icon: Coins,
    color: "from-red-500 to-red-600",
  },
];

const reportCategories: ReportCategory[] = [
  {
    id: "1",
    title: "تحليلات المبيعات",
    description: "تقارير مفصلة عن المبيعات والإيرادات والاتجاهات",
    icon: TrendingUp,
    reports: 12,
    lastGenerated: "2025-10-28T09:00:00",
  },
  {
    id: "2",
    title: "تكلفة المنتجات المباعة",
    description: "تحليل تكاليف المنتجات وهوامش الربح",
    icon: Coins,
    reports: 8,
    lastGenerated: "2025-10-28T08:30:00",
  },
  {
    id: "3",
    title: "تقارير حركة المخزون",
    description: "حركة المخزون والمنتجات الأكثر والأقل مبيعاً",
    icon: Package,
    reports: 15,
    lastGenerated: "2025-10-28T10:00:00",
  },
  {
    id: "4",
    title: "تقارير العملاء",
    description: "تحليلات سلوك العملاء والولاء",
    icon: Users,
    reports: 6,
    lastGenerated: "2025-10-27T16:00:00",
  },
  {
    id: "5",
    title: "تقارير التوصيل",
    description: "أداء التوصيل والسائقين والمناطق",
    icon: Truck,
    reports: 9,
    lastGenerated: "2025-10-28T07:00:00",
  },
  {
    id: "6",
    title: "تقارير الضرائب",
    description: "تقارير الضرائب والامتثال الضريبي",
    icon: Receipt,
    reports: 4,
    lastGenerated: "2025-10-28T06:00:00",
  },
  {
    id: "7",
    title: "تقارير قاعة الطعام",
    description: "أداء الطاولات والنوادل والإشغال",
    icon: Activity,
    reports: 7,
    lastGenerated: "2025-10-28T11:00:00",
  },
  {
    id: "8",
    title: "تقارير الإنتاج",
    description: "كفاءة الإنتاج واستهلاك المواد",
    icon: Boxes,
    reports: 10,
    lastGenerated: "2025-10-28T05:00:00",
  },
];

const topProducts: TopProduct[] = [
  {
    id: "1",
    name: "وجبة مشكلة",
    category: "أطباق رئيسية",
    soldQuantity: 450,
    revenue: 22500,
    profit: 9000,
    margin: 40,
  },
  {
    id: "2",
    name: "شاورما دجاج",
    category: "ساندويتشات",
    soldQuantity: 380,
    revenue: 15200,
    profit: 5320,
    margin: 35,
  },
  {
    id: "3",
    name: "عصير برتقال طازج",
    category: "مشروبات",
    soldQuantity: 520,
    revenue: 10400,
    profit: 5720,
    margin: 55,
  },
  {
    id: "4",
    name: "سلطة خضراء",
    category: "مقبلات",
    soldQuantity: 290,
    revenue: 8700,
    profit: 4350,
    margin: 50,
  },
  {
    id: "5",
    name: "كنافة بالقشطة",
    category: "حلويات",
    soldQuantity: 220,
    revenue: 11000,
    profit: 4400,
    margin: 40,
  },
];

const inventoryMetrics: InventoryMetric[] = [
  {
    id: "1",
    metric: "قيمة المخزون الحالي",
    current: 145000,
    previous: 138000,
    change: 5.1,
    status: "good",
  },
  {
    id: "2",
    metric: "معدل دوران المخزون",
    current: 4.2,
    previous: 3.8,
    change: 10.5,
    status: "good",
  },
  {
    id: "3",
    metric: "أصناف منخفضة المخزون",
    current: 12,
    previous: 8,
    change: 50,
    status: "warning",
  },
  {
    id: "4",
    metric: "أصناف نفذت",
    current: 3,
    previous: 1,
    change: 200,
    status: "critical",
  },
  {
    id: "5",
    metric: "معدل الفاقد",
    current: 2.3,
    previous: 3.1,
    change: -25.8,
    status: "good",
  },
];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState<"overview" | "categories" | "products" | "inventory">("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "critical":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-EG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-100 dark:from-slate-950 dark:via-violet-950/10 dark:to-slate-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-l from-violet-600 to-slate-900 dark:from-violet-400 dark:to-slate-100 bg-clip-text text-transparent">
                التقارير والإحصائيات
              </h1>
              <p className="text-muted-foreground mt-1">
                ذكاء تجاري شامل مع المؤشرات الرئيسية وتحليل تكلفة المنتجات المباعة والمقاييس الأداء عبر جميع العمليات.
              </p>
            </div>
          </div>

          {/* Quick Actions & Period Selector */}
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap gap-3">
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                <Download className="w-4 h-4 ml-2" />
                تصدير التقارير
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Printer className="w-4 h-4 ml-2" />
                طباعة
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 ml-2" />
                مشاركة
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 ml-2" />
                إعدادات التقارير
              </Button>
            </div>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">اليوم</SelectItem>
                <SelectItem value="week">هذا الأسبوع</SelectItem>
                <SelectItem value="month">هذا الشهر</SelectItem>
                <SelectItem value="quarter">هذا الربع</SelectItem>
                <SelectItem value="year">هذا العام</SelectItem>
                <SelectItem value="custom">فترة مخصصة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            className={activeTab === "overview" ? "bg-gradient-to-r from-violet-600 to-purple-600" : ""}
          >
            <Activity className="w-4 h-4 ml-2" />
            نظرة عامة
          </Button>
          <Button
            variant={activeTab === "categories" ? "default" : "outline"}
            onClick={() => setActiveTab("categories")}
            className={activeTab === "categories" ? "bg-gradient-to-r from-violet-600 to-purple-600" : ""}
          >
            <FileText className="w-4 h-4 ml-2" />
            فئات التقارير
          </Button>
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
            className={activeTab === "products" ? "bg-gradient-to-r from-violet-600 to-purple-600" : ""}
          >
            <Target className="w-4 h-4 ml-2" />
            أفضل المنتجات
          </Button>
          <Button
            variant={activeTab === "inventory" ? "default" : "outline"}
            onClick={() => setActiveTab("inventory")}
            className={activeTab === "inventory" ? "bg-gradient-to-r from-violet-600 to-purple-600" : ""}
          >
            <Warehouse className="w-4 h-4 ml-2" />
            مقاييس المخزون
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Sales Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {salesMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <Card key={metric.id} className="border-2 hover:border-violet-400 dark:hover:border-violet-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 bg-gradient-to-br ${metric.color} rounded-xl text-white shadow-lg`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <CardDescription className="text-sm font-semibold">{metric.title}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-l from-violet-600 to-slate-900 dark:from-violet-400 dark:to-slate-100 bg-clip-text text-transparent mb-2">
                        {metric.value}
                      </div>
                      <div className="flex items-center gap-2">
                        {metric.trend === "up" ? (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="text-sm font-semibold">{metric.change}%</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <ArrowDownRight className="w-4 h-4" />
                            <span className="text-sm font-semibold">{Math.abs(metric.change)}%</span>
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">مقارنة بالفترة السابقة</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Performance Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    اتجاهات المبيعات
                  </CardTitle>
                  <CardDescription>نمو المبيعات خلال آخر 12 شهر</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-lg">
                    <div className="text-center">
                      <PieChart className="w-16 h-16 mx-auto text-violet-600 dark:text-violet-400 mb-2" />
                      <p className="text-sm text-muted-foreground">رسم بياني للمبيعات</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    توزيع المبيعات حسب الفئة
                  </CardTitle>
                  <CardDescription>المبيعات حسب فئات المنتجات</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                      <p className="text-sm text-muted-foreground">رسم بياني دائري</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="border-2 hover:border-violet-400 dark:hover:border-violet-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl text-white shadow-lg">
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100">
                        {category.reports} تقرير
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription className="text-sm">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {category.lastGenerated && (
                      <div className="text-xs text-muted-foreground mb-4">
                        <Clock className="w-3 h-3 inline ml-1" />
                        آخر إنشاء: {formatDateTime(category.lastGenerated)}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 ml-1" />
                        عرض
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-3 h-3 ml-1" />
                        تصدير
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  أفضل المنتجات مبيعاً
                </CardTitle>
                <CardDescription>المنتجات الأكثر مبيعاً وربحية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-lg">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          هامش {product.margin}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">الكمية المباعة</p>
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{product.soldQuantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">الإيرادات</p>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">{product.revenue} ج.م</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">الربح</p>
                          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{product.profit} ج.م</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">هامش الربح</p>
                          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{product.margin}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventoryMetrics.map((metric) => (
                <Card key={metric.id} className="border-2 hover:border-violet-400 dark:hover:border-violet-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{metric.metric}</CardTitle>
                      {metric.status === "good" && <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />}
                      {metric.status === "warning" && <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
                      {metric.status === "critical" && <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold mb-2 ${getStatusColor(metric.status)}`}>
                      {metric.metric.includes("معدل") || metric.metric.includes("نسبة") 
                        ? metric.current.toFixed(1) 
                        : metric.current.toLocaleString()}
                      {metric.metric.includes("معدل") && !metric.metric.includes("دوران") ? "%" : ""}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">السابق: {metric.previous}</span>
                      <div className={`flex items-center gap-1 font-semibold ${
                        metric.change > 0 
                          ? metric.status === "critical" || metric.status === "warning"
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                          : "text-green-600 dark:text-green-400"
                      }`}>
                        {metric.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {Math.abs(metric.change).toFixed(1)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Inventory Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    حركة المخزون
                  </CardTitle>
                  <CardDescription>الإضافات والسحوبات خلال الشهر</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                    <div className="text-center">
                      <Activity className="w-16 h-16 mx-auto text-green-600 dark:text-green-400 mb-2" />
                      <p className="text-sm text-muted-foreground">رسم بياني لحركة المخزون</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    معدل الفاقد
                  </CardTitle>
                  <CardDescription>نسبة الفاقد والتلف حسب الفئة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg">
                    <div className="text-center">
                      <PieChart className="w-16 h-16 mx-auto text-red-600 dark:text-red-400 mb-2" />
                      <p className="text-sm text-muted-foreground">رسم بياني للفاقد</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
