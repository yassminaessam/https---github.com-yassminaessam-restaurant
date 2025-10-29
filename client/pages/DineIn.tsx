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
  Utensils,
  Users,
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
  ChefHat,
  User,
  Phone,
  Hash,
  Receipt,
  Sparkles,
  ArrowRightLeft,
  Scissors,
  Merge,
  Bell,
  TrendingUp,
  Calendar,
  MapPin,
} from "lucide-react";

interface Table {
  id: string;
  number: number;
  section: string;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  currentOrder?: {
    orderNumber: string;
    guestName: string;
    guestCount: number;
    startTime: string;
    duration: number;
    total: number;
    itemsCount: number;
  };
  assignedWaiter?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  tableNumber: number;
  guestName: string;
  guestCount: number;
  status: "pending" | "preparing" | "ready" | "served" | "completed";
  itemsCount: number;
  total: number;
  startTime: string;
  assignedWaiter: string;
}

interface Waiter {
  id: string;
  name: string;
  tablesAssigned: number;
  activeOrders: number;
  totalSales: number;
  status: "active" | "break" | "offline";
}

// Sample data
const tables: Table[] = [
  {
    id: "1",
    number: 1,
    section: "قاعة رئيسية",
    capacity: 4,
    status: "occupied",
    currentOrder: {
      orderNumber: "DIN-2025-001",
      guestName: "أحمد محمد",
      guestCount: 3,
      startTime: "2025-10-28T10:30:00",
      duration: 45,
      total: 250,
      itemsCount: 5,
    },
    assignedWaiter: "محمد علي",
  },
  {
    id: "2",
    number: 2,
    section: "قاعة رئيسية",
    capacity: 2,
    status: "available",
    assignedWaiter: "محمد علي",
  },
  {
    id: "3",
    number: 3,
    section: "قاعة رئيسية",
    capacity: 6,
    status: "reserved",
    currentOrder: {
      orderNumber: "RES-2025-005",
      guestName: "فاطمة حسن",
      guestCount: 5,
      startTime: "2025-10-28T13:00:00",
      duration: 0,
      total: 0,
      itemsCount: 0,
    },
    assignedWaiter: "سارة أحمد",
  },
  {
    id: "4",
    number: 4,
    section: "قاعة VIP",
    capacity: 8,
    status: "occupied",
    currentOrder: {
      orderNumber: "DIN-2025-002",
      guestName: "خالد عبدالله",
      guestCount: 6,
      startTime: "2025-10-28T11:00:00",
      duration: 75,
      total: 680,
      itemsCount: 12,
    },
    assignedWaiter: "أحمد خالد",
  },
  {
    id: "5",
    number: 5,
    section: "شرفة",
    capacity: 4,
    status: "cleaning",
  },
  {
    id: "6",
    number: 6,
    section: "شرفة",
    capacity: 2,
    status: "available",
    assignedWaiter: "سارة أحمد",
  },
  {
    id: "7",
    number: 7,
    section: "قاعة رئيسية",
    capacity: 4,
    status: "occupied",
    currentOrder: {
      orderNumber: "DIN-2025-003",
      guestName: "نور الدين",
      guestCount: 2,
      startTime: "2025-10-28T11:30:00",
      duration: 30,
      total: 180,
      itemsCount: 4,
    },
    assignedWaiter: "محمد علي",
  },
  {
    id: "8",
    number: 8,
    section: "قاعة VIP",
    capacity: 10,
    status: "available",
    assignedWaiter: "أحمد خالد",
  },
];

const orders: Order[] = [
  {
    id: "1",
    orderNumber: "DIN-2025-001",
    tableNumber: 1,
    guestName: "أحمد محمد",
    guestCount: 3,
    status: "served",
    itemsCount: 5,
    total: 250,
    startTime: "2025-10-28T10:30:00",
    assignedWaiter: "محمد علي",
  },
  {
    id: "2",
    orderNumber: "DIN-2025-002",
    tableNumber: 4,
    guestName: "خالد عبدالله",
    guestCount: 6,
    status: "preparing",
    itemsCount: 12,
    total: 680,
    startTime: "2025-10-28T11:00:00",
    assignedWaiter: "أحمد خالد",
  },
  {
    id: "3",
    orderNumber: "DIN-2025-003",
    tableNumber: 7,
    guestName: "نور الدين",
    guestCount: 2,
    status: "ready",
    itemsCount: 4,
    total: 180,
    startTime: "2025-10-28T11:30:00",
    assignedWaiter: "محمد علي",
  },
];

