import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  PackageCheck,
  ArrowRightLeft,
  ShoppingCart,
  ClipboardList,
  Plus,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StockRecords() {
  const [grns, setGrns] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    setGrns([
      {
        id: "1",
        grnNumber: "GRN-001",
        date: "2025-10-27",
        warehouse: "المخزن الرئيسي",
        supplier: "شركة التوريد الأولى",
        status: "posted",
        items: 5,
      },
      {
        id: "2",
        grnNumber: "GRN-002",
        date: "2025-10-26",
        warehouse: "المخزن الرئيسي",
        supplier: "المورد الثاني",
        status: "posted",
        items: 3,
      },
    ]);

    setTransfers([
      {
        id: "1",
        transferNumber: "TR-001",
        date: "2025-10-27",
        from: "المخزن الرئيسي",
        to: "مخزن المطعم",
        status: "closed",
        items: 4,
      },
    ]);

    setSales([
      {
        id: "1",
        orderNumber: "ORD-001",
        date: "2025-10-27",
        location: "البوفيه",
        customer: "عميل 1",
        total: 150.0,
        status: "paid",
      },
      {
        id: "2",
        orderNumber: "ORD-002",
        date: "2025-10-27",
        location: "غرفة 101",
        customer: "غرفة 101",
        total: 85.5,
        status: "paid",
      },
    ]);
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">سجلات حركات المخزون</h1>
        </div>
        <p className="text-muted-foreground">
          عرض جميع محاضر الاستلام، التحويلات، والمبيعات
        </p>
      </div>

      <Tabs defaultValue="grns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grns" className="gap-2">
            <PackageCheck className="w-4 h-4" />
            محاضر الاستلام
          </TabsTrigger>
          <TabsTrigger value="transfers" className="gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            التحويلات
          </TabsTrigger>
          <TabsTrigger value="sales" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            المبيعات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grns">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>محاضر استلام البضاعة</CardTitle>
                <Link to="/grn">
                  <Button>
                    <Plus className="w-4 h-4 ml-2" />
                    محضر جديد
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم المحضر</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">المخزن</TableHead>
                    <TableHead className="text-right">المورد</TableHead>
                    <TableHead className="text-right">عدد الأصناف</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        لا توجد محاضر استلام
                      </TableCell>
                    </TableRow>
                  ) : (
                    grns.map((grn) => (
                      <TableRow key={grn.id}>
                        <TableCell className="font-medium">{grn.grnNumber}</TableCell>
                        <TableCell>{grn.date}</TableCell>
                        <TableCell>{grn.warehouse}</TableCell>
                        <TableCell>{grn.supplier}</TableCell>
                        <TableCell>{grn.items}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50">
                            {grn.status === "posted" ? "مرحّل" : grn.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>التحويلات بين المخازن</CardTitle>
                <Link to="/transfer">
                  <Button>
                    <Plus className="w-4 h-4 ml-2" />
                    تحويل جديد
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم التحويل</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">من</TableHead>
                    <TableHead className="text-right">إلى</TableHead>
                    <TableHead className="text-right">عدد الأصناف</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        لا توجد تحويلات
                      </TableCell>
                    </TableRow>
                  ) : (
                    transfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-medium">
                          {transfer.transferNumber}
                        </TableCell>
                        <TableCell>{transfer.date}</TableCell>
                        <TableCell>{transfer.from}</TableCell>
                        <TableCell>{transfer.to}</TableCell>
                        <TableCell>{transfer.items}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50">
                            {transfer.status === "closed" ? "مغلق" : transfer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>المبيعات</CardTitle>
                <Link to="/pos-sale">
                  <Button>
                    <Plus className="w-4 h-4 ml-2" />
                    بيع جديد
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الطلب</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الموقع</TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right">الإجمالي</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        لا توجد مبيعات
                      </TableCell>
                    </TableRow>
                  ) : (
                    sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.orderNumber}</TableCell>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>{sale.location}</TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell className="font-semibold">
                          {sale.total.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50">
                            {sale.status === "paid" ? "مدفوع" : sale.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
