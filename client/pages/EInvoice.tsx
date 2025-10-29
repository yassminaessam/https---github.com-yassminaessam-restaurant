import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Receipt,
  FileText,
  QrCode,
  Shield,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Send,
  RefreshCw,
  BarChart3,
  FileCheck,
  AlertTriangle,
  Calendar,
  DollarSign,
  Hash,
  Building,
  User,
  FileSignature,
  Server,
  PlayCircle,
  Lock,
  Unlock,
  CheckSquare,
  Zap,
} from "lucide-react";

interface EInvoice {
  id: string;
  invoiceNumber: string;
  internalDocumentId: string;
  customerName: string;
  customerTaxId: string;
  issueDate: string;
  total: number;
  taxAmount: number;
  status: "draft" | "signed" | "submitted" | "approved" | "rejected" | "cancelled";
  submissionId?: string;
  uuid?: string;
  qrCode?: string;
  environment: "sandbox" | "production";
  documentType: "invoice" | "credit_note" | "debit_note";
}

interface TaxSubmission {
  id: string;
  submissionId: string;
  submissionDate: string;
  invoiceCount: number;
  totalAmount: number;
  totalTax: number;
  status: "pending" | "processing" | "accepted" | "rejected";
  responseDate?: string;
  errorMessage?: string;
}

interface ComplianceMetric {
  id: string;
  metric: string;
  value: string;
  status: "good" | "warning" | "error";
  description: string;
}

// Sample data
const invoices: EInvoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    internalDocumentId: "DOC-001",
    customerName: "شركة النور للتجارة",
    customerTaxId: "123-456-789",
    issueDate: "2025-10-28T10:00:00",
    total: 11400,
    taxAmount: 1400,
    status: "approved",
    submissionId: "SUB-001",
    uuid: "550e8400-e29b-41d4-a716-446655440000",
    qrCode: "QR123456789",
    environment: "production",
    documentType: "invoice",
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-002",
    internalDocumentId: "DOC-002",
    customerName: "مطعم السلام",
    customerTaxId: "987-654-321",
    issueDate: "2025-10-28T11:30:00",
    total: 5700,
    taxAmount: 700,
    status: "submitted",
    submissionId: "SUB-002",
    uuid: "550e8400-e29b-41d4-a716-446655440001",
    qrCode: "QR987654321",
    environment: "production",
    documentType: "invoice",
  },
  {
    id: "3",
    invoiceNumber: "INV-2025-003",
    internalDocumentId: "DOC-003",
    customerName: "فندق الهرم الذهبي",
    customerTaxId: "456-789-123",
    issueDate: "2025-10-28T12:00:00",
    total: 22800,
    taxAmount: 2800,
    status: "signed",
    uuid: "550e8400-e29b-41d4-a716-446655440002",
    qrCode: "QR456789123",
    environment: "production",
    documentType: "invoice",
  },
  {
    id: "4",
    invoiceNumber: "INV-2025-004",
    internalDocumentId: "DOC-004",
    customerName: "كافيه المدينة",
    customerTaxId: "789-123-456",
    issueDate: "2025-10-28T13:00:00",
    total: 3420,
    taxAmount: 420,
    status: "draft",
    environment: "sandbox",
    documentType: "invoice",
  },
  {
    id: "5",
    invoiceNumber: "CN-2025-001",
    internalDocumentId: "DOC-005",
    customerName: "شركة النور للتجارة",
    customerTaxId: "123-456-789",
    issueDate: "2025-10-28T14:00:00",
    total: -1140,
    taxAmount: -140,
    status: "approved",
    submissionId: "SUB-003",
    uuid: "550e8400-e29b-41d4-a716-446655440003",
    qrCode: "QR123456780",
    environment: "production",
    documentType: "credit_note",
  },
];

