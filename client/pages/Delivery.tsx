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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  Eye,
  Edit,
  Download,
  RefreshCw,
  BarChart3,
  User,
  Phone,
  Navigation,
  TrendingUp,
  Calendar,
  Star,
  Timer,
  Route,
  Home,
  ShoppingBag,
  PlayCircle,
  PauseCircle,
  CheckSquare,
} from "lucide-react";

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  area: string;
  status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled";
  driverId?: string;
  driverName?: string;
  itemsCount: number;
  total: number;
  deliveryFee: number;
  orderTime: string;
  estimatedTime?: string;
  actualDeliveryTime?: string;
  priority: "normal" | "urgent";
  paymentMethod: "cash" | "card" | "online";
  paymentStatus: "pending" | "paid";
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  status: "available" | "busy" | "offline";
  currentOrders: number;
  completedToday: number;
  totalEarnings: number;
  rating: number;
  totalRatings: number;
}

interface DeliveryArea {
  id: string;
  name: string;
  deliveryFee: number;
  estimatedTime: number;
  activeOrders: number;
  totalOrders: number;
}

// Sample data
const orders: DeliveryOrder[] = [
  {
    id: "1",
    orderNumber: "DEL-2025-001",
    customerName: "أحمد محمد",
    customerPhone: "01234567890",
    address: "شارع الجامعة، عمارة 15، الدور الثالث",
    area: "المعادي",
    status: "in_transit",
    driverId: "1",
    driverName: "محمد علي",
    itemsCount: 5,
    total: 250,
    deliveryFee: 20,
    orderTime: "2025-10-28T12:30:00",
    estimatedTime: "2025-10-28T13:00:00",
    priority: "normal",
    paymentMethod: "cash",
    paymentStatus: "pending",
  },
  {
    id: "2",
    orderNumber: "DEL-2025-002",
    customerName: "فاطمة حسن",
    customerPhone: "01098765432",
    address: "شارع النيل، برج السلام، شقة 25",
    area: "المعادي",
    status: "assigned",
    driverId: "2",
    driverName: "أحمد خالد",
    itemsCount: 8,
    total: 480,
    deliveryFee: 20,
    orderTime: "2025-10-28T12:45:00",
    estimatedTime: "2025-10-28T13:15:00",
    priority: "urgent",
    paymentMethod: "online",
    paymentStatus: "paid",
  },
  {
    id: "3",
    orderNumber: "DEL-2025-003",
    customerName: "خالد عبدالله",
    customerPhone: "01156789012",
    address: "شارع الهرم، عمارة النور، الدور الخامس",
    area: "الهرم",
    status: "pending",
    itemsCount: 3,
    total: 180,
    deliveryFee: 30,
    orderTime: "2025-10-28T13:00:00",
    priority: "normal",
    paymentMethod: "cash",
    paymentStatus: "pending",
  },
  {
    id: "4",
    orderNumber: "DEL-2025-004",
    customerName: "سارة أحمد",
    customerPhone: "01223456789",
    address: "شارع التحرير، مجمع السكني، شقة 10",
    area: "الدقي",
    status: "picked_up",
    driverId: "3",
    driverName: "يوسف محمود",
    itemsCount: 6,
    total: 350,
    deliveryFee: 25,
    orderTime: "2025-10-28T12:15:00",
    estimatedTime: "2025-10-28T12:45:00",
    priority: "normal",
    paymentMethod: "card",
    paymentStatus: "paid",
  },
  {
    id: "5",
    orderNumber: "DEL-2025-005",
    customerName: "نور الدين",
    customerPhone: "01187654321",
    address: "شارع الجيزة، عمارة الفتح، شقة 8",
    area: "الجيزة",
    status: "delivered",
    driverId: "1",
    driverName: "محمد علي",
    itemsCount: 4,
    total: 220,
    deliveryFee: 25,
    orderTime: "2025-10-28T11:30:00",
    estimatedTime: "2025-10-28T12:00:00",
    actualDeliveryTime: "2025-10-28T11:55:00",
    priority: "normal",
    paymentMethod: "cash",
    paymentStatus: "paid",
  },
];

