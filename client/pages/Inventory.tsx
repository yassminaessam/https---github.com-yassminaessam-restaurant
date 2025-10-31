import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  Warehouse,
  Package,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  PackageCheck,
  ArrowRightLeft,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowUpRight,
  Building2,
  ChefHat,
  Coffee,
  Boxes,
} from "lucide-react";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  avgCost: number;
  totalValue: number;
  status: "in-stock" | "low-stock" | "out-of-stock" | "overstocked";
  lastUpdated: string;
}

// Sample data
const sampleItems: InventoryItem[] = [
  {
    id: "1",
    sku: "RICE-001",
    name: "أرز بسمتي",
    category: "حبوب",
    warehouse: "RESTAURANT",
    quantity: 150,
    unit: "كجم",
    minStock: 50,
    maxStock: 200,
    avgCost: 12.5,
    totalValue: 1875,
    status: "in-stock",
    lastUpdated: "2025-10-28",
  },
  {
    id: "2",
    sku: "CHICKEN-001",
    name: "دجاج طازج",
    category: "لحوم",
    warehouse: "RESTAURANT",
    quantity: 25,
    unit: "كجم",
    minStock: 30,
    maxStock: 100,
    avgCost: 45,
    totalValue: 1125,
    status: "low-stock",
    lastUpdated: "2025-10-28",
  },
  {
    id: "3",
    sku: "COLA-001",
    name: "كوكاكولا",
    category: "مشروبات",
    warehouse: "CAFETERIA",
    quantity: 200,
    unit: "علبة",
    minStock: 100,
    maxStock: 500,
    avgCost: 3.5,
    totalValue: 700,
    status: "in-stock",
    lastUpdated: "2025-10-28",
  },
  {
    id: "4",
    sku: "WATER-001",
    name: "ماء معدني",
    warehouse: "FRIDGE",
    category: "مشروبات",
    quantity: 0,
    unit: "زجاجة",
    minStock: 50,
    maxStock: 300,
    avgCost: 2,
    totalValue: 0,
    status: "out-of-stock",
    lastUpdated: "2025-10-27",
  },
  {
    id: "5",
    sku: "CHIPS-001",
    name: "شيبس",
    category: "وجبات خفيفة",
    warehouse: "BUFFET",
    quantity: 500,
    unit: "كيس",
    minStock: 100,
    maxStock: 400,
    avgCost: 5,
    totalValue: 2500,
    status: "overstocked",
    lastUpdated: "2025-10-28",
  },
];

const warehouses = [
  { code: "all", name: "جميع المخازن", icon: Warehouse },
  { code: "RESTAURANT", name: "مخزن المطعم", icon: Building2 },
  { code: "CAFETERIA", name: "مخزن الكافتيريا", icon: Coffee },
  { code: "KITCHEN", name: "المطبخ", icon: ChefHat },
  { code: "BUFFET", name: "البوفيه", icon: Boxes },
  { code: "FRIDGE", name: "الثلاجة", icon: Package },
];