const waiters: Waiter[] = [
  {
    id: "1",
    name: "محمد علي",
    tablesAssigned: 4,
    activeOrders: 2,
    totalSales: 1250,
    status: "active",
  },
  {
    id: "2",
    name: "سارة أحمد",
    tablesAssigned: 3,
    activeOrders: 1,
    totalSales: 850,
    status: "active",
  },
  {
    id: "3",
    name: "أحمد خالد",
    tablesAssigned: 2,
    activeOrders: 1,
    totalSales: 680,
    status: "active",
  },
  {
    id: "4",
    name: "فاطمة حسن",
    tablesAssigned: 0,
    activeOrders: 0,
    totalSales: 0,
    status: "break",
  },
];

export default function DineIn() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState<"tables" | "orders" | "waiters">("tables");
  
  // Dialog states
  const [isNewTableDialogOpen, setIsNewTableDialogOpen] = useState(false);
  const [isKitchenOrderDialogOpen, setIsKitchenOrderDialogOpen] = useState(false);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [isViewTableDialogOpen, setIsViewTableDialogOpen] = useState(false);
  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false);
  const [isViewWaiterDialogOpen, setIsViewWaiterDialogOpen] = useState(false);
  const [isMergeTablesDialogOpen, setIsMergeTablesDialogOpen] = useState(false);
  const [isSplitBillDialogOpen, setIsSplitBillDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedWaiter, setSelectedWaiter] = useState<Waiter | null>(null);
  
  // Form states
  const [newTableNumber, setNewTableNumber] = useState("");
  const [newTableSection, setNewTableSection] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState("");
  const [reservationName, setReservationName] = useState("");
  const [reservationPhone, setReservationPhone] = useState("");
  const [reservationGuestCount, setReservationGuestCount] = useState("");
  const [reservationTableId, setReservationTableId] = useState("");
  
  // Handlers
  const handleViewTable = (table: Table) => {
    setSelectedTable(table);
    setIsViewTableDialogOpen(true);
  };
  
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOrderDialogOpen(true);
  };
  
  const handleViewWaiter = (waiter: Waiter) => {
    setSelectedWaiter(waiter);
    setIsViewWaiterDialogOpen(true);
  };
  
  const handlePayTable = (table: Table) => {
    if (table.currentOrder) {
      alert(`إتمام الدفع للطاولة ${table.number}\nرقم الطلب: ${table.currentOrder.orderNumber}\nالإجمالي: ${table.currentOrder.total} ج.م`);
      // TODO: Navigate to payment page or open payment dialog
    }
  };
  
  const handleNewOrder = (table: Table) => {
    alert(`بدء طلب جديد للطاولة ${table.number}`);
    // TODO: Navigate to POS or open order dialog
  };
  
  const handleCreateTable = () => {
    if (!newTableNumber || !newTableSection || !newTableCapacity) {
      alert('يرجى ملء جميع الحقول');
      return;
    }
    alert(`تم إنشاء طاولة ${newTableNumber} في ${newTableSection} بسعة ${newTableCapacity} أشخاص`);
    setIsNewTableDialogOpen(false);
    setNewTableNumber("");
    setNewTableSection("");
    setNewTableCapacity("");
  };
  
  const handleCreateReservation = () => {
    if (!reservationName || !reservationPhone || !reservationGuestCount || !reservationTableId) {
      alert('يرجى ملء جميع الحقول');
      return;
    }
    const table = tables.find(t => t.id === reservationTableId);
    alert(`تم حجز الطاولة ${table?.number} باسم ${reservationName}\nعدد الأشخاص: ${reservationGuestCount}`);
    setIsReservationDialogOpen(false);
    setReservationName("");
    setReservationPhone("");
    setReservationGuestCount("");
    setReservationTableId("");
  };

  // Calculate summary stats
  const totalTables = tables.length;
  const occupiedTables = tables.filter(t => t.status === "occupied").length;
  const availableTables = tables.filter(t => t.status === "available").length;
  const totalRevenue = tables.reduce((sum, t) => sum + (t.currentOrder?.total || 0), 0);
  const activeOrders = orders.filter(o => o.status !== "completed").length;

  // Filter tables
  const filteredTables = tables.filter(table => {
    const matchesSearch = table.number.toString().includes(searchQuery) ||
                         table.currentOrder?.guestName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = selectedSection === "all" || table.section === selectedSection;
    const matchesStatus = selectedStatus === "all" || table.status === selectedStatus;
    
    return matchesSearch && matchesSection && matchesStatus;
  });

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.tableNumber.toString().includes(searchQuery);
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getTableStatusBadge = (status: string) => {
    const statusConfig = {
      "available": { 
        label: "متاحة", 
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        icon: CheckCircle2 
      },
      "occupied": { 
        label: "مشغولة", 
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        icon: Users 
      },
      "reserved": { 
        label: "محجوزة", 
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        icon: Clock 
      },
      "cleaning": { 
        label: "تنظيف", 
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        icon: Sparkles 
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

  const getOrderStatusBadge = (status: string) => {
    const statusConfig = {
      "pending": { label: "معلق", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" },
      "preparing": { label: "قيد التحضير", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" },
      "ready": { label: "جاهز", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
      "served": { label: "تم التقديم", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
      "completed": { label: "مكتمل", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getWaiterStatusBadge = (status: string) => {
    const statusConfig = {
      "active": { label: "نشط", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
      "break": { label: "استراحة", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" },
      "offline": { label: "غير متصل", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const sections = Array.from(new Set(tables.map(t => t.section)));

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} ساعة ${mins} دقيقة`;
    }
    return `${mins} دقيقة`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-slate-100 dark:from-slate-950 dark:via-rose-950/10 dark:to-slate-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl shadow-lg">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-l from-rose-600 to-slate-900 dark:from-rose-400 dark:to-slate-100 bg-clip-text text-transparent">
                إدارة قاعة الطعام
              </h1>
              <p className="text-muted-foreground mt-1">
                إدارة طاولات الطعام وإنشاء أوامر المطبخ وتنسيق الموظفين. التعامل مع عمليات الطاولة بما فيها الدمج والفصل.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
              onClick={() => setIsNewTableDialogOpen(true)}
            >
              <Plus className="w-4 h-4 ml-2" />
              طاولة جديدة
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={() => setIsKitchenOrderDialogOpen(true)}
            >
              <ChefHat className="w-4 h-4 ml-2" />
              أمر مطبخ
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              onClick={() => setIsReservationDialogOpen(true)}
            >
              <Users className="w-4 h-4 ml-2" />
              حجز طاولة
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsMergeTablesDialogOpen(true)}
            >
              <Merge className="w-4 h-4 ml-2" />
              دمج طاولات
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsSplitBillDialogOpen(true)}
            >
              <Scissors className="w-4 h-4 ml-2" />
              فصل فاتورة
            </Button>
            <Link to="/reports">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 ml-2" />
                تقارير
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="border-2 hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl text-white shadow-lg">
                  <Utensils className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">إجمالي الطاولات</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-rose-600 to-slate-900 dark:from-rose-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalTables}
              </div>
              <p className="text-xs text-muted-foreground mt-2">طاولة</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl text-white shadow-lg">
                  <Users className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">مشغولة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-rose-600 to-slate-900 dark:from-rose-400 dark:to-slate-100 bg-clip-text text-transparent">
                {occupiedTables}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
                {((occupiedTables / totalTables) * 100).toFixed(0)}% إشغال
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">متاحة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-rose-600 to-slate-900 dark:from-rose-400 dark:to-slate-100 bg-clip-text text-transparent">
                {availableTables}
              </div>
              <p className="text-xs text-muted-foreground mt-2">جاهزة للضيوف</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                  <Receipt className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">طلبات نشطة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-rose-600 to-slate-900 dark:from-rose-400 dark:to-slate-100 bg-clip-text text-transparent">
                {activeOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-2">قيد المعالجة</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white shadow-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">إيرادات نشطة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-rose-600 to-slate-900 dark:from-rose-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalRevenue}
              </div>
              <p className="text-xs text-muted-foreground mt-2">جنيه مصري</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "tables" ? "default" : "outline"}
            onClick={() => setActiveTab("tables")}
            className={activeTab === "tables" ? "bg-gradient-to-r from-rose-600 to-pink-600" : ""}
          >
            <Utensils className="w-4 h-4 ml-2" />
            الطاولات
          </Button>
          <Button
            variant={activeTab === "orders" ? "default" : "outline"}
            onClick={() => setActiveTab("orders")}
            className={activeTab === "orders" ? "bg-gradient-to-r from-rose-600 to-pink-600" : ""}
          >
            <ChefHat className="w-4 h-4 ml-2" />
            الطلبات
          </Button>
          <Button
            variant={activeTab === "waiters" ? "default" : "outline"}
            onClick={() => setActiveTab("waiters")}
            className={activeTab === "waiters" ? "bg-gradient-to-r from-rose-600 to-pink-600" : ""}
          >
            <User className="w-4 h-4 ml-2" />
            الموظفون
          </Button>
        </div>

        {/* Tables Tab */}
        {activeTab === "tables" && (
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
                      placeholder="ابحث عن طاولة أو نزيل..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>

                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger>
                      <SelectValue placeholder="القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأقسام</SelectItem>
                      {sections.map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
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
                      <SelectItem value="available">متاحة</SelectItem>
                      <SelectItem value="occupied">مشغولة</SelectItem>
                      <SelectItem value="reserved">محجوزة</SelectItem>
                      <SelectItem value="cleaning">تنظيف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTables.map((table) => (
                <Card 
                  key={table.id} 
                  className={`border-2 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur ${
                    table.status === "occupied" ? "border-red-400 dark:border-red-600" :
                    table.status === "reserved" ? "border-blue-400 dark:border-blue-600" :
                    table.status === "available" ? "border-green-400 dark:border-green-600" :
                    "border-yellow-400 dark:border-yellow-600"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg text-white">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">طاولة {table.number}</CardTitle>
                          <CardDescription className="text-xs">
                            <MapPin className="w-3 h-3 inline ml-1" />
                            {table.section}
                          </CardDescription>
                        </div>
                      </div>
                      {getTableStatusBadge(table.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">السعة</span>
                        <Badge variant="outline">
                          <Users className="w-3 h-3 ml-1" />
                          {table.capacity} أشخاص
                        </Badge>
                      </div>

                      {table.assignedWaiter && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">النادل</span>
                          <span className="font-medium">{table.assignedWaiter}</span>
                        </div>
                      )}

                      {table.currentOrder && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border-t">
                          <p className="text-xs text-muted-foreground mb-2">معلومات الطلب</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold">{table.currentOrder.guestName}</span>
                              <Badge variant="outline" className="text-xs">
                                <Users className="w-3 h-3 ml-1" />
                                {table.currentOrder.guestCount}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                <Clock className="w-3 h-3 inline ml-1" />
                                {formatDuration(table.currentOrder.duration)}
                              </span>
                              <span className="font-semibold text-rose-600 dark:text-rose-400">
                                {table.currentOrder.total} ج.م
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {table.currentOrder.itemsCount} صنف • {table.currentOrder.orderNumber}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewTable(table)}
                        >
                          <Eye className="w-3 h-3 ml-1" />
                          عرض
                        </Button>
                        {table.status === "occupied" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-900/20"
                            onClick={() => handlePayTable(table)}
                          >
                            <Receipt className="w-3 h-3 ml-1" />
                            دفع
                          </Button>
                        )}
                        {table.status === "available" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20"
                            onClick={() => handleNewOrder(table)}
                          >
                            <Plus className="w-3 h-3 ml-1" />
                            طلب
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="ابحث عن طلب..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="pending">معلق</SelectItem>
                      <SelectItem value="preparing">قيد التحضير</SelectItem>
                      <SelectItem value="ready">جاهز</SelectItem>
                      <SelectItem value="served">تم التقديم</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="border-2 hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          طاولة {order.tableNumber} • {order.assignedWaiter}
                        </CardDescription>
                      </div>
                      {getOrderStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="font-semibold mb-1">{order.guestName}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            <Users className="w-3 h-3 inline ml-1" />
                            {order.guestCount} أشخاص
                          </span>
                          <span>
                            <Hash className="w-3 h-3 inline ml-1" />
                            {order.itemsCount} صنف
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-muted-foreground">الإجمالي</span>
                        <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                          {order.total} ج.م
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 inline ml-1" />
                        {new Date(order.startTime).toLocaleString('ar-EG', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="w-3 h-3 ml-1" />
                          عرض
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => alert(`تعديل الطلب ${order.orderNumber}`)}
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

        {/* Waiters Tab */}
        {activeTab === "waiters" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {waiters.map((waiter) => (
              <Card key={waiter.id} className="border-2 hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg text-white">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{waiter.name}</CardTitle>
                      </div>
                    </div>
                    {getWaiterStatusBadge(waiter.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">الطاولات</p>
                        <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                          {waiter.tablesAssigned}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">طلبات نشطة</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {waiter.activeOrders}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">إجمالي المبيعات</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {waiter.totalSales} ج.م
                      </p>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewWaiter(waiter)}
                      >
                        <Eye className="w-3 h-3 ml-1" />
                        عرض
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => alert(`تعيين طاولات للنادل ${waiter.name}`)}
                      >
                        <Edit className="w-3 h-3 ml-1" />
                        تعيين
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* New Table Dialog */}
      <Dialog open={isNewTableDialogOpen} onOpenChange={setIsNewTableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              إضافة طاولة جديدة
            </DialogTitle>
            <DialogDescription>
              أدخل معلومات الطاولة الجديدة
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="table-number">رقم الطاولة</Label>
              <Input
                id="table-number"
                type="number"
                placeholder="1"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="table-section">القسم</Label>
              <Input
                id="table-section"
                placeholder="قاعة رئيسية"
                value={newTableSection}
                onChange={(e) => setNewTableSection(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="table-capacity">السعة (عدد الأشخاص)</Label>
              <Input
                id="table-capacity"
                type="number"
                placeholder="4"
                value={newTableCapacity}
                onChange={(e) => setNewTableCapacity(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTableDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-rose-600 to-pink-600"
              onClick={handleCreateTable}
            >
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Kitchen Order Dialog */}
      <Dialog open={isKitchenOrderDialogOpen} onOpenChange={setIsKitchenOrderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              إنشاء أمر مطبخ
            </DialogTitle>
            <DialogDescription>
              اختر الطاولة والأصناف لإرسالها للمطبخ
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm">
              💡 سيتم توجيهك إلى صفحة إنشاء الطلب حيث يمكنك اختيار الأصناف من القائمة
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsKitchenOrderDialogOpen(false)}>
              إلغاء
            </Button>
            <Link to="/pos">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                الانتقال لنقاط البيع
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reservation Dialog */}
      <Dialog open={isReservationDialogOpen} onOpenChange={setIsReservationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              حجز طاولة
            </DialogTitle>
            <DialogDescription>
              أدخل معلومات الحجز
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reservation-name">اسم العميل</Label>
              <Input
                id="reservation-name"
                placeholder="أحمد محمد"
                value={reservationName}
                onChange={(e) => setReservationName(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="reservation-phone">رقم الهاتف</Label>
              <Input
                id="reservation-phone"
                placeholder="01XXXXXXXXX"
                value={reservationPhone}
                onChange={(e) => setReservationPhone(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="reservation-guests">عدد الأشخاص</Label>
              <Input
                id="reservation-guests"
                type="number"
                placeholder="4"
                value={reservationGuestCount}
                onChange={(e) => setReservationGuestCount(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="reservation-table">الطاولة</Label>
              <select
                id="reservation-table"
                aria-label="اختر الطاولة"
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={reservationTableId}
                onChange={(e) => setReservationTableId(e.target.value)}
              >
                <option value="">اختر طاولة</option>
                {tables.filter(t => t.status === "available").map(table => (
                  <option key={table.id} value={table.id}>
                    طاولة {table.number} - {table.section} (سعة {table.capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReservationDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-cyan-600"
              onClick={handleCreateReservation}
            >
              تأكيد الحجز
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Table Dialog */}
      <Dialog open={isViewTableDialogOpen} onOpenChange={setIsViewTableDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              تفاصيل الطاولة
            </DialogTitle>
          </DialogHeader>
          
          {selectedTable && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">رقم الطاولة</Label>
                  <p className="text-2xl font-bold">طاولة {selectedTable.number}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الحالة</Label>
                  <div className="mt-1">{getTableStatusBadge(selectedTable.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">القسم</Label>
                  <p className="text-lg">{selectedTable.section}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">السعة</Label>
                  <p className="text-lg">{selectedTable.capacity} أشخاص</p>
                </div>
                {selectedTable.assignedWaiter && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">النادل المسؤول</Label>
                    <p className="text-lg font-semibold">{selectedTable.assignedWaiter}</p>
                  </div>
                )}
              </div>
              
              {selectedTable.currentOrder && (
                <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-lg border-2 border-rose-200 dark:border-rose-800">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    معلومات الطلب الحالي
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-muted-foreground text-xs">رقم الطلب</Label>
                      <p className="font-mono">{selectedTable.currentOrder.orderNumber}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">اسم الضيف</Label>
                      <p className="font-semibold">{selectedTable.currentOrder.guestName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">عدد الضيوف</Label>
                      <p>{selectedTable.currentOrder.guestCount} أشخاص</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">عدد الأصناف</Label>
                      <p>{selectedTable.currentOrder.itemsCount} صنف</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">المدة</Label>
                      <p>{formatDuration(selectedTable.currentOrder.duration)}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">الإجمالي</Label>
                      <p className="text-xl font-bold text-rose-600">{selectedTable.currentOrder.total} ج.م</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewTableDialogOpen(false)}>
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
              <ChefHat className="w-5 h-5" />
              تفاصيل الطلب
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">رقم الطلب</Label>
                  <p className="text-lg font-mono">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الحالة</Label>
                  <div className="mt-1">{getOrderStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">الطاولة</Label>
                  <p className="text-lg font-bold">طاولة {selectedOrder.tableNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">النادل</Label>
                  <p className="text-lg">{selectedOrder.assignedWaiter}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">اسم الضيف</Label>
                  <p className="text-lg font-semibold">{selectedOrder.guestName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">عدد الضيوف</Label>
                  <p className="text-lg">{selectedOrder.guestCount} أشخاص</p>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-muted-foreground text-xs">عدد الأصناف</Label>
                    <p className="text-2xl font-bold">{selectedOrder.itemsCount}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">الإجمالي</Label>
                    <p className="text-3xl font-bold text-green-600">{selectedOrder.total} ج.م</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground text-xs">وقت البدء</Label>
                    <p>{new Date(selectedOrder.startTime).toLocaleString('ar-EG')}</p>
                  </div>
                </div>
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
      
      {/* View Waiter Dialog */}
      <Dialog open={isViewWaiterDialogOpen} onOpenChange={setIsViewWaiterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              تفاصيل الموظف
            </DialogTitle>
          </DialogHeader>
          
          {selectedWaiter && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedWaiter.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold">{selectedWaiter.name}</h3>
                <div className="mt-2">{getWaiterStatusBadge(selectedWaiter.status)}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">الطاولات</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedWaiter.tablesAssigned}</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">طلبات نشطة</p>
                  <p className="text-2xl font-bold text-yellow-600">{selectedWaiter.activeOrders}</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">المبيعات</p>
                  <p className="text-xl font-bold text-green-600">{selectedWaiter.totalSales} ج.م</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewWaiterDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Merge Tables Dialog */}
      <Dialog open={isMergeTablesDialogOpen} onOpenChange={setIsMergeTablesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Merge className="w-5 h-5" />
              دمج طاولات
            </DialogTitle>
            <DialogDescription>
              اختر طاولتين أو أكثر لدمجهم في فاتورة واحدة
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm">
              💡 هذه الميزة تسمح لك بدمج عدة طاولات في فاتورة واحدة للمجموعات الكبيرة
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMergeTablesDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-rose-600 to-pink-600"
              onClick={() => {
                alert('سيتم إضافة وظيفة دمج الطاولات قريباً');
                setIsMergeTablesDialogOpen(false);
              }}
            >
              دمج
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Split Bill Dialog */}
      <Dialog open={isSplitBillDialogOpen} onOpenChange={setIsSplitBillDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scissors className="w-5 h-5" />
              فصل فاتورة
            </DialogTitle>
            <DialogDescription>
              قسّم الفاتورة بين عدة أشخاص أو حسب الأصناف
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm">
              💡 يمكنك تقسيم الفاتورة بالتساوي بين الأشخاص أو تخصيص كل صنف لشخص معين
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSplitBillDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-rose-600 to-pink-600"
              onClick={() => {
                alert('سيتم إضافة وظيفة فصل الفاتورة قريباً');
                setIsSplitBillDialogOpen(false);
              }}
            >
              فصل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
