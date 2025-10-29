import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  CreditCard,
  Receipt,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Eye,
  Edit,
  Download,
  RefreshCw,
  BarChart3,
  Package,
  Users,
  Calendar,
  Utensils,
  Bike,
  Home,
  Minus,
  Trash2,
  Percent,
  Hash,
  Phone,
  User,
  Sparkles,
  Coffee,
  Pizza,
} from "lucide-react";

interface POSOrder {
  id: string;
  orderNumber: string;
  type: "dine_in" | "takeaway" | "delivery";
  status: "open" | "parked" | "paid" | "cancelled";
  customerName?: string;
  customerPhone?: string;
  itemsCount: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  createdAt: string;
  paidAt?: string;
  source: string;
}

interface MenuItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image?: string;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  subtotal: number;
}

// Sample data
const orders: POSOrder[] = [
  {
    id: "1",
    orderNumber: "POS-2025-001",
    type: "dine_in",
    status: "paid",
    customerName: "أحمد محمد",
    customerPhone: "01012345678",
    itemsCount: 3,
    subtotal: 150,
    taxAmount: 21,
    discountAmount: 10,
    total: 161,
    createdAt: "2025-10-28T10:30:00",
    paidAt: "2025-10-28T11:15:00",
    source: "pos",
  },
  {
    id: "2",
    orderNumber: "POS-2025-002",
    type: "takeaway",
    status: "paid",
    customerName: "فاطمة علي",
    customerPhone: "01098765432",
    itemsCount: 2,
    subtotal: 85,
    taxAmount: 11.9,
    discountAmount: 0,
    total: 96.9,
    createdAt: "2025-10-28T11:00:00",
    paidAt: "2025-10-28T11:05:00",
    source: "pos",
  },
  {
    id: "3",
    orderNumber: "POS-2025-003",
    type: "delivery",
    status: "open",
    customerName: "محمود حسن",
    customerPhone: "01055555555",
    itemsCount: 4,
    subtotal: 220,
    taxAmount: 30.8,
    discountAmount: 0,
    total: 250.8,
    createdAt: "2025-10-28T12:00:00",
    source: "pos",
  },
  {
    id: "4",
    orderNumber: "POS-2025-004",
    type: "dine_in",
    status: "parked",
    itemsCount: 2,
    subtotal: 95,
    taxAmount: 13.3,
    discountAmount: 5,
    total: 103.3,
    createdAt: "2025-10-28T12:30:00",
    source: "pos",
  },
];

const menuItems: MenuItem[] = [
  {
    id: "1",
    sku: "FOOD-001",
    name: "وجبة مشكلة",
    category: "وجبات رئيسية",
    price: 65,
    available: true,
  },
  {
    id: "2",
    sku: "FOOD-002",
    name: "سلطة خضراء",
    category: "مقبلات",
    price: 25,
    available: true,
  },
  {
    id: "3",
    sku: "DRINK-001",
    name: "عصير برتقال",
    category: "مشروبات",
    price: 20,
    available: true,
  },
  {
    id: "4",
    sku: "FOOD-003",
    name: "بيتزا مارجريتا",
    category: "وجبات رئيسية",
    price: 80,
    available: true,
  },
  {
    id: "5",
    sku: "DRINK-002",
    name: "قهوة تركية",
    category: "مشروبات",
    price: 15,
    available: true,
  },
  {
    id: "6",
    sku: "DESSERT-001",
    name: "حلى الشوكولاتة",
    category: "حلويات",
    price: 35,
    available: true,
  },
];

