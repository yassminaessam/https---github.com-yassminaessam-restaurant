import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  FileText,
  PackageCheck,
  Users,
  Search,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Eye,
  Edit,
  Download,
  Upload,
  RefreshCw,
  Package,
  ArrowUpRight,
  Truck,
  ClipboardList,
  BarChart3,
} from "lucide-react";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  status: "draft" | "submitted" | "posted" | "cancelled";
  poDate: string;
  expectedDate: string;
  totalAmount: number;
  itemsCount: number;
  createdBy: string;
}

interface Supplier {
  id: string;
  code: string;
  name: string;
  contact: string;
  totalOrders: number;
  totalAmount: number;
  rating: number;
}

// Sample data
const samplePOs: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "PO-2025-001",
    supplier: "السوق المحلي",
    status: "posted",
    poDate: "2025-10-20",
    expectedDate: "2025-10-25",
    totalAmount: 15000,
    itemsCount: 12,
    createdBy: "أحمد محمد",
  },
  {
    id: "2",
    poNumber: "PO-2025-002",
    supplier: "مورد اللحوم الطازجة",
    status: "submitted",
    poDate: "2025-10-25",
    expectedDate: "2025-10-28",
    totalAmount: 8500,
    itemsCount: 5,
    createdBy: "فاطمة علي",
  },
  {
    id: "3",
    poNumber: "PO-2025-003",
    supplier: "شركة المشروبات الوطنية",
    status: "draft",
    poDate: "2025-10-28",
    expectedDate: "2025-11-01",
    totalAmount: 12000,
    itemsCount: 20,
    createdBy: "محمود حسن",
  },
  {
    id: "4",
    poNumber: "PO-2025-004",
    supplier: "السوق المحلي",
    status: "cancelled",
    poDate: "2025-10-15",
    expectedDate: "2025-10-20",
    totalAmount: 5000,
    itemsCount: 8,
    createdBy: "سارة خالد",
  },
];

const sampleSuppliers: Supplier[] = [
  {
    id: "1",
    code: "SUP-001",
    name: "السوق المحلي",
    contact: "01012345678",
    totalOrders: 45,
    totalAmount: 450000,
    rating: 4.5,
  },
  {
    id: "2",
    code: "SUP-002",
    name: "مورد اللحوم الطازجة",
    contact: "01098765432",
    totalOrders: 30,
    totalAmount: 380000,
    rating: 4.8,
  },
  {
    id: "3",
    code: "SUP-003",
    name: "شركة المشروبات الوطنية",
    contact: "01055555555",
    totalOrders: 25,
    totalAmount: 290000,
    rating: 4.2,
  },
];

const statuses = [
  { value: "all", label: "جميع الحالات", icon: Filter },
  { value: "draft", label: "مسودة", icon: FileText },
  { value: "submitted", label: "مُقدم", icon: Clock },
  { value: "posted", label: "مُعتمد", icon: CheckCircle2 },
  { value: "cancelled", label: "ملغي", icon: XCircle },
];