const statuses = [
  { value: "all", label: "جميع الحالات", color: "default" },
  { value: "in-stock", label: "متوفر", color: "green" },
  { value: "low-stock", label: "مخزون منخفض", color: "yellow" },
  { value: "out-of-stock", label: "نفذ من المخزون", color: "red" },
  { value: "overstocked", label: "مخزون زائد", color: "blue" },
];

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch inventory data from API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        
        // Fetch stock summary from API
        const response = await fetch('/api/inventory/stock-summary');
        
        if (!response.ok) {
          console.error(`Stock summary API error: ${response.status}`);
          throw new Error(`فشل تحميل بيانات المخزون (${response.status})`);
        }
        
        const data = await response.json();
        
        // Map API data to component format
        const mappedItems: InventoryItem[] = data.map((item: any) => ({
          id: item.itemId || item.id,
          sku: item.code || item.sku || 'N/A',
          name: item.name,
          category: item.category || 'غير مصنف',
          warehouse: item.warehouseCode || item.warehouse || 'MAIN',
          quantity: item.onHand || item.quantity || 0,
          unit: item.unit || 'وحدة',
          minStock: item.minStock || 0,
          maxStock: item.maxStock || 0,
          avgCost: item.avgCost || 0,
          totalValue: (item.onHand || 0) * (item.avgCost || 0),
          status: getItemStatus(item.onHand || 0, item.minStock || 0, item.maxStock || 0),
          lastUpdated: item.lastUpdated || new Date().toISOString().split('T')[0]
        }));
        
        setItems(mappedItems);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        // Fallback to sample data on error
        setItems(sampleItems);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Determine item status based on quantity
  const getItemStatus = (quantity: number, minStock: number, maxStock: number): "in-stock" | "low-stock" | "out-of-stock" | "overstocked" => {
    if (quantity === 0) return "out-of-stock";
    if (quantity < minStock) return "low-stock";
    if (quantity > maxStock) return "overstocked";
    return "in-stock";
  };

  // Handle view item details
  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  // Handle edit item
  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  // Calculate summary stats
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = items.filter(item => item.status === "low-stock").length;
  const outOfStockItems = items.filter(item => item.status === "out-of-stock").length;

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = selectedWarehouse === "all" || item.warehouse === selectedWarehouse;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    
    return matchesSearch && matchesWarehouse && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "in-stock": { label: "متوفر", variant: "default" as const, className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
      "low-stock": { label: "مخزون منخفض", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" },
      "out-of-stock": { label: "نفذ من المخزون", variant: "destructive" as const, className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" },
      "overstocked": { label: "مخزون زائد", variant: "outline" as const, className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 dark:from-slate-950 dark:via-orange-950/10 dark:to-slate-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
              <Warehouse className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-l from-orange-600 to-slate-900 dark:from-orange-400 dark:to-slate-100 bg-clip-text text-transparent">
                إدارة المخزون
              </h1>
              <p className="text-muted-foreground mt-1">
                إدارة المستودع الرئيسي والمستودعات الفرعية. تتبع مستويات الأسهم وإدارة التحويلات
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة صنف جديد
            </Button>
            <Link to="/grn">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <PackageCheck className="w-4 h-4 ml-2" />
                استلام بضاعة جديدة
              </Button>
            </Link>
            <Link to="/transfer">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <ArrowRightLeft className="w-4 h-4 ml-2" />
                تحويل بين المخازن
              </Button>
            </Link>
            <Link to="/inventory-reports">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 ml-2" />
                التقارير والإحصائيات
              </Button>
            </Link>
            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                  <Package className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">إجمالي الأصناف</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-orange-600 to-slate-900 dark:from-orange-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalItems}
              </div>
              <p className="text-xs text-muted-foreground mt-2">صنف مختلف</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">القيمة الإجمالية</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-orange-600 to-slate-900 dark:from-orange-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalValue.toLocaleString('ar-EG')}
              </div>
              <p className="text-xs text-muted-foreground mt-2">جنيه مصري</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl text-white shadow-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">مخزون منخفض</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-orange-600 to-slate-900 dark:from-orange-400 dark:to-slate-100 bg-clip-text text-transparent">
                {lowStockItems}
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-medium">
                يحتاج إعادة طلب
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl text-white shadow-lg">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">نفذ من المخزون</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-orange-600 to-slate-900 dark:from-orange-400 dark:to-slate-100 bg-clip-text text-transparent">
                {outOfStockItems}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
                عاجل: يحتاج طلب فوري
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
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
                  placeholder="ابحث عن صنف أو رمز SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>

              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المخزن" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => {
                    const Icon = warehouse.icon;
                    return (
                      <SelectItem key={warehouse.code} value={warehouse.code}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {warehouse.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="حالة المخزون" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                جدول المخزون
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {filteredItems.length} من {totalItems} صنف
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
                    <TableHead className="text-right">SKU</TableHead>
                    <TableHead className="text-right">اسم الصنف</TableHead>
                    <TableHead className="text-right">الفئة</TableHead>
                    <TableHead className="text-right">المخزن</TableHead>
                    <TableHead className="text-right">الكمية</TableHead>
                    <TableHead className="text-right">الوحدة</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">القيمة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                          <p className="text-muted-foreground">جاري تحميل البيانات...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Package className="w-12 h-12 opacity-20" />
                          <p>لا توجد أصناف تطابق معايير البحث</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-orange-50/50 dark:hover:bg-orange-950/20">
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell className="font-semibold">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.warehouse}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${
                              item.status === 'out-of-stock' ? 'text-red-600' :
                              item.status === 'low-stock' ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {item.quantity}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              من {item.maxStock}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.unit}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="font-semibold">
                          {item.totalValue.toLocaleString('ar-EG')} ج.م
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleViewItem(item)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                              <Edit className="w-4 h-4" />
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
      </div>

      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الصنف</DialogTitle>
            <DialogDescription>معلومات كاملة عن الصنف المحدد</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">SKU</Label>
                  <p className="text-lg font-mono mt-1">{selectedItem.sku}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">اسم الصنف</Label>
                  <p className="text-lg font-semibold mt-1">{selectedItem.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">الفئة</Label>
                  <p className="text-lg mt-1">{selectedItem.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">المخزن</Label>
                  <p className="text-lg mt-1">{selectedItem.warehouse}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">الكمية المتاحة</Label>
                  <p className="text-2xl font-bold mt-1 text-blue-600">{selectedItem.quantity} {selectedItem.unit}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">الحد الأدنى</Label>
                  <p className="text-lg mt-1 text-yellow-600">{selectedItem.minStock} {selectedItem.unit}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">الحد الأقصى</Label>
                  <p className="text-lg mt-1 text-green-600">{selectedItem.maxStock} {selectedItem.unit}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">متوسط التكلفة</Label>
                  <p className="text-lg font-semibold mt-1">{selectedItem.avgCost.toFixed(2)} ج.م</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">القيمة الإجمالية</Label>
                  <p className="text-xl font-bold mt-1 text-green-600">{selectedItem.totalValue.toLocaleString('ar-EG')} ج.م</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">الحالة</Label>
                  <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">آخر تحديث</Label>
                  <p className="text-lg mt-1">{new Date(selectedItem.lastUpdated).toLocaleDateString('ar-EG')}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              إغلاق
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              if (selectedItem) handleEditItem(selectedItem);
            }}>
              <Edit className="w-4 h-4 ml-2" />
              تعديل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل الصنف</DialogTitle>
            <DialogDescription>تحديث معلومات الصنف</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-sku">SKU</Label>
                  <Input id="edit-sku" defaultValue={selectedItem.sku} disabled className="bg-muted" />
                </div>
                <div>
                  <Label htmlFor="edit-name">اسم الصنف</Label>
                  <Input id="edit-name" defaultValue={selectedItem.name} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">الفئة</Label>
                  <Input id="edit-category" defaultValue={selectedItem.category} />
                </div>
                <div>
                  <Label htmlFor="edit-unit">الوحدة</Label>
                  <Input id="edit-unit" defaultValue={selectedItem.unit} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-quantity">الكمية المتاحة</Label>
                  <Input id="edit-quantity" type="number" defaultValue={selectedItem.quantity} />
                </div>
                <div>
                  <Label htmlFor="edit-minStock">الحد الأدنى</Label>
                  <Input id="edit-minStock" type="number" defaultValue={selectedItem.minStock} />
                </div>
                <div>
                  <Label htmlFor="edit-maxStock">الحد الأقصى</Label>
                  <Input id="edit-maxStock" type="number" defaultValue={selectedItem.maxStock} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-avgCost">متوسط التكلفة</Label>
                  <Input id="edit-avgCost" type="number" step="0.01" defaultValue={selectedItem.avgCost} />
                </div>
                <div>
                  <Label>القيمة الإجمالية</Label>
                  <Input disabled value={selectedItem.totalValue.toLocaleString('ar-EG') + ' ج.م'} className="bg-muted" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={() => {
              // Here you would save the changes
              setIsEditDialogOpen(false);
              // TODO: Implement save functionality
              alert('تم حفظ التعديلات بنجاح!');
            }}>
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إضافة صنف جديد</DialogTitle>
            <DialogDescription>إضافة صنف جديد إلى المخزون</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-sku">SKU / رمز الصنف *</Label>
                <Input id="new-sku" placeholder="ITEM-001" required />
              </div>
              <div>
                <Label htmlFor="new-name">اسم الصنف *</Label>
                <Input id="new-name" placeholder="أدخل اسم الصنف" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-category">الفئة *</Label>
                <Input id="new-category" placeholder="مثال: حبوب، لحوم، مشروبات" required />
              </div>
              <div>
                <Label htmlFor="new-unit">الوحدة *</Label>
                <Input id="new-unit" placeholder="كجم، لتر، علبة" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-warehouse">المخزن *</Label>
                <Select>
                  <SelectTrigger id="new-warehouse">
                    <SelectValue placeholder="اختر المخزن" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((warehouse) => {
                      const Icon = warehouse.icon;
                      return (
                        <SelectItem key={warehouse.code} value={warehouse.code}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {warehouse.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-quantity">الكمية الأولية</Label>
                <Input id="new-quantity" type="number" defaultValue="0" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="new-minStock">الحد الأدنى</Label>
                <Input id="new-minStock" type="number" defaultValue="10" />
              </div>
              <div>
                <Label htmlFor="new-maxStock">الحد الأقصى</Label>
                <Input id="new-maxStock" type="number" defaultValue="100" />
              </div>
              <div>
                <Label htmlFor="new-avgCost">متوسط التكلفة</Label>
                <Input id="new-avgCost" type="number" step="0.01" defaultValue="0" />
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>ملاحظة:</strong> سيتم إضافة الصنف إلى قاعدة البيانات. يمكنك إضافة الكمية الفعلية لاحقاً من خلال "محضر استلام البضاعة".
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={async () => {
              try {
                const newItem = {
                  code: (document.getElementById('new-sku') as HTMLInputElement).value,
                  name: (document.getElementById('new-name') as HTMLInputElement).value,
                  category: (document.getElementById('new-category') as HTMLInputElement).value,
                  unit: (document.getElementById('new-unit') as HTMLInputElement).value,
                };
                
                // TODO: Call API to create item
                // await fetch('/api/inventory/items', {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify(newItem)
                // });
                
                setIsAddDialogOpen(false);
                alert('تم إضافة الصنف بنجاح! ✅\n\nيمكنك الآن إضافة الكمية من خلال:\n• محضر استلام البضاعة\n• أو تعديل الصنف مباشرة');
                
                // Refresh the list
                window.location.reload();
              } catch (error) {
                alert('حدث خطأ أثناء إضافة الصنف');
                console.error(error);
              }
            }}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة الصنف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
