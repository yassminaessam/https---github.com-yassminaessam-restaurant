import { Link, useLocation } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  UtensilsCrossed,
  Truck,
  BarChart3,
  Settings,
  Home,
  Warehouse,
  ChefHat,
  Users,
  Building2,
  Zap,
  PackageCheck,
  ArrowRightLeft,
  DollarSign,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  category: string;
}

const navItems: NavItem[] = [
  {
    icon: <Home className="w-5 h-5" />,
    label: "لوحة التحكم",
    href: "/",
    category: "main",
  },
  {
    icon: <Warehouse className="w-5 h-5" />,
    label: "إدارة المخزون",
    href: "/inventory",
    category: "core",
  },
  {
    icon: <PackageCheck className="w-5 h-5" />,
    label: "محضر استلام بضاعة",
    href: "/grn",
    category: "core",
  },
  {
    icon: <ArrowRightLeft className="w-5 h-5" />,
    label: "تحويل بين المخازن",
    href: "/transfer",
    category: "core",
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    label: "سجلات الحركات",
    href: "/stock-records",
    category: "core",
  },
  {
    icon: <Package className="w-5 h-5" />,
    label: "الشراء والتوريد",
    href: "/purchasing",
    category: "core",
  },
  {
    icon: <ChefHat className="w-5 h-5" />,
    label: "الوصفات والإنتاج",
    href: "/production",
    category: "core",
  },
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    label: "نقاط البيع",
    href: "/pos",
    category: "sales",
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    label: "بيع بوفيه/منى بار",
    href: "/pos-sale",
    category: "sales",
  },
  {
    icon: <UtensilsCrossed className="w-5 h-5" />,
    label: "إدارة قاعة الطعام",
    href: "/dine-in",
    category: "sales",
  },
  {
    icon: <Truck className="w-5 h-5" />,
    label: "إدارة التوصيل",
    href: "/delivery",
    category: "sales",
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    label: "منى بار الفندق",
    href: "/minibar",
    category: "hotel",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "الفاتورة الإلكترونية",
    href: "/einvoice",
    category: "compliance",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: "التقارير والإحصائيات",
    href: "/reports",
    category: "insights",
  },
  {
    icon: <Warehouse className="w-5 h-5" />,
    label: "تقارير المخزون",
    href: "/inventory-reports",
    category: "insights",
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: "المستخدمون والأدوار",
    href: "/users",
    category: "settings",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: "الإعدادات",
    href: "/settings",
    category: "settings",
  },
];

const categories = [
  { id: "main", label: "الرئيسية" },
  { id: "core", label: "العمليات الأساسية" },
  { id: "sales", label: "المبيعات والتوزيع" },
  { id: "hotel", label: "تكامل الفندق" },
  { id: "compliance", label: "الالتزام والضرائب" },
  { id: "insights", label: "الذكاء التجاري" },
  { id: "settings", label: "الإدارة والإعدادات" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const groupedItems = categories.map((cat) => ({
    ...cat,
    items: navItems.filter((item) => item.category === cat.id),
  }));

  return (
    <div className="flex h-screen bg-background flex-row-reverse" dir="ltr">
      <aside className="w-64 border-l border-r-0 border-border bg-sidebar text-sidebar-foreground flex flex-col" dir="rtl">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3 text-xl font-bold">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-sidebar-foreground">رسترو الفرسان</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {groupedItems.map((group) => (
            group.items.length > 0 && (
              <div key={group.id}>
                {group.id !== "main" && (
                  <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2 px-2">
                    {group.label}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-3 h-10",
                            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                          )}
                        >
                          {item.icon}
                          <span className="text-sm">{item.label}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60">
            <p className="font-semibold mb-1">رسترو الفرسان v1.0</p>
            <p>نظام إدارة المطاعم</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto flex flex-col" dir="rtl">
        {!isHome && (
          <div className="sticky top-0 z-10 bg-card border-b border-border px-8 py-4 shadow-sm">
            <h1 className="text-2xl font-bold text-foreground">
              {navItems.find((item) => item.href === location.pathname)
                ?.label || "صفحة"}
            </h1>
          </div>
        )}
        <div className={!isHome ? "p-8" : ""}>{children}</div>
      </main>
    </div>
  );
}