export default function Purchasing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [activeTab, setActiveTab] = useState<"orders" | "suppliers">("orders");
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch purchase orders and suppliers from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch purchase orders
        const ordersResponse = await fetch('/api/purchasing/orders');
        const ordersData = await ordersResponse.json();
        
        // Map API data to component format
        const mappedOrders: PurchaseOrder[] = ordersData.map((order: any) => ({
          id: order.id,
          poNumber: order.orderNumber || `PO-${order.id.slice(0, 8)}`,
          supplier: order.supplier?.name || 'غير محدد',
          status: order.status.toLowerCase(),
          poDate: new Date(order.createdAt).toISOString().split('T')[0],
          expectedDate: order.expectedDeliveryDate 
            ? new Date(order.expectedDeliveryDate).toISOString().split('T')[0]
            : new Date(order.createdAt).toISOString().split('T')[0],
          totalAmount: order.totalAmount || 0,
          itemsCount: order.lines?.length || 0,
          createdBy: 'المستخدم'
        }));
        setPurchaseOrders(mappedOrders);

        // Fetch suppliers
        const suppliersResponse = await fetch('/api/purchasing/suppliers');
        const suppliersData = await suppliersResponse.json();
        
        const mappedSuppliers: Supplier[] = suppliersData.map((supplier: any) => ({
          id: supplier.id,
          code: supplier.code || supplier.id.slice(0, 8),
          name: supplier.name,
          contact: supplier.phone || supplier.email || 'غير محدد',
          totalOrders: 0, // Will be calculated from orders
          totalAmount: 0, // Will be calculated from orders
          rating: 5
        }));
        setSuppliers(mappedSuppliers);
        
      } catch (error) {
        console.error('Error fetching purchasing data:', error);
        // Keep using sample data on error
        setPurchaseOrders(samplePOs);
        setSuppliers(sampleSuppliers);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate summary stats
  const totalOrders = purchaseOrders.length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
  const pendingOrders = purchaseOrders.filter(po => po.status === "submitted").length;
  const draftOrders = purchaseOrders.filter(po => po.status === "draft").length;

  // Filter purchase orders
  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         po.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || po.status === selectedStatus;
    const matchesSupplier = selectedSupplier === "all" || po.supplier === selectedSupplier;
    
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "draft": { 
        label: "مسودة", 
        className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
        icon: FileText 
      },
      "submitted": { 
        label: "مُقدم", 
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        icon: Clock 
      },
      "posted": { 
        label: "مُعتمد", 
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100 dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-l from-purple-600 to-slate-900 dark:from-purple-400 dark:to-slate-100 bg-clip-text text-transparent">
                الشراء والتوريد
              </h1>
              <p className="text-muted-foreground mt-1">
                إدارة أوامر الشراء والعلاقات مع الموردين. التحكم في المشتريات لجميع مواقع المستودع وتتبع أداء الموردين
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <Plus className="w-4 h-4 ml-2" />
              أمر شراء جديد
            </Button>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Users className="w-4 h-4 ml-2" />
              إضافة مورد
            </Button>
            <Link to="/grn">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <PackageCheck className="w-4 h-4 ml-2" />
                استلام بضاعة
              </Button>
            </Link>
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 ml-2" />
              تقارير المشتريات
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white shadow-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">إجمالي الأوامر</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-purple-600 to-slate-900 dark:from-purple-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-2">أمر شراء نشط</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">القيمة الإجمالية</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-purple-600 to-slate-900 dark:from-purple-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalValue.toLocaleString('ar-EG')}
              </div>
              <p className="text-xs text-muted-foreground mt-2">جنيه مصري</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">قيد الانتظار</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-purple-600 to-slate-900 dark:from-purple-400 dark:to-slate-100 bg-clip-text text-transparent">
                {pendingOrders}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
                يحتاج مراجعة
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl text-white shadow-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">مسودات</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-purple-600 to-slate-900 dark:from-purple-400 dark:to-slate-100 bg-clip-text text-transparent">
                {draftOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-2">قيد الإعداد</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "orders" ? "default" : "outline"}
            onClick={() => setActiveTab("orders")}
            className={activeTab === "orders" ? "bg-gradient-to-r from-purple-600 to-indigo-600" : ""}
          >
            <ClipboardList className="w-4 h-4 ml-2" />
            أوامر الشراء
          </Button>
          <Button
            variant={activeTab === "suppliers" ? "default" : "outline"}
            onClick={() => setActiveTab("suppliers")}
            className={activeTab === "suppliers" ? "bg-gradient-to-r from-purple-600 to-indigo-600" : ""}
          >
            <Truck className="w-4 h-4 ml-2" />
            الموردون
          </Button>
        </div>

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
                      placeholder="ابحث عن رقم أمر أو مورد..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="حالة الأمر" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => {
                        const Icon = status.icon;
                        return (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {status.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger>
                      <SelectValue placeholder="المورد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الموردين</SelectItem>
                      {sampleSuppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.name}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Orders Table */}
            <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    أوامر الشراء
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {filteredPOs.length} من {totalOrders} أمر
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">رقم الأمر</TableHead>
                        <TableHead className="text-right">المورد</TableHead>
                        <TableHead className="text-right">تاريخ الأمر</TableHead>
                        <TableHead className="text-right">التاريخ المتوقع</TableHead>
                        <TableHead className="text-right">عدد الأصناف</TableHead>
                        <TableHead className="text-right">القيمة الإجمالية</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">أنشأ بواسطة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPOs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <FileText className="w-12 h-12 opacity-20" />
                              <p>لا توجد أوامر شراء تطابق معايير البحث</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPOs.map((po) => (
                          <TableRow key={po.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-950/20">
                            <TableCell className="font-mono text-sm font-semibold">
                              {po.poNumber}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-muted-foreground" />
                                {po.supplier}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(po.poDate).toLocaleDateString('ar-EG')}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(po.expectedDate).toLocaleDateString('ar-EG')}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{po.itemsCount} صنف</Badge>
                            </TableCell>
                            <TableCell className="font-semibold">
                              {po.totalAmount.toLocaleString('ar-EG')} ج.م
                            </TableCell>
                            <TableCell>{getStatusBadge(po.status)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {po.createdBy}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "suppliers" && (
          <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  إدارة الموردين
                </CardTitle>
                <Badge variant="outline">
                  {sampleSuppliers.length} مورد
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleSuppliers.map((supplier) => (
                  <Card key={supplier.id} className="border-2 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
                          <Truck className="w-5 h-5" />
                        </div>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                          ⭐ {supplier.rating}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-3">{supplier.name}</CardTitle>
                      <CardDescription className="font-mono text-xs">
                        {supplier.code}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono">{supplier.contact}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground">إجمالي الأوامر</p>
                            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                              {supplier.totalOrders}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">إجمالي القيمة</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                              {(supplier.totalAmount / 1000).toFixed(0)}K
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-3">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-3 h-3 ml-1" />
                            عرض
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="w-3 h-3 ml-1" />
                            تعديل
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Missing import
import { Phone } from "lucide-react";
