import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Plus, Trash2, BarChart3, Zap, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface DbStats {
  warehouses: number;
  items: number;
  batches: number;
  suppliers: number;
  users: number;
  purchaseOrders: number;
  recipes: number;
  tableAreas: number;
  tables: number;
  drivers: number;
  deliveryAreas: number;
  hotelRooms: number;
  posOrders: number;
  settings: number;
  stockMovements: number;
}

interface TestResult {
  name: string;
  duration: string;
}

export default function DatabaseTest() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DbStats | null>(null);
  const [performanceTests, setPerformanceTests] = useState<TestResult[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [allData, setAllData] = useState<any>(null);

  // جلب الإحصائيات
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/db-test/stats');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.stats);
        setMessage({ type: 'success', text: `تم جلب الإحصائيات في ${result.duration}` });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // إضافة بيانات تجريبية
  const seedData = async () => {
    if (!confirm('هل تريد إضافة البيانات التجريبية؟')) return;
    
    try {
      setLoading(true);
      setMessage(null);
      const response = await fetch('/api/db-test/seed', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: `${result.message} - الوقت المستغرق: ${result.duration}` });
        await fetchStats();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // حذف جميع البيانات
  const clearData = async () => {
    if (!confirm('⚠️ تحذير: سيتم حذف جميع البيانات من قاعدة البيانات! هل أنت متأكد؟')) return;
    
    try {
      setLoading(true);
      setMessage(null);
      const response = await fetch('/api/db-test/clear', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: `${result.message} - الوقت المستغرق: ${result.duration}` });
        setStats(null);
        setAllData(null);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // اختبار الأداء
  const runPerformanceTest = async () => {
    try {
      setLoading(true);
      setMessage(null);
      const response = await fetch('/api/db-test/performance');
      const result = await response.json();
      
      if (result.success) {
        setPerformanceTests(result.tests);
        setMessage({ type: 'success', text: `اكتمل الاختبار - إجمالي الوقت: ${result.totalDuration}` });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // جلب جميع البيانات
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/db-test/data');
      const result = await response.json();
      
      if (result.success) {
        setAllData(result.data);
        setMessage({ type: 'success', text: 'تم جلب البيانات بنجاح' });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <Database className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">اختبار قاعدة البيانات</h1>
          <p className="text-muted-foreground">إضافة بيانات تجريبية واختبار الأداء</p>
        </div>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <AlertTitle>{message.type === 'success' ? 'نجح' : 'خطأ'}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>عمليات قاعدة البيانات</CardTitle>
            <CardDescription>إضافة أو حذف البيانات التجريبية</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3 flex-wrap">
            <Button onClick={seedData} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              إضافة بيانات تجريبية
            </Button>
            <Button onClick={clearData} disabled={loading} variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              حذف جميع البيانات
            </Button>
            <Button onClick={fetchStats} disabled={loading} variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              تحديث الإحصائيات
            </Button>
            <Button onClick={runPerformanceTest} disabled={loading} variant="outline" className="gap-2">
              <Zap className="h-4 w-4" />
              اختبار الأداء
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
          <TabsTrigger value="performance">اختبار الأداء</TabsTrigger>
          <TabsTrigger value="data">عرض البيانات</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-6">
          {stats ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              <StatCard title="المستودعات" value={stats.warehouses} icon="📦" />
              <StatCard title="الأصناف" value={stats.items} icon="🏷️" />
              <StatCard title="دفعات المخزون" value={stats.batches} icon="📊" />
              <StatCard title="الموردين" value={stats.suppliers} icon="🏢" />
              <StatCard title="المستخدمين" value={stats.users} icon="👥" />
              <StatCard title="أوامر الشراء" value={stats.purchaseOrders} icon="🛒" />
              <StatCard title="الوصفات" value={stats.recipes} icon="📝" />
              <StatCard title="مناطق الطاولات" value={stats.tableAreas} icon="🏛️" />
              <StatCard title="الطاولات" value={stats.tables} icon="🪑" />
              <StatCard title="السائقين" value={stats.drivers} icon="🚗" />
              <StatCard title="مناطق التوصيل" value={stats.deliveryAreas} icon="📍" />
              <StatCard title="الغرف الفندقية" value={stats.hotelRooms} icon="🛏️" />
              <StatCard title="أوامر البيع" value={stats.posOrders} icon="💰" />
              <StatCard title="الإعدادات" value={stats.settings} icon="⚙️" />
              <StatCard title="حركات المخزون" value={stats.stockMovements} icon="📈" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Database className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">اضغط على "تحديث الإحصائيات" لعرض البيانات</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          {performanceTests.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>نتائج اختبار الأداء</CardTitle>
                <CardDescription>الوقت المستغرق لكل استعلام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceTests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{test.name}</span>
                      <Badge variant="secondary">{test.duration}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Zap className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">اضغط على "اختبار الأداء" لبدء الاختبار</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <div className="space-y-4">
            <Button onClick={fetchAllData} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
              جلب البيانات
            </Button>

            {allData && (
              <div className="space-y-4">
                <DataSection title="الأصناف" data={allData.items} />
                <DataSection title="المستودعات" data={allData.warehouses} />
                <DataSection title="الموردين" data={allData.suppliers} />
                <DataSection title="أوامر البيع" data={allData.posOrders} />
                <DataSection title="دفعات المخزون" data={allData.stockBatches} />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString('ar-EG')}</div>
      </CardContent>
    </Card>
  );
}

function DataSection({ title, data }: { title: string; data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>عدد السجلات: {data.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
          <pre className="text-xs" dir="ltr">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