const drivers: Driver[] = [
  {
    id: "1",
    name: "محمد علي",
    phone: "01012345678",
    vehicleType: "دراجة نارية",
    vehicleNumber: "أ ب ج 1234",
    status: "busy",
    currentOrders: 1,
    completedToday: 8,
    totalEarnings: 1250,
    rating: 4.8,
    totalRatings: 156,
  },
  {
    id: "2",
    name: "أحمد خالد",
    phone: "01098765432",
    vehicleType: "دراجة نارية",
    vehicleNumber: "د هـ و 5678",
    status: "busy",
    currentOrders: 1,
    completedToday: 6,
    totalEarnings: 980,
    rating: 4.6,
    totalRatings: 124,
  },
  {
    id: "3",
    name: "يوسف محمود",
    phone: "01156789012",
    vehicleType: "سيارة",
    vehicleNumber: "ز ح ط 9012",
    status: "busy",
    currentOrders: 1,
    completedToday: 5,
    totalEarnings: 850,
    rating: 4.9,
    totalRatings: 189,
  },
  {
    id: "4",
    name: "عمر حسن",
    phone: "01223456789",
    vehicleType: "دراجة نارية",
    vehicleNumber: "ي ك ل 3456",
    status: "available",
    currentOrders: 0,
    completedToday: 7,
    totalEarnings: 1120,
    rating: 4.7,
    totalRatings: 143,
  },
];

const areas: DeliveryArea[] = [
  { id: "1", name: "المعادي", deliveryFee: 20, estimatedTime: 30, activeOrders: 2, totalOrders: 45 },
  { id: "2", name: "الهرم", deliveryFee: 30, estimatedTime: 40, activeOrders: 1, totalOrders: 32 },
  { id: "3", name: "الدقي", deliveryFee: 25, estimatedTime: 35, activeOrders: 1, totalOrders: 38 },
  { id: "4", name: "الجيزة", deliveryFee: 25, estimatedTime: 35, activeOrders: 0, totalOrders: 28 },
  { id: "5", name: "مدينة نصر", deliveryFee: 35, estimatedTime: 45, activeOrders: 0, totalOrders: 41 },
];

