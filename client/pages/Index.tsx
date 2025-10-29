import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingCart,
  UtensilsCrossed,
  Truck,
  BarChart3,
  Warehouse,
  ChefHat,
  Building2,
  TrendingUp,
  Clock,
  AlertCircle,
  PackageCheck,
  ArrowRightLeft,
  DollarSign,
  ArrowUpRight,
  Coffee,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface ModuleCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  darkColor: string;
}

const modules: ModuleCard[] = [
  {
    title: "إدارة المخزون",
    description: "المستودع الرئيسي، المستودعات الفرعية، تتبع الأسهم والتحويلات",
    icon: <Warehouse className="w-6 h-6" />,
    href: "/inventory",
    color: "bg-blue-50",
    darkColor: "dark:bg-blue-950",
  },
  {
    title: "الشراء والتوريد",
    description: "أوامر الشراء، محاضر الاستلام، والمرتجعات من الموردين",
    icon: <Package className="w-6 h-6" />,
    href: "/purchasing",
    color: "bg-green-50",
    darkColor: "dark:bg-green-950",
  },
  {
    title: "الوصفات والإنتاج",
    description: "إدارة الوصفات، قوائم المكونات، أوامر الإنتاج، وتحكم العائد",
    icon: <ChefHat className="w-6 h-6" />,
    href: "/production",
    color: "bg-orange-50",
    darkColor: "dark:bg-orange-950",
  },
  {
    title: "نقاط البيع",
    description: "نقاط بيع عبر الإنترنت وغير متصلة بالإنترنت، والمدفوعات والتكامل المالي",
    icon: <ShoppingCart className="w-6 h-6" />,
    href: "/pos",
    color: "bg-purple-50",
    darkColor: "dark:bg-purple-950",
  },
  {
    title: "إدارة قاعة الطعام",
    description: "إدارة الطاولات، أوامر المطبخ، وتنسيق الخدمة",
    icon: <UtensilsCrossed className="w-6 h-6" />,
    href: "/dine-in",
    color: "bg-red-50",
    darkColor: "dark:bg-red-950",
  },
  {
    title: "إدارة التوصيل",
    description: "تعيين السائقين، تتبع التوصيل، وإدارة الطلبات",
    icon: <Truck className="w-6 h-6" />,
    href: "/delivery",
    color: "bg-amber-50",
    darkColor: "dark:bg-amber-950",
  },
  {
    title: "منى بار الفندق",
    description: "إعادة تخزين منى بار، رسوم الغرف، وإدارة المخزون",
    icon: <Building2 className="w-6 h-6" />,
    href: "/minibar",
    color: "bg-pink-50",
    darkColor: "dark:bg-pink-950",
  },
  {
    title: "التقارير والإحصائيات",
    description: "الذكاء التجاري، المؤشرات الرئيسية، وتحليل تكلفة المنتجات المباعة",
    icon: <BarChart3 className="w-6 h-6" />,
    href: "/reports",
    color: "bg-cyan-50",
    darkColor: "dark:bg-cyan-950",
  },
];

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const stats: StatCard[] = [
  {
    label: "عناصر المخزون",
    value: "0",
    icon: <Package className="w-5 h-5" />,
    trend: "0% مقارنة بالشهر الماضي",
    trendUp: true,
  },
  {
    label: "الطلبات النشطة",
    value: "0",
    icon: <ShoppingCart className="w-5 h-5" />,
    trend: "0% مقارنة بالشهر الماضي",
    trendUp: true,
  },
  {
    label: "التوصيلات المعلقة",
    value: "0",
    icon: <Truck className="w-5 h-5" />,
    trend: "0% مقارنة باليوم",
    trendUp: true,
  },
  {
    label: "تنبيهات المخزون المنخفض",
    value: "0",
    icon: <AlertCircle className="w-5 h-5" />,
    trend: "راقب بشكل منتظم",
    trendUp: false,
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 dark:from-slate-950 dark:via-orange-950/10 dark:to-slate-900">
      <div className="w-full">
        <div className="px-8 pt-8 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="mb-12 relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-orange-200 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                    <Coffee className="w-8 h-8 text-white" />
                  </div>
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
                    <Sparkles className="w-3 h-3 ml-1" />
                    نظام متكامل
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 bg-gradient-to-l from-orange-600 to-slate-900 dark:from-orange-400 dark:to-slate-100 bg-clip-text text-transparent">
                  رسترو الفرسان
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  نظام موحد ومتطور لإدارة المطاعم والكافتريا والفنادق بكفاءة واحترافية
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, idx) => (
                <Card
                  key={idx}
                  className="relative overflow-hidden border-2 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group bg-white/80 dark:bg-slate-900/80 backdrop-blur"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                        {stat.icon}
                      </div>
                      <CardDescription className="text-sm font-semibold">
                        {stat.label}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <div className="text-4xl font-bold bg-gradient-to-l from-orange-600 to-slate-900 dark:from-orange-400 dark:to-slate-100 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                    </div>
                    {stat.trend && (
                      <div
                        className={`text-xs font-medium ${
                          stat.trendUp ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {stat.trendUp ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          {stat.trend}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl font-bold text-foreground">
                  إجراءات سريعة
                </h2>
                <div className="h-1 flex-1 bg-gradient-to-l from-orange-500/20 to-transparent rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/grn" className="group">
                  <Card className="relative overflow-hidden border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 hover:shadow-2xl group-hover:-translate-y-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full -mr-16 -mt-16"></div>
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white shadow-xl group-hover:scale-110 transition-transform">
                          <PackageCheck className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">استلام بضاعة</CardTitle>
                          <CardDescription className="mt-1">
                            إضافة محضر استلام جديد من المورد
                          </CardDescription>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg" size="lg">
                        <PackageCheck className="w-4 h-4 ml-2" />
                        إنشاء GRN
                      </Button>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/transfer" className="group">
                  <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-2xl group-hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -mr-16 -mt-16"></div>
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl text-white shadow-xl group-hover:scale-110 transition-transform">
                          <ArrowRightLeft className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">تحويل مخزون</CardTitle>
                          <CardDescription className="mt-1">
                            نقل أصناف بين المخازن المختلفة
                          </CardDescription>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg" size="lg">
                        <ArrowRightLeft className="w-4 h-4 ml-2" />
                        تحويل جديد
                      </Button>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/pos-sale" className="group">
                  <Card className="relative overflow-hidden border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-2xl group-hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950 dark:to-fuchsia-950">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full -mr-16 -mt-16"></div>
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="p-4 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl text-white shadow-xl group-hover:scale-110 transition-transform">
                          <DollarSign className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">بيع سريع</CardTitle>
                          <CardDescription className="mt-1">
                            مبيعات البوفيه والمنى بار والمطبخ
                          </CardDescription>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 shadow-lg" size="lg">
                        <DollarSign className="w-4 h-4 ml-2" />
                        بيع جديد
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Main Modules */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl font-bold text-foreground">
                  الوحدات الأساسية
                </h2>
                <div className="h-1 flex-1 bg-gradient-to-l from-orange-500/20 to-transparent rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {modules.map((module) => (
                  <Link
                    key={module.href}
                    to={module.href}
                    className="group h-full"
                  >
                    <Card
                      className={`${module.color} ${module.darkColor} h-full flex flex-col border-2 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-2xl group-hover:-translate-y-2 relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 dark:bg-black/10 rounded-full -mr-12 -mt-12"></div>
                      <CardHeader>
                        <div className="mb-3 text-primary group-hover:scale-110 transition-transform">
                          {module.icon}
                        </div>
                        <CardTitle className="text-lg">
                          {module.title}
                        </CardTitle>
                        <CardDescription className="flex-1">
                          {module.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto">
                        <Button
                          className="w-full group-hover:bg-orange-500 group-hover:text-white transition-colors"
                          size="sm"
                          variant="outline"
                        >
                          الدخول للوحدة
                          <ArrowUpRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <Card className="mb-12 border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-2xl">مميزات النظام</CardTitle>
                </div>
                <CardDescription>
                  نظام شامل ومتكامل لإدارة جميع عمليات المطعم والكافتيريا
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FeatureItem
                    icon={<Warehouse className="w-5 h-5" />}
                    title="إدارة متعددة المخازن"
                    description="مخازن رئيسية وفرعية للمطاعم والكافتيريا والمنى بار"
                  />
                  <FeatureItem
                    icon={<ChefHat className="w-5 h-5" />}
                    title="التحكم في الوصفات والإنتاج"
                    description="وصفات مفصلة مع قوائم المكونات وأوامر الإنتاج"
                  />
                  <FeatureItem
                    icon={<ShoppingCart className="w-5 h-5" />}
                    title="نظام نقاط البيع الكامل"
                    description="نقاط بيع متعددة مع معالجة المدفوعات والفواتير"
                  />
                  <FeatureItem
                    icon={<Truck className="w-5 h-5" />}
                    title="إدارة التوصيل"
                    description="تعيين السائقين والتتبع في الوقت الفعلي"
                  />
                  <FeatureItem
                    icon={<Building2 className="w-5 h-5" />}
                    title="تكامل الفندق"
                    description="إعادة تخزين منى بار ورسوم الغرف والتكامل"
                  />
                  <FeatureItem
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    title="التوافقية الضريبية"
                    description="الامتثال للهيئة العامة للضرائب المصرية"
                  />
                  <FeatureItem
                    icon={<Package className="w-5 h-5" />}
                    title="تسعير المخزون FEFO"
                    description="طرق التسعير FIFO و FEFO والمتوسط المرجح"
                  />
                  <FeatureItem
                    icon={<BarChart3 className="w-5 h-5" />}
                    title="التقارير المتقدمة"
                    description="المؤشرات الرئيسية وتحليل التكلفة ولوحات المعلومات"
                  />
                  <FeatureItem
                    icon={<Clock className="w-5 h-5" />}
                    title="التحكم في الوصول"
                    description="تحكم شامل بناءً على الأدوار والصلاحيات"
                  />
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="relative overflow-hidden border-2 border-orange-400 dark:border-orange-600 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <CardContent className="p-8 md:p-12 relative">
                <div className="max-w-2xl">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    هل أنت مستعد للبدء؟
                  </h3>
                  <p className="text-lg mb-6 text-white/90">
                    ابدأ بإدارة عمليات مطعمك بكفاءة واحترافية باستخدام رسترو الفرسان
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/inventory-reports">
                      <Button
                        className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg"
                        size="lg"
                      >
                        <BarChart3 className="w-5 h-5 ml-2" />
                        التقارير والإحصائيات
                      </Button>
                    </Link>
                    <Link to="/stock-records">
                      <Button
                        className="bg-orange-800 text-white hover:bg-orange-900 shadow-lg border-2 border-white/20"
                        size="lg"
                        variant="secondary"
                      >
                        <PackageCheck className="w-5 h-5 ml-2" />
                        عرض السجلات
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 group">
      <div className="p-3 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl text-orange-600 dark:text-orange-400 group-hover:from-orange-500 group-hover:to-orange-600 group-hover:text-white transition-all duration-300 h-fit">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-foreground mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