const submissions: TaxSubmission[] = [
  {
    id: "1",
    submissionId: "SUB-001",
    submissionDate: "2025-10-28T10:05:00",
    invoiceCount: 1,
    totalAmount: 11400,
    totalTax: 1400,
    status: "accepted",
    responseDate: "2025-10-28T10:10:00",
  },
  {
    id: "2",
    submissionId: "SUB-002",
    submissionDate: "2025-10-28T11:35:00",
    invoiceCount: 1,
    totalAmount: 5700,
    totalTax: 700,
    status: "processing",
  },
  {
    id: "3",
    submissionId: "SUB-003",
    submissionDate: "2025-10-28T14:05:00",
    invoiceCount: 1,
    totalAmount: -1140,
    totalTax: -140,
    status: "accepted",
    responseDate: "2025-10-28T14:10:00",
  },
];

const complianceMetrics: ComplianceMetric[] = [
  {
    id: "1",
    metric: "نسبة نجاح التقديم",
    value: "98.5%",
    status: "good",
    description: "معدل قبول الفواتير من قبل مصلحة الضرائب",
  },
  {
    id: "2",
    metric: "متوسط وقت الاستجابة",
    value: "4.2 دقيقة",
    status: "good",
    description: "متوسط الوقت من التقديم حتى الموافقة",
  },
  {
    id: "3",
    metric: "الفواتير المعلقة",
    value: "1",
    status: "warning",
    description: "عدد الفواتير في انتظار الرد",
  },
  {
    id: "4",
    metric: "صحة الشهادات",
    value: "صالحة",
    status: "good",
    description: "حالة شهادات التوقيع الرقمي",
  },
];

