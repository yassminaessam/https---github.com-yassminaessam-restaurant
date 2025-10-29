import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Placeholder() {
  const location = useLocation();
  const pathName = location.pathname;

  const messages = {
    "/inventory": {
      title: "إدارة المخزون",
      description:
        "إدارة المستودع الرئيسي والمستودعات الفرعية. تتبع مستويات الأسهم وإدارة التحويلات بين المواقع والحفاظ على سجلات مخزون دقيقة عبر جميع المنافذ.",
      features: [
        "تتبع المخزون والإدارة",
        "تحويلات متعددة المستودعات",
        "معالجة الاستلام والمرتجعات",
        "جردات المخزون والتعديلات",
      ],
    },
    "/purchasing": {
      title: "الشراء والتوريد",
      description:
        "إدارة أوامر الشراء ومحاضر الاستلام والعلاقات مع الموردين. التحكم في المشتريات لجميع مواقع المستودع وتتبع أداء الموردين.",
      features: [
        "إنشاء وإدارة أوامر الشراء",
        "معالجة محاضر الاستلام",
        "إدارة مرتجعات الموردين",
        "سجل المشتريات والتحليلات",
      ],
    },
    "/production": {
      title: "الوصفات والإنتاج",
      description:
        "تحديد الوصفات مع قوائم المكونات وإنشاء أوامر الإنتاج وتتبع العائد. مراقبة استهلاك المكونات والتحضير الغذائي بكميات كبيرة.",
      features: [
        "إنشاء وإدارة الوصفات",
        "قوائم المكونات (BOM)",
        "جدولة أوامر الإنتاج",
        "تتبع العائد وتحليل الفروقات",
      ],
    },
    "/pos": {
      title: "نقاط البيع",
      description:
        "نظام نقاط البيع الكامل مع قدرات عبر الإنترنت وغير متصلة. معالجة المبيعات وإدارة المدفوعات والتكامل مع السلطات المالية.",
      features: [
        "نقاط بيع عبر الإنترنت وغير متصلة",
        "طرق الدفع المتعددة",
        "تقارير المبيعات",
        "تكامل الفاتورة الإلكترونية",
      ],
    },
    "/dine-in": {
      title: "إدارة قاعة الطعام",
      description:
        "إدارة طاولات الطعام وإنشاء أوامر المطبخ وتنسيق الموظفين. التعامل مع عمليات الطاولة بما فيها الدمج والفصل.",
      features: [
        "تخطيط قاعة الطعام",
        "إدارة أوامر المطبخ",
        "تنسيق الخدمة",
        "فصل وتجميع الفواتير",
      ],
    },
    "/delivery": {
      title: "إدارة التوصيل",
      description:
        "إدارة التوصيلات مع تعيين السائقين والتتبع في الوقت الفعلي. التكامل مع موفري التوصيل الجهات الخارجية للوصول الموسع.",
      features: [
        "إدارة أوامر التوصيل",
        "تعيين السائقين والتتبع",
        "تكامل جهة خارجية",
        "تحليلات التوصيل",
      ],
    },
    "/minibar": {
      title: "منى بار الفندق",
      description:
        "إدارة إعادة تخزين منى بار ورسوم الغرف والتكامل مع نظام إدارة الفندق. تتبع مخزون أجهزة الغرف الفندقية والمواقع الأخرى.",
      features: [
        "مهام إعادة تخزين منى بار",
        "أتمتة رسوم الغرفة",
        "تكامل نظام إدارة الفندق",
        "تدقيق منى بار",
      ],
    },
    "/reports": {
      title: "التقارير والإحصائيات",
      description:
        "ذكاء تجاري شامل مع المؤشرات الرئيسية وتحليل تكلفة المنتجات المباعة والمقاييس الأداء عبر جميع العمليات.",
      features: [
        "تحليلات المبيعات",
        "تكلفة المنتجات المباعة",
        "تقارير حركة المخزون",
        "لوحات معلومات الأداء",
      ],
    },
    "/einvoice": {
      title: "نظام الفاتورة الإلكترونية",
      description:
        "التوافقية مع الهيئة العامة للضرائب المصرية مع التوقيع الرقمي وأكواس QR وبيئات الرمل والإنتاج.",
      features: [
        "إنشاء وتوقيع الفواتير",
        "إنشاء أكواد QR",
        "تقديم الضرائب",
        "تتبع التوافق",
      ],
    },
    "/users": {
      title: "المستخدمون والأدوار",
      description:
        "إدارة حسابات المستخدمين وتعيين الأدوار وتكوين الصلاحيات. التحكم في الوصول حسب المستودع والموقع والوحدة.",
      features: [
        "إدارة حسابات المستخدمين",
        "التحكم في الوصول بناءً على الأدوار",
        "تكوين الصلاحيات",
        "تسجيل التدقيق",
      ],
    },
    "/settings": {
      title: "الإعدادات",
      description:
        "تكوين إعدادات النظام والم��املات التجارية وخيارات التكامل.",
      features: [
        "تكوين الأعمال",
        "إعدادات الضرائب",
        "تكوين التكامل",
        "تفضيلات النظام",
      ],
    },
  };

  const currentMessage = messages[
    pathName as keyof typeof messages
  ] || {
    title: "قريباً",
    description: "تم تطوير هذه الصفحة وستكون متاحة قريباً.",
    features: [],
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-card rounded-lg border border-border p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            {currentMessage.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {currentMessage.description}
          </p>
        </div>

        {currentMessage.features.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              الميزات الرئيسية
            </h3>
            <ul className="space-y-2">
              {currentMessage.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" style={{ transform: 'scaleX(-1)' }} />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 p-6 mb-8">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            دعنا نبني هذا معاً
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
            هذه الوحدة جاهزة للتطوير. استمر في تقديم التعليمات في الدردشة لبناء وظيفتها وواجهة المستخدم.
          </p>
        </div>

        <div className="flex gap-4">
          <Link to="/">
            <Button variant="outline">العودة إلى لوحة التحكم</Button>
          </Link>
          <Link to="/">
            <Button>عرض جميع الوحدات</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
