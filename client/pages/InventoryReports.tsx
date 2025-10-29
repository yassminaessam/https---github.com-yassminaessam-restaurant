import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import {
  Warehouse,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  BarChart3,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function InventoryReports() {
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [stockLevel, setStockLevel] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);

  // Mock data
  useEffect(() => {
    setStockLevel([
      {
        sku: "RICE-001",
        name: "أرز بسمتي (Basmati Rice)",
        warehouse: "المخزن الرئيسي",
        onHand: 150,
        unit: "kg",
        value: 4500,
        status: "ok",
      },
      {
        sku: "CHICKEN-001",
        name: "دجاج طازج (Fresh Chicken)",
        warehouse: "المخزن الرئيسي",
        onHand: 80,
        unit: "kg",
        value: 6400,
        status: "ok",
      },
      {
        sku: "COLA-001",
        name: "كوكاكولا (Coca Cola)",
        warehouse: "مخزن الكافتيريا",
        onHand: 45,
        unit: "bottle",
        value: 675,
        status: "low",
      },
      {
        sku: "WATER-001",
        name: "ماء معدني (Mineral Water)",
        warehouse: "مخزن الكافتيريا",
        onHand: 120,
        unit: "bottle",
        value: 1200,
        status: "ok",
      },
      {
        sku: "CHIPS-001",
        name: "شيبس (Potato Chips)",
        warehouse: "مخزن الكافتيريا",
        onHand: 15,
        unit: "pack",
        value: 300,
        status: "critical",
      },
    ]);

    setMovements([
      {
        id: "1",
        date: "2025-10-27",
        item: "أرز بسمتي",
        type: "in",
        qty: 50,
        warehouse: "المخزن الرئيسي",
        reference: "GRN-001",
      },
      {
        id: "2",
        date: "2025-10-27",
        item: "كوكاكولا",
        type: "out",
        qty: -12,
        warehouse: "مخزن الكافتيريا",
        reference: "SALE-001",
      },
      {
        id: "3",
        date: "2025-10-27",
        item: "ماء معدني",
        type: "transfer",
        qty: 30,
        warehouse: "مخزن الكافتيريا",
        reference: "TR-001",
      },
    ]);
  }, []);

  const totalValue = stockLevel.reduce((sum, item) => sum + item.value, 0);
  const lowStockItems = stockLevel.filter((item) => item.status === "low" || item.status === "critical").length;
  const criticalItems = stockLevel.filter((item) => item.status === "critical").length;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">تقارير المخزون والحركات</h1>
        </div>
        <p className="text-muted-foreground">
          عرض مستويات المخزون وحركات الأصناف والتنبيهات
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              قيمة المخزون الإجمالية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue.toFixed(2)} ج.م</div>
            <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +5.2% عن الشهر الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              عدد الأصناف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockLevel.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              في جميع المخازن
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              أصناف منخفضة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowStockItems}</div>
            <div className="text-xs text-muted-foreground mt-1">
              تحتاج إعادة طلب
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              تنبيهات حرجة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
            <div className="text-xs text-muted-foreground mt-1">
              طلب عاجل
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>الفلاتر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">المخزن</label>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المخازن</SelectItem>
                  <SelectItem value="MAIN">المخزن الرئيسي</SelectItem>
                  <SelectItem value="RESTAURANT">مخزن المطعم</SelectItem>
                  <SelectItem value="CAFETERIA">مخزن الكافتيريا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <FileText className="w-4 h-4 ml-2" />
                تصدير التقرير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Levels Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>مستويات المخزون الحالية</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">SKU</TableHead>
                <TableHead className="text-right">اسم الصنف</TableHead>
                <TableHead className="text-right">المخزن</TableHead>
                <TableHead className="text-right">الكمية المتاحة</TableHead>
                <TableHead className="text-right">الوحدة</TableHead>
                <TableHead className="text-right">القيمة</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockLevel.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.warehouse}</TableCell>
                  <TableCell className="font-semibold">{item.onHand}</TableCell>
                  <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                  <TableCell>{item.value.toFixed(2)} ج.م</TableCell>
                  <TableCell>
                    {item.status === "ok" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        طبيعي
                      </Badge>
                    )}
                    {item.status === "low" && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">
                        <AlertTriangle className="w-3 h-3 ml-1" />
                        منخفض
                      </Badge>
                    )}
                    {item.status === "critical" && (
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        <AlertTriangle className="w-3 h-3 ml-1" />
                        حرج
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Movements */}
      <Card>
        <CardHeader>
          <CardTitle>آخر الحركات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الصنف</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">المخزن</TableHead>
                <TableHead className="text-right">المرجع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.date}</TableCell>
                  <TableCell className="font-medium">{movement.item}</TableCell>
                  <TableCell>
                    {movement.type === "in" && (
                      <Badge variant="outline" className="bg-green-50">
                        <TrendingUp className="w-3 h-3 ml-1" />
                        دخول
                      </Badge>
                    )}
                    {movement.type === "out" && (
                      <Badge variant="outline" className="bg-red-50">
                        <TrendingDown className="w-3 h-3 ml-1" />
                        خروج
                      </Badge>
                    )}
                    {movement.type === "transfer" && (
                      <Badge variant="outline" className="bg-blue-50">
                        <Package className="w-3 h-3 ml-1" />
                        تحويل
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell
                    className={`font-semibold ${
                      movement.qty > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {movement.qty > 0 ? "+" : ""}
                    {movement.qty}
                  </TableCell>
                  <TableCell>{movement.warehouse}</TableCell>
                  <TableCell className="font-mono text-sm">{movement.reference}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