export default function EInvoice() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedEnvironment, setSelectedEnvironment] = useState("all");
  const [activeTab, setActiveTab] = useState<"invoices" | "submissions" | "compliance">("invoices");

  // Calculate summary stats
  const totalInvoices = invoices.length;
  const signedInvoices = invoices.filter(i => i.status === "signed" || i.status === "submitted" || i.status === "approved").length;
  const approvedInvoices = invoices.filter(i => i.status === "approved").length;
  const totalRevenue = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalTax = invoices.reduce((sum, i) => sum + i.taxAmount, 0);

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.internalDocumentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || invoice.status === selectedStatus;
    const matchesEnvironment = selectedEnvironment === "all" || invoice.environment === selectedEnvironment;
    
    return matchesSearch && matchesStatus && matchesEnvironment;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "draft": { 
        label: "مسودة", 
        className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
        icon: FileText 
      },
      "signed": { 
        label: "موقعة", 
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        icon: FileSignature 
      },
      "submitted": { 
        label: "مقدمة", 
        className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
        icon: Send 
      },
      "approved": { 
        label: "معتمدة", 
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        icon: CheckCircle2 
      },
      "rejected": { 
        label: "مرفوضة", 
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        icon: XCircle 
      },
      "cancelled": { 
        label: "ملغاة", 
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
        icon: AlertCircle 
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

  const getSubmissionStatusBadge = (status: string) => {
    const statusConfig = {
      "pending": { label: "معلق", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" },
      "processing": { label: "قيد المعالجة", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
      "accepted": { label: "مقبول", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
      "rejected": { label: "مرفوض", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getEnvironmentBadge = (environment: string) => {
    return environment === "production" ? (
      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
        <Server className="w-3 h-3 ml-1" />
        إنتاج
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
        <PlayCircle className="w-3 h-3 ml-1" />
        تجريبي
      </Badge>
    );
  };

  const getDocumentTypeBadge = (type: string) => {
    const typeConfig = {
      "invoice": { label: "فاتورة", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
      "credit_note": { label: "إشعار دائن", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" },
      "debit_note": { label: "إشعار مدين", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" },
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getComplianceStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-EG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 dark:from-slate-950 dark:via-emerald-950/10 dark:to-slate-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
              <Receipt className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-l from-emerald-600 to-slate-900 dark:from-emerald-400 dark:to-slate-100 bg-clip-text text-transparent">
                نظام الفاتورة الإلكترونية
              </h1>
              <p className="text-muted-foreground mt-1">
                التوافقية مع الهيئة العامة للضرائب المصرية مع التوقيع الرقمي وأكواد QR وبيئات الرمل والإنتاج.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
              <Plus className="w-4 h-4 ml-2" />
              إنشاء فاتورة
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <FileSignature className="w-4 h-4 ml-2" />
              توقيع الفواتير
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
              <Send className="w-4 h-4 ml-2" />
              تقديم للضرائب
            </Button>
            <Button variant="outline">
              <QrCode className="w-4 h-4 ml-2" />
              إنشاء QR
            </Button>
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 ml-2" />
              تقرير التوافق
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="border-2 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">إجمالي الفواتير</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-emerald-600 to-slate-900 dark:from-emerald-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalInvoices}
              </div>
              <p className="text-xs text-muted-foreground mt-2">فاتورة</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                  <FileSignature className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">موقعة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-emerald-600 to-slate-900 dark:from-emerald-400 dark:to-slate-100 bg-clip-text text-transparent">
                {signedInvoices}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
                {((signedInvoices / totalInvoices) * 100).toFixed(0)}% من الإجمالي
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">معتمدة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-emerald-600 to-slate-900 dark:from-emerald-400 dark:to-slate-100 bg-clip-text text-transparent">
                {approvedInvoices}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                تم الاعتماد من الضرائب
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white shadow-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">إجمالي القيمة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-emerald-600 to-slate-900 dark:from-emerald-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalRevenue}
              </div>
              <p className="text-xs text-muted-foreground mt-2">جنيه مصري</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white shadow-lg">
                  <Receipt className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">إجمالي الضرائب</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-emerald-600 to-slate-900 dark:from-emerald-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalTax}
              </div>
              <p className="text-xs text-muted-foreground mt-2">جنيه مصري</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "invoices" ? "default" : "outline"}
            onClick={() => setActiveTab("invoices")}
            className={activeTab === "invoices" ? "bg-gradient-to-r from-emerald-600 to-green-600" : ""}
          >
            <FileText className="w-4 h-4 ml-2" />
            الفواتير
          </Button>
          <Button
            variant={activeTab === "submissions" ? "default" : "outline"}
            onClick={() => setActiveTab("submissions")}
            className={activeTab === "submissions" ? "bg-gradient-to-r from-emerald-600 to-green-600" : ""}
          >
            <Send className="w-4 h-4 ml-2" />
            التقديمات الضريبية
          </Button>
          <Button
            variant={activeTab === "compliance" ? "default" : "outline"}
            onClick={() => setActiveTab("compliance")}
            className={activeTab === "compliance" ? "bg-gradient-to-r from-emerald-600 to-green-600" : ""}
          >
            <Shield className="w-4 h-4 ml-2" />
            التوافق
          </Button>
        </div>

        {/* Invoices Tab */}
        {activeTab === "invoices" && (
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
                      placeholder="ابحث عن فاتورة..."
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
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="signed">موقعة</SelectItem>
                      <SelectItem value="submitted">مقدمة</SelectItem>
                      <SelectItem value="approved">معتمدة</SelectItem>
                      <SelectItem value="rejected">مرفوضة</SelectItem>
                      <SelectItem value="cancelled">ملغاة</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                    <SelectTrigger>
                      <SelectValue placeholder="البيئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع البيئات</SelectItem>
                      <SelectItem value="production">إنتاج</SelectItem>
                      <SelectItem value="sandbox">تجريبي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Invoices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className="border-2 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{invoice.invoiceNumber}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {invoice.internalDocumentId}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        {getStatusBadge(invoice.status)}
                        {getDocumentTypeBadge(invoice.documentType)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Customer Info */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="font-semibold mb-1">{invoice.customerName}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Hash className="w-3 h-3" />
                          الرقم الضريبي: {invoice.customerTaxId}
                        </div>
                      </div>

                      {/* Environment & Date */}
                      <div className="flex items-center justify-between text-xs">
                        {getEnvironmentBadge(invoice.environment)}
                        <span className="text-muted-foreground">
                          <Calendar className="w-3 h-3 inline ml-1" />
                          {new Date(invoice.issueDate).toLocaleDateString('ar-EG')}
                        </span>
                      </div>

                      {/* Tax Details */}
                      <div className="grid grid-cols-2 gap-2 text-sm p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">المبلغ</p>
                          <p className="font-semibold">{invoice.total - invoice.taxAmount} ج.م</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">الضريبة</p>
                          <p className="font-semibold">{invoice.taxAmount} ج.م</p>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-muted-foreground">الإجمالي</span>
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          {invoice.total} ج.م
                        </span>
                      </div>

                      {/* UUID & QR */}
                      {invoice.uuid && (
                        <div className="text-xs text-muted-foreground">
                          <p className="truncate">UUID: {invoice.uuid}</p>
                          {invoice.qrCode && (
                            <div className="flex items-center gap-1 mt-1">
                              <QrCode className="w-3 h-3" />
                              <span>QR: {invoice.qrCode}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Submission ID */}
                      {invoice.submissionId && (
                        <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20">
                          <Send className="w-3 h-3 ml-1" />
                          {invoice.submissionId}
                        </Badge>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-3">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 ml-1" />
                          عرض
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-3 h-3 ml-1" />
                          تحميل
                        </Button>
                        {invoice.status === "draft" && (
                          <Button variant="outline" size="sm" className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20">
                            <FileSignature className="w-3 h-3 ml-1" />
                            توقيع
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

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <Card key={submission.id} className="border-2 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{submission.submissionId}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        <Calendar className="w-3 h-3 inline ml-1" />
                        {formatDateTime(submission.submissionDate)}
                      </CardDescription>
                    </div>
                    {getSubmissionStatusBadge(submission.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <p className="text-xs text-muted-foreground">عدد الفواتير</p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {submission.invoiceCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">المبلغ الإجمالي</p>
                          <p className="text-xl font-bold">
                            {submission.totalAmount} ج.م
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-2 border-t">
                        <span className="text-muted-foreground">الضريبة</span>
                        <span className="font-semibold">{submission.totalTax} ج.م</span>
                      </div>
                    </div>

                    {submission.responseDate && (
                      <div className="text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 inline ml-1" />
                        الرد: {formatDateTime(submission.responseDate)}
                      </div>
                    )}

                    {submission.errorMessage && (
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-600 dark:text-red-400">
                        <AlertCircle className="w-3 h-3 inline ml-1" />
                        {submission.errorMessage}
                      </div>
                    )}

                    <div className="flex gap-2 pt-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 ml-1" />
                        عرض التفاصيل
                      </Button>
                      {submission.status === "processing" && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <RefreshCw className="w-3 h-3 ml-1" />
                          تحديث
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === "compliance" && (
          <div className="space-y-6">
            {/* Compliance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {complianceMetrics.map((metric) => (
                <Card key={metric.id} className="border-2 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{metric.metric}</CardTitle>
                      {getComplianceStatusIcon(metric.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-to-l from-emerald-600 to-slate-900 dark:from-emerald-400 dark:to-slate-100 bg-clip-text text-transparent mb-2">
                      {metric.value}
                    </div>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Status */}
            <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  حالة النظام
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-semibold">شهادة التوقيع الرقمي</p>
                        <p className="text-xs text-muted-foreground">صالحة حتى: 2026-12-31</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      نشطة
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-semibold">اتصال مصلحة الضرائب</p>
                        <p className="text-xs text-muted-foreground">آخر تحديث: منذ 2 دقيقة</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      متصل
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="font-semibold">معدل نجاح التقديم</p>
                        <p className="text-xs text-muted-foreground">آخر 30 يوم</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      98.5%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