export default function Delivery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState<"orders" | "drivers" | "areas">("orders");
  
  // Dialog states
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [isAssignDriverDialogOpen, setIsAssignDriverDialogOpen] = useState(false);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false);
  const [isViewDriverDialogOpen, setIsViewDriverDialogOpen] = useState(false);
  const [isViewAreaDialogOpen, setIsViewAreaDialogOpen] = useState(false);
  const [isNewDriverDialogOpen, setIsNewDriverDialogOpen] = useState(false);
  const [isNewAreaDialogOpen, setIsNewAreaDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedAreaDetail, setSelectedAreaDetail] = useState<DeliveryArea | null>(null);
  
  // Form states
  const [orderToAssign, setOrderToAssign] = useState<DeliveryOrder | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  
  // New driver form
  const [newDriverForm, setNewDriverForm] = useState({
    name: "",
    phone: "",
    vehicleType: "دراجة نارية",
    vehicleNumber: ""
  });
  
  // New area form
  const [newAreaForm, setNewAreaForm] = useState({
    name: "",
    deliveryFee: "",
    estimatedTime: ""
  });
  
  // Handlers
  const handleViewOrder = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setIsViewOrderDialogOpen(true);
  };
  
  const handleTrackOrder = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setIsTrackingDialogOpen(true);
  };
  
  const handleAssignDriver = (order: DeliveryOrder) => {
    setOrderToAssign(order);
    setIsAssignDriverDialogOpen(true);
  };
  
  const handleConfirmAssignment = () => {
    if (!selectedDriverId) {
      alert('يرجى اختيار سائق');
      return;
    }
    const driver = drivers.find(d => d.id === selectedDriverId);
    alert(`تم تعيين السائق ${driver?.name} للطلب ${orderToAssign?.orderNumber}`);
    setIsAssignDriverDialogOpen(false);
    setSelectedDriverId("");
  };
  
  const handleViewDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsViewDriverDialogOpen(true);
  };
  
  const handleViewArea = (area: DeliveryArea) => {
    setSelectedAreaDetail(area);
    setIsViewAreaDialogOpen(true);
  };
  
  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    alert('سيتم إضافة وظيفة تعديل السائق قريباً');
  };
  
  const handleEditArea = (area: DeliveryArea) => {
    setSelectedAreaDetail(area);
    alert('سيتم إضافة وظيفة تعديل المنطقة قريباً');
  };
  
  const handleCreateDriver = async () => {
    if (!newDriverForm.name || !newDriverForm.phone || !newDriverForm.vehicleNumber) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    try {
      const code = `DRV-${Date.now()}`;
      const response = await fetch('/api/delivery/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name: newDriverForm.name,
          phone: newDriverForm.phone,
          vehicleType: newDriverForm.vehicleType,
          vehicleNumber: newDriverForm.vehicleNumber,
          status: 'available'
        })
      });
      
      if (!response.ok) throw new Error('فشل في إضافة السائق');
      
      alert(`تم إضافة السائق ${newDriverForm.name} بنجاح`);
      setIsNewDriverDialogOpen(false);
      setNewDriverForm({ name: "", phone: "", vehicleType: "دراجة نارية", vehicleNumber: "" });
      
      // Refresh page to show new driver
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إضافة السائق');
    }
  };
  
  const handleCreateArea = async () => {
    if (!newAreaForm.name || !newAreaForm.deliveryFee || !newAreaForm.estimatedTime) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    try {
      const response = await fetch('/api/delivery/areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAreaForm.name,
          deliveryFee: parseFloat(newAreaForm.deliveryFee),
          estimatedTime: parseInt(newAreaForm.estimatedTime)
        })
      });
      
      if (!response.ok) throw new Error('فشل في إضافة المنطقة');
      
      alert(`تم إضافة منطقة ${newAreaForm.name} بنجاح`);
      setIsNewAreaDialogOpen(false);
      setNewAreaForm({ name: "", deliveryFee: "", estimatedTime: "" });
      
      // Refresh page to show new area
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إضافة المنطقة');
    }
  };

  // Calculate summary stats
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => !["delivered", "cancelled"].includes(o.status)).length;
  const deliveredToday = orders.filter(o => o.status === "delivered").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total + o.deliveryFee, 0);
  const averageDeliveryTime = 28; // minutes

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerPhone.includes(searchQuery);
    const matchesArea = selectedArea === "all" || order.area === selectedArea;
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    
    return matchesSearch && matchesArea && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "pending": { 
        label: "معلق", 
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        icon: Clock 
      },
      "assigned": { 
        label: "معين", 
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        icon: User 
      },
      "picked_up": { 
        label: "تم الاستلام", 
        className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
        icon: ShoppingBag 
      },
      "in_transit": { 
        label: "في الطريق", 
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
        icon: Truck 
      },
      "delivered": { 
        label: "تم التوصيل", 
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

  const getDriverStatusBadge = (status: string) => {
    const statusConfig = {
      "available": { label: "متاح", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
      "busy": { label: "مشغول", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" },
      "offline": { label: "غير متصل", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    return priority === "urgent" ? (
      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
        <AlertCircle className="w-3 h-3 ml-1" />
        عاجل
      </Badge>
    ) : null;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.floor(diff / 60000); // minutes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-950 dark:via-indigo-950/10 dark:to-slate-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-l from-indigo-600 to-slate-900 dark:from-indigo-400 dark:to-slate-100 bg-clip-text text-transparent">
                إدارة التوصيل
              </h1>
              <p className="text-muted-foreground mt-1">
                إدارة التوصيلات مع تعيين السائقين والتتبع في الوقت الفعلي. التكامل مع موفري التوصيل الجهات الخارجية للوصول الموسع.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              onClick={() => setIsNewOrderDialogOpen(true)}
            >
              <Plus className="w-4 h-4 ml-2" />
              طلب توصيل جديد
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={() => {
                const pendingOrder = orders.find(o => o.status === 'pending');
                if (pendingOrder) {
                  handleAssignDriver(pendingOrder);
                } else {
                  alert('لا توجد طلبات معلقة للتعيين');
                }
              }}
            >
              <User className="w-4 h-4 ml-2" />
              تعيين سائق
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
              onClick={() => {
                const activeOrder = orders.find(o => o.status === 'in_transit');
                if (activeOrder) {
                  handleTrackOrder(activeOrder);
                } else {
                  alert('لا توجد طلبات في الطريق حالياً');
                }
              }}
            >
              <Navigation className="w-4 h-4 ml-2" />
              تتبع مباشر
            </Button>
            <Button 
              variant="outline"
              onClick={() => alert('سيتم إضافة وظيفة تحسين المسارات قريباً')}
            >
              <Route className="w-4 h-4 ml-2" />
              تحسين المسارات
            </Button>
            <Link to="/reports">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 ml-2" />
                تقارير التوصيل
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="border-2 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-white shadow-lg">
                  <Package className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">إجمالي الطلبات</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-indigo-600 to-slate-900 dark:from-indigo-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-2">اليوم</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white shadow-lg">
                  <Truck className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">طلبات نشطة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-indigo-600 to-slate-900 dark:from-indigo-400 dark:to-slate-100 bg-clip-text text-transparent">
                {activeOrders}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 font-medium">
                قيد التوصيل
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">تم التوصيل</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-indigo-600 to-slate-900 dark:from-indigo-400 dark:to-slate-100 bg-clip-text text-transparent">
                {deliveredToday}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                مكتمل اليوم
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                  <Timer className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">متوسط الوقت</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-indigo-600 to-slate-900 dark:from-indigo-400 dark:to-slate-100 bg-clip-text text-transparent">
                {averageDeliveryTime}
              </div>
              <p className="text-xs text-muted-foreground mt-2">دقيقة</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white shadow-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">إجمالي الإيرادات</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-indigo-600 to-slate-900 dark:from-indigo-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalRevenue}
              </div>
              <p className="text-xs text-muted-foreground mt-2">جنيه مصري</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "orders" ? "default" : "outline"}
            onClick={() => setActiveTab("orders")}
            className={activeTab === "orders" ? "bg-gradient-to-r from-indigo-600 to-blue-600" : ""}
          >
            <Package className="w-4 h-4 ml-2" />
            طلبات التوصيل
          </Button>
          <Button
            variant={activeTab === "drivers" ? "default" : "outline"}
            onClick={() => setActiveTab("drivers")}
            className={activeTab === "drivers" ? "bg-gradient-to-r from-indigo-600 to-blue-600" : ""}
          >
            <User className="w-4 h-4 ml-2" />
            السائقون
          </Button>
          <Button
            variant={activeTab === "areas" ? "default" : "outline"}
            onClick={() => setActiveTab("areas")}
            className={activeTab === "areas" ? "bg-gradient-to-r from-indigo-600 to-blue-600" : ""}
          >
            <MapPin className="w-4 h-4 ml-2" />
            مناطق التوصيل
          </Button>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <>
            {/* Filters */}
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
                      placeholder="ابحث عن طلب أو عميل..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>

                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger>
                      <SelectValue placeholder="المنطقة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المناطق</SelectItem>
                      {areas.map((area) => (
                        <SelectItem key={area.id} value={area.name}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="pending">معلق</SelectItem>
                      <SelectItem value="assigned">معين</SelectItem>
                      <SelectItem value="picked_up">تم الاستلام</SelectItem>
                      <SelectItem value="in_transit">في الطريق</SelectItem>
                      <SelectItem value="delivered">تم التوصيل</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="border-2 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          <Clock className="w-3 h-3 inline ml-1" />
                          {formatTime(order.orderTime)}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        {getStatusBadge(order.status)}
                        {getPriorityBadge(order.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Customer Info */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="font-semibold mb-1">{order.customerName}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Phone className="w-3 h-3" />
                          {order.customerPhone}
                        </div>
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{order.address}</span>
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {order.area}
                        </Badge>
                      </div>

                      {/* Driver Info */}
                      {order.driverName && (
                        <div className="flex items-center justify-between text-sm p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <span className="text-muted-foreground">السائق</span>
                          <span className="font-medium">{order.driverName}</span>
                        </div>
                      )}

                      {/* Order Details */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">الأصناف</p>
                          <p className="font-semibold">{order.itemsCount} صنف</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">رسوم التوصيل</p>
                          <p className="font-semibold">{order.deliveryFee} ج.م</p>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-muted-foreground">الإجمالي</span>
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          {order.total + order.deliveryFee} ج.م
                        </span>
                      </div>

                      {/* Payment Info */}
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline" className={
                          order.paymentStatus === "paid" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        }>
                          {order.paymentStatus === "paid" ? "مدفوع" : "غير مدفوع"}
                        </Badge>
                        <span className="text-muted-foreground">
                          {order.paymentMethod === "cash" ? "نقدي" : order.paymentMethod === "card" ? "بطاقة" : "أونلاين"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="w-3 h-3 ml-1" />
                          عرض
                        </Button>
                        {order.status === "in_transit" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-900/20"
                            onClick={() => handleTrackOrder(order)}
                          >
                            <Navigation className="w-3 h-3 ml-1" />
                            تتبع
                          </Button>
                        )}
                        {order.status === "pending" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20"
                            onClick={() => handleAssignDriver(order)}
                          >
                            <User className="w-3 h-3 ml-1" />
                            تعيين
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Drivers Tab */}
        {activeTab === "drivers" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">قائمة السائقين</h2>
              <Button 
                className="bg-gradient-to-r from-indigo-600 to-blue-600"
                onClick={() => setIsNewDriverDialogOpen(true)}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة سائق جديد
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {drivers.map((driver) => (
              <Card key={driver.id} className="border-2 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{driver.name}</CardTitle>
                        <CardDescription className="text-xs">
                          <Phone className="w-3 h-3 inline ml-1" />
                          {driver.phone}
                        </CardDescription>
                      </div>
                    </div>
                    {getDriverStatusBadge(driver.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Vehicle Info */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">المركبة</p>
                      <p className="font-semibold text-sm">{driver.vehicleType}</p>
                      <p className="text-xs text-muted-foreground mt-1">{driver.vehicleNumber}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">طلبات نشطة</p>
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {driver.currentOrders}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">مكتمل اليوم</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {driver.completedToday}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span className="font-bold">{driver.rating}</span>
                        <span className="text-xs text-muted-foreground">({driver.totalRatings})</span>
                      </div>
                    </div>

                    {/* Earnings */}
                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">أرباح اليوم</p>
                      <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {driver.totalEarnings} ج.م
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewDriver(driver)}
                      >
                        <Eye className="w-3 h-3 ml-1" />
                        عرض
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => alert(`تعديل بيانات السائق ${driver.name}`)}
                      >
                        <Edit className="w-3 h-3 ml-1" />
                        تعديل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </>
        )}

        {/* Areas Tab */}
        {activeTab === "areas" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">مناطق التوصيل</h2>
              <Button 
                className="bg-gradient-to-r from-indigo-600 to-blue-600"
                onClick={() => setIsNewAreaDialogOpen(true)}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة منطقة جديدة
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area) => (
              <Card key={area.id} className="border-2 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-lg">{area.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className={
                      area.activeOrders > 0
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    }>
                      {area.activeOrders} نشط
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">رسوم التوصيل</p>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {area.deliveryFee}
                        </p>
                        <p className="text-xs text-muted-foreground">جنيه</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">الوقت المتوقع</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {area.estimatedTime}
                        </p>
                        <p className="text-xs text-muted-foreground">دقيقة</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">إجمالي الطلبات</span>
                        <span className="text-lg font-bold">{area.totalOrders}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewArea(area)}
                      >
                        <Eye className="w-3 h-3 ml-1" />
                        عرض
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => alert(`تعديل معلومات منطقة ${area.name}`)}
                      >
                        <Edit className="w-3 h-3 ml-1" />
                        تعديل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </>
        )}
      </div>
      
      {/* Dialogs */}
      {/* New Order Dialog */}
      <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              طلب توصيل جديد
            </DialogTitle>
            <DialogDescription>
              سيتم توجيهك إلى نقاط البيع لإنشاء طلب توصيل
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm">
              💡 سيتم فتح صفحة نقاط البيع حيث يمكنك إنشاء طلب جديد واختيار "توصيل" كنوع الطلب
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewOrderDialogOpen(false)}>
              إلغاء
            </Button>
            <Link to="/pos">
              <Button className="bg-gradient-to-r from-indigo-600 to-blue-600">
                الانتقال لنقاط البيع
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Driver Dialog */}
      <Dialog open={isAssignDriverDialogOpen} onOpenChange={setIsAssignDriverDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              تعيين سائق
            </DialogTitle>
            <DialogDescription>
              اختر سائق لتوصيل الطلب
            </DialogDescription>
          </DialogHeader>
          
          {orderToAssign && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg mb-4">
              <p className="font-semibold">{orderToAssign.orderNumber}</p>
              <p className="text-sm text-muted-foreground">{orderToAssign.customerName}</p>
              <p className="text-xs text-muted-foreground mt-1">{orderToAssign.address}</p>
            </div>
          )}
          
          <div>
            <Label htmlFor="driver-select">اختر السائق</Label>
            <select
              id="driver-select"
              aria-label="اختر السائق"
              className="w-full h-10 px-3 rounded-md border border-input bg-background mt-2"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
            >
              <option value="">اختر سائق</option>
              {drivers.filter(d => d.status === "available").map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} - {driver.vehicleType} ({driver.currentOrders} طلبات نشطة)
                </option>
              ))}
            </select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDriverDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-emerald-600"
              onClick={handleConfirmAssignment}
            >
              تأكيد التعيين
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Tracking Dialog */}
      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              تتبع التوصيل المباشر
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">رقم الطلب</Label>
                  <p className="font-mono text-lg">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الحالة</Label>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
                <p className="font-semibold mb-2">🚗 {selectedOrder.driverName}</p>
                <p className="text-sm text-muted-foreground">في الطريق إلى: {selectedOrder.address}</p>
                <p className="text-xs text-muted-foreground mt-1">الوقت المتوقع: {selectedOrder.estimatedTime && new Date(selectedOrder.estimatedTime).toLocaleTimeString('ar-EG')}</p>
              </div>
              
              <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto text-indigo-600 mb-2" />
                  <p className="text-sm text-muted-foreground">خريطة التتبع المباشر</p>
                  <p className="text-xs text-muted-foreground mt-1">(سيتم التكامل مع خدمة الخرائط)</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTrackingDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Order Dialog */}
      <Dialog open={isViewOrderDialogOpen} onOpenChange={setIsViewOrderDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              تفاصيل الطلب
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">رقم الطلب</Label>
                  <p className="font-mono text-lg">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الحالة</Label>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h3 className="font-bold mb-2">معلومات العميل</h3>
                <p className="font-semibold">{selectedOrder.customerName}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.customerPhone}</p>
                <p className="text-sm text-muted-foreground mt-2">{selectedOrder.address}</p>
                <Badge variant="outline" className="mt-2">{selectedOrder.area}</Badge>
              </div>
              
              {selectedOrder.driverName && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <p className="text-sm font-semibold">السائق: {selectedOrder.driverName}</p>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">الأصناف</Label>
                  <p className="text-2xl font-bold">{selectedOrder.itemsCount}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">رسوم التوصيل</Label>
                  <p className="text-2xl font-bold">{selectedOrder.deliveryFee} ج.م</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">الإجمالي</Label>
                  <p className="text-3xl font-bold text-indigo-600">{selectedOrder.total + selectedOrder.deliveryFee} ج.م</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <span className="text-sm">طريقة الدفع:</span>
                <span className="font-semibold">
                  {selectedOrder.paymentMethod === "cash" ? "نقدي" : selectedOrder.paymentMethod === "card" ? "بطاقة" : "أونلاين"}
                </span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOrderDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Driver Dialog */}
      <Dialog open={isViewDriverDialogOpen} onOpenChange={setIsViewDriverDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              تفاصيل السائق
            </DialogTitle>
          </DialogHeader>
          
          {selectedDriver && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedDriver.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold">{selectedDriver.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedDriver.phone}</p>
                <div className="mt-2">{getDriverStatusBadge(selectedDriver.status)}</div>
              </div>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Label className="text-muted-foreground text-xs">المركبة</Label>
                <p className="font-semibold">{selectedDriver.vehicleType}</p>
                <p className="text-sm text-muted-foreground">{selectedDriver.vehicleNumber}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">طلبات نشطة</p>
                  <p className="text-2xl font-bold text-orange-600">{selectedDriver.currentOrders}</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">مكتمل اليوم</p>
                  <p className="text-2xl font-bold text-green-600">{selectedDriver.completedToday}</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">الأرباح</p>
                  <p className="text-xl font-bold text-purple-600">{selectedDriver.totalEarnings} ج.م</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span className="text-2xl font-bold">{selectedDriver.rating}</span>
                <span className="text-sm text-muted-foreground">({selectedDriver.totalRatings} تقييم)</span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDriverDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Area Dialog */}
      <Dialog open={isViewAreaDialogOpen} onOpenChange={setIsViewAreaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              تفاصيل المنطقة
            </DialogTitle>
          </DialogHeader>
          
          {selectedAreaDetail && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-lg">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-indigo-600" />
                <h3 className="text-2xl font-bold">{selectedAreaDetail.name}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">رسوم التوصيل</p>
                  <p className="text-3xl font-bold text-indigo-600">{selectedAreaDetail.deliveryFee}</p>
                  <p className="text-xs text-muted-foreground">جنيه مصري</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">الوقت المتوقع</p>
                  <p className="text-3xl font-bold text-blue-600">{selectedAreaDetail.estimatedTime}</p>
                  <p className="text-xs text-muted-foreground">دقيقة</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <Label className="text-muted-foreground text-xs">طلبات نشطة</Label>
                  <p className="text-2xl font-bold text-orange-600">{selectedAreaDetail.activeOrders}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">إجمالي الطلبات</Label>
                  <p className="text-2xl font-bold text-green-600">{selectedAreaDetail.totalOrders}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewAreaDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Driver Dialog */}
      <Dialog open={isNewDriverDialogOpen} onOpenChange={setIsNewDriverDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              إضافة سائق جديد
            </DialogTitle>
            <DialogDescription>
              أدخل بيانات السائق الجديد
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="driver-name">اسم السائق *</Label>
              <Input
                id="driver-name"
                placeholder="مثال: محمد أحمد"
                value={newDriverForm.name}
                onChange={(e) => setNewDriverForm({ ...newDriverForm, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="driver-phone">رقم الهاتف *</Label>
              <Input
                id="driver-phone"
                placeholder="مثال: 01012345678"
                value={newDriverForm.phone}
                onChange={(e) => setNewDriverForm({ ...newDriverForm, phone: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="vehicle-type">نوع المركبة</Label>
              <Select 
                value={newDriverForm.vehicleType}
                onValueChange={(value) => setNewDriverForm({ ...newDriverForm, vehicleType: value })}
              >
                <SelectTrigger id="vehicle-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="دراجة نارية">دراجة نارية</SelectItem>
                  <SelectItem value="سيارة">سيارة</SelectItem>
                  <SelectItem value="دراجة">دراجة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="vehicle-number">رقم المركبة *</Label>
              <Input
                id="vehicle-number"
                placeholder="مثال: أ ب ج 1234"
                value={newDriverForm.vehicleNumber}
                onChange={(e) => setNewDriverForm({ ...newDriverForm, vehicleNumber: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDriverDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-blue-600"
              onClick={handleCreateDriver}
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة السائق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Area Dialog */}
      <Dialog open={isNewAreaDialogOpen} onOpenChange={setIsNewAreaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              إضافة منطقة توصيل جديدة
            </DialogTitle>
            <DialogDescription>
              حدد اسم المنطقة ورسوم التوصيل والوقت المتوقع
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="area-name">اسم المنطقة *</Label>
              <Input
                id="area-name"
                placeholder="مثال: المعادي"
                value={newAreaForm.name}
                onChange={(e) => setNewAreaForm({ ...newAreaForm, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="delivery-fee">رسوم التوصيل (ج.م) *</Label>
              <Input
                id="delivery-fee"
                type="number"
                placeholder="مثال: 25"
                value={newAreaForm.deliveryFee}
                onChange={(e) => setNewAreaForm({ ...newAreaForm, deliveryFee: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="estimated-time">الوقت المتوقع (دقيقة) *</Label>
              <Input
                id="estimated-time"
                type="number"
                placeholder="مثال: 30"
                value={newAreaForm.estimatedTime}
                onChange={(e) => setNewAreaForm({ ...newAreaForm, estimatedTime: e.target.value })}
              />
            </div>
            
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm">
                💡 سيتم تطبيق هذه الرسوم والوقت المتوقع تلقائياً على جميع الطلبات في هذه المنطقة
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewAreaDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-blue-600"
              onClick={handleCreateArea}
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة المنطقة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