export default function POS() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState<"new-order" | "orders">("new-order");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<"dine_in" | "takeaway" | "delivery">("dine_in");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  
  // Dialog states
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<POSOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "mobile">("cash");
  const [amountReceived, setAmountReceived] = useState("");

  // Calculate summary stats
  const todayOrders = orders.filter(o => o.status === "paid").length;
  const todayRevenue = orders.filter(o => o.status === "paid").reduce((sum, o) => sum + o.total, 0);
  const openOrders = orders.filter(o => o.status === "open").length;
  const parkedOrders = orders.filter(o => o.status === "parked").length;

  // Calculate cart totals
  const cartSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const taxRate = 0.14; // 14%
  const cartTax = cartSubtotal * taxRate;
  const cartDiscount = (cartSubtotal * discountPercent) / 100;
  const cartTotal = cartSubtotal + cartTax - cartDiscount;

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    const matchesType = selectedType === "all" || order.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Filter menu items
  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find(item => item.menuItem.id === menuItem.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.menuItem.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * menuItem.price }
          : item
      ));
    } else {
      setCart([...cart, { menuItem, quantity: 1, subtotal: menuItem.price }]);
    }
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.menuItem.id === menuItemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, subtotal: newQty * item.menuItem.price };
      }
      return item;
    }));
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(cart.filter(item => item.menuItem.id !== menuItemId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setDiscountPercent(0);
  };
  
  const handlePayment = async () => {
    if (cart.length === 0) {
      alert('السلة فارغة');
      return;
    }
    
    try {
      const orderData = {
        orderType,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        items: cart.map(item => ({
          itemId: item.menuItem.id,
          quantity: item.quantity,
          unitPrice: item.menuItem.price,
          subtotal: item.subtotal
        })),
        subtotal: cartSubtotal,
        taxAmount: cartTax,
        discountAmount: cartDiscount,
        total: cartTotal,
        paymentMethod,
        amountReceived: parseFloat(amountReceived) || cartTotal
      };
      
      const response = await fetch('/api/pos/sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`تم إتمام البيع بنجاح!\nرقم الطلب: ${result.orderNumber || 'N/A'}`);
        clearCart();
        setIsPaymentDialogOpen(false);
        setAmountReceived('');
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`خطأ: ${error.error || 'فشل إتمام البيع'}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('حدث خطأ أثناء إتمام البيع');
    }
  };
  
  const handleViewOrder = (order: POSOrder) => {
    setSelectedOrder(order);
    setIsViewOrderDialogOpen(true);
  };
  
  const handlePayOrder = (order: POSOrder) => {
    setSelectedOrder(order);
    setPaymentMethod('cash');
    setAmountReceived(order.total.toFixed(2));
    setIsPaymentDialogOpen(true);
  };
  
  const handleDownloadReceipt = async (order: POSOrder) => {
    try {
      alert(`تحميل فاتورة رقم: ${order.orderNumber}\nهذه الميزة ستتوفر قريباً`);
      // TODO: Implement PDF generation
      // const response = await fetch(`/api/pos/receipt/${order.id}`);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `receipt-${order.orderNumber}.pdf`;
      // a.click();
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('حدث خطأ أثناء تحميل الفاتورة');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "open": { 
        label: "مفتوح", 
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        icon: Clock 
      },
      "parked": { 
        label: "معلق", 
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        icon: Clock 
      },
      "paid": { 
        label: "مدفوع", 
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        icon: CheckCircle2 
      },
      "cancelled": { 
        label: "ملغي", 
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        icon: XCircle 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="w-3 h-3 ml-1" />
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      "dine_in": { label: "تناول في المطعم", icon: Utensils, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100" },
      "takeaway": { label: "تيك أواي", icon: Package, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
      "delivery": { label: "توصيل", icon: Bike, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="w-3 h-3 ml-1" />
        {config.label}
      </Badge>
    );
  };

  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 dark:from-slate-950 dark:via-emerald-950/10 dark:to-slate-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-l from-emerald-600 to-slate-900 dark:from-emerald-400 dark:to-slate-100 bg-clip-text text-transparent">
                نقاط البيع
              </h1>
              <p className="text-muted-foreground mt-1">
                نظام نقاط البيع الكامل مع قدرات عبر الإنترنت وغير منصلة. معالجة المبيعات وإدارة المدفوعات والتكامل مع السلطات المالية.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              onClick={() => {
                setActiveTab("new-order");
                clearCart();
              }}
            >
              <Plus className="w-4 h-4 ml-2" />
              طلب جديد
            </Button>
            <Link to="/pos-sale">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Receipt className="w-4 h-4 ml-2" />
                تسجيل بيع
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 ml-2" />
                تقارير المبيعات
              </Button>
            </Link>
            <Button 
              variant="outline"
              onClick={() => {
                const csv = orders.map(o => 
                  `${o.orderNumber},${o.type},${o.status},${o.customerName || 'N/A'},${o.total},${new Date(o.createdAt).toLocaleString('ar-EG')}`
                ).join('\n');
                const blob = new Blob([`رقم الطلب,النوع,الحالة,اسم العميل,الإجمالي,التاريخ\n${csv}`], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `pos-orders-${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
              }}
            >
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg">
                  <Receipt className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">طلبات اليوم</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-emerald-600 to-slate-900 dark:from-emerald-400 dark:to-slate-100 bg-clip-text text-transparent">
                {todayOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-2">طلب مكتمل</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">إيرادات اليوم</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-emerald-600 to-slate-900 dark:from-emerald-400 dark:to-slate-100 bg-clip-text text-transparent">
                {todayRevenue.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">جنيه مصري</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">طلبات مفتوحة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-emerald-600 to-slate-900 dark:from-emerald-400 dark:to-slate-100 bg-clip-text text-transparent">
                {openOrders}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
                قيد المعالجة
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl text-white shadow-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">طلبات معلقة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-emerald-600 to-slate-900 dark:from-emerald-400 dark:to-slate-100 bg-clip-text text-transparent">
                {parkedOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-2">في الانتظار</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "new-order" ? "default" : "outline"}
            onClick={() => setActiveTab("new-order")}
            className={activeTab === "new-order" ? "bg-gradient-to-r from-emerald-600 to-green-600" : ""}
          >
            <ShoppingCart className="w-4 h-4 ml-2" />
            طلب جديد
          </Button>
          <Button
            variant={activeTab === "orders" ? "default" : "outline"}
            onClick={() => setActiveTab("orders")}
            className={activeTab === "orders" ? "bg-gradient-to-r from-emerald-600 to-green-600" : ""}
          >
            <Receipt className="w-4 h-4 ml-2" />
            الطلبات
          </Button>
        </div>

        {/* New Order Tab */}
        {activeTab === "new-order" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menu Items */}
            <div className="lg:col-span-2">
              <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pizza className="w-5 h-5" />
                    القائمة
                  </CardTitle>
                  <div className="relative mt-4">
                    <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="ابحث في القائمة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredMenuItems.map((item) => (
                      <Card
                        key={item.id}
                        className="cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 transition-all"
                        onClick={() => addToCart(item)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-square bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg flex items-center justify-center mb-3">
                            <Coffee className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                          <Badge variant="outline" className="text-xs mb-2">{item.category}</Badge>
                          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {item.price} ج.م
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cart & Checkout */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-emerald-400 dark:border-emerald-600 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    السلة ({cart.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Type */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">نوع الطلب</label>
                      <Select value={orderType} onValueChange={(value: any) => setOrderType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dine_in">
                            <div className="flex items-center gap-2">
                              <Utensils className="w-4 h-4" />
                              تناول في المطعم
                            </div>
                          </SelectItem>
                          <SelectItem value="takeaway">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              تيك أواي
                            </div>
                          </SelectItem>
                          <SelectItem value="delivery">
                            <div className="flex items-center gap-2">
                              <Bike className="w-4 h-4" />
                              توصيل
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-2">
                      <Input
                        placeholder="اسم العميل (اختياري)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                      <Input
                        placeholder="رقم الهاتف (اختياري)"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>

                    {/* Cart Items */}
                    <div className="border-t pt-4 max-h-60 overflow-y-auto">
                      {cart.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          السلة فارغة
                        </p>
                      ) : (
                        cart.map((item) => (
                          <div key={item.menuItem.id} className="flex items-center justify-between mb-3 pb-3 border-b">
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{item.menuItem.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.menuItem.price} × {item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.menuItem.id, -1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center font-bold">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.menuItem.id, 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.menuItem.id)}
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Discount */}
                    {cart.length > 0 && (
                      <div className="border-t pt-4">
                        <label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Percent className="w-4 h-4" />
                          الخصم %
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(Number(e.target.value))}
                        />
                      </div>
                    )}

                    {/* Totals */}
                    {cart.length > 0 && (
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>المجموع الفرعي:</span>
                          <span className="font-semibold">{cartSubtotal.toFixed(2)} ج.م</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>الضريبة (14%):</span>
                          <span className="font-semibold">{cartTax.toFixed(2)} ج.م</span>
                        </div>
                        {cartDiscount > 0 && (
                          <div className="flex justify-between text-sm text-red-600">
                            <span>الخصم ({discountPercent}%):</span>
                            <span className="font-semibold">-{cartDiscount.toFixed(2)} ج.م</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>الإجمالي:</span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {cartTotal.toFixed(2)} ج.م
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={clearCart}
                        disabled={cart.length === 0}
                      >
                        <XCircle className="w-4 h-4 ml-2" />
                        مسح
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                        disabled={cart.length === 0}
                        onClick={() => setIsPaymentDialogOpen(true)}
                      >
                        <CreditCard className="w-4 h-4 ml-2" />
                        دفع
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <>
            <Card className="mb-6 border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  البحث والتصفية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="ابحث عن طلب..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="نوع الطلب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="dine_in">تناول في المطعم</SelectItem>
                      <SelectItem value="takeaway">تيك أواي</SelectItem>
                      <SelectItem value="delivery">توصيل</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="open">مفتوح</SelectItem>
                      <SelectItem value="parked">معلق</SelectItem>
                      <SelectItem value="paid">مدفوع</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    الطلبات
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {filteredOrders.length} طلب
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">العميل</TableHead>
                      <TableHead className="text-right">عدد الأصناف</TableHead>
                      <TableHead className="text-right">المجموع الفرعي</TableHead>
                      <TableHead className="text-right">الضريبة</TableHead>
                      <TableHead className="text-right">الإجمالي</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20">
                        <TableCell className="font-mono text-sm font-semibold">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>{getTypeBadge(order.type)}</TableCell>
                        <TableCell>
                          {order.customerName ? (
                            <div>
                              <p className="font-semibold">{order.customerName}</p>
                              <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.itemsCount}</Badge>
                        </TableCell>
                        <TableCell>{order.subtotal.toFixed(2)} ج.م</TableCell>
                        <TableCell>{order.taxAmount.toFixed(2)} ج.م</TableCell>
                        <TableCell className="font-bold">
                          {order.total.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.createdAt).toLocaleString('ar-EG', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                              title="عرض التفاصيل"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {order.status === "open" && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handlePayOrder(order)}
                                title="دفع"
                              >
                                <CreditCard className="w-4 h-4 text-green-600" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadReceipt(order)}
                              title="تحميل الفاتورة"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              إتمام الدفع
            </DialogTitle>
            <DialogDescription>
              اختر طريقة الدفع وأدخل المبلغ المستلم
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي:</span>
                  <span className="font-semibold">{cartSubtotal.toFixed(2)} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الضريبة (14%):</span>
                  <span className="font-semibold">{cartTax.toFixed(2)} ج.م</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الخصم ({discountPercent}%):</span>
                    <span className="font-semibold text-red-600">-{cartDiscount.toFixed(2)} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between col-span-2 pt-2 border-t">
                  <span className="font-bold">الإجمالي:</span>
                  <span className="font-bold text-xl text-emerald-600">{cartTotal.toFixed(2)} ج.م</span>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div>
              <Label>طريقة الدفع</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  className={paymentMethod === "cash" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <DollarSign className="w-4 h-4 ml-2" />
                  نقدي
                </Button>
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  className={paymentMethod === "card" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard className="w-4 h-4 ml-2" />
                  بطاقة
                </Button>
                <Button
                  variant={paymentMethod === "mobile" ? "default" : "outline"}
                  className={paymentMethod === "mobile" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                  onClick={() => setPaymentMethod("mobile")}
                >
                  <Phone className="w-4 h-4 ml-2" />
                  محفظة
                </Button>
              </div>
            </div>
            
            {/* Amount Received */}
            {paymentMethod === "cash" && (
              <div>
                <Label htmlFor="amount-received">المبلغ المستلم</Label>
                <Input
                  id="amount-received"
                  type="number"
                  step="0.01"
                  placeholder={cartTotal.toFixed(2)}
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  className="text-lg font-bold"
                />
                {parseFloat(amountReceived) > cartTotal && (
                  <p className="text-sm text-emerald-600 mt-1">
                    الباقي: {(parseFloat(amountReceived) - cartTotal).toFixed(2)} ج.م
                  </p>
                )}
              </div>
            )}
            
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payment-customer-name">اسم العميل (اختياري)</Label>
                <Input
                  id="payment-customer-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="اسم العميل"
                />
              </div>
              <div>
                <Label htmlFor="payment-customer-phone">رقم الهاتف (اختياري)</Label>
                <Input
                  id="payment-customer-phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              onClick={handlePayment}
            >
              <CheckCircle2 className="w-4 h-4 ml-2" />
              تأكيد الدفع
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Order Dialog */}
      <Dialog open={isViewOrderDialogOpen} onOpenChange={setIsViewOrderDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              تفاصيل الطلب
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">رقم الطلب</Label>
                  <p className="font-mono text-lg font-bold">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">النوع</Label>
                  <div className="mt-1">{getTypeBadge(selectedOrder.type)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">الحالة</Label>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">التاريخ</Label>
                  <p className="text-lg">
                    {new Date(selectedOrder.createdAt).toLocaleString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {selectedOrder.customerName && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">اسم العميل</Label>
                      <p className="text-lg font-semibold">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">رقم الهاتف</Label>
                      <p className="text-lg">{selectedOrder.customerPhone}</p>
                    </div>
                  </>
                )}
              </div>
              
              {/* Financial Summary */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-lg border-2 border-emerald-200 dark:border-emerald-800">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">عدد الأصناف</p>
                    <p className="text-2xl font-bold text-emerald-600">{selectedOrder.itemsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المجموع الفرعي</p>
                    <p className="text-2xl font-bold">{selectedOrder.subtotal.toFixed(2)} ج.م</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الضريبة</p>
                    <p className="text-2xl font-bold">{selectedOrder.taxAmount.toFixed(2)} ج.م</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الإجمالي</p>
                    <p className="text-3xl font-bold text-green-600">{selectedOrder.total.toFixed(2)} ج.م</p>
                  </div>
                </div>
              </div>
              
              {selectedOrder.discountAmount > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <p className="text-sm">
                    💰 <strong>خصم مطبق:</strong> {selectedOrder.discountAmount.toFixed(2)} ج.م
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOrderDialogOpen(false)}>
              إغلاق
            </Button>
            {selectedOrder && selectedOrder.status === "paid" && (
              <Button 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                onClick={() => handleDownloadReceipt(selectedOrder)}
              >
                <Download className="w-4 h-4 ml-2" />
                تحميل الفاتورة
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
