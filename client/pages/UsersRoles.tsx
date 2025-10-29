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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Users,
  Shield,
  UserPlus,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Settings,
  FileText,
  Activity,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Award,
  Ban,
  RefreshCw,
  Download,
  Upload,
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "suspended";
  lastLogin?: string;
  joinedDate: string;
  permissions: string[];
  assignedWarehouses: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
  level: "admin" | "manager" | "staff" | "custom";
  canManageUsers: boolean;
  canManageInventory: boolean;
  canViewReports: boolean;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  critical: boolean;
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  status: "success" | "failed";
}

// Sample data
const users: UserAccount[] = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@restaurant.com",
    phone: "01012345678",
    role: "مدير النظام",
    department: "الإدارة",
    status: "active",
    lastLogin: "2025-10-28T11:30:00",
    joinedDate: "2024-01-15",
    permissions: ["all"],
    assignedWarehouses: ["RESTAURANT", "KITCHEN", "CAFETERIA"],
  },
  {
    id: "2",
    name: "فاطمة حسن",
    email: "fatma@restaurant.com",
    phone: "01098765432",
    role: "مدير المخزون",
    department: "المخزون",
    status: "active",
    lastLogin: "2025-10-28T10:15:00",
    joinedDate: "2024-02-20",
    permissions: ["inventory.view", "inventory.edit", "purchasing.view"],
    assignedWarehouses: ["RESTAURANT", "KITCHEN"],
  },
  {
    id: "3",
    name: "محمد علي",
    email: "mohamed@restaurant.com",
    phone: "01156789012",
    role: "موظف مبيعات",
    department: "المبيعات",
    status: "active",
    lastLogin: "2025-10-28T12:00:00",
    joinedDate: "2024-03-10",
    permissions: ["pos.view", "pos.create", "orders.view"],
    assignedWarehouses: ["RESTAURANT"],
  },
  {
    id: "4",
    name: "سارة أحمد",
    email: "sara@restaurant.com",
    phone: "01223456789",
    role: "محاسب",
    department: "المالية",
    status: "active",
    lastLogin: "2025-10-28T09:45:00",
    joinedDate: "2024-04-05",
    permissions: ["reports.view", "invoices.view", "invoices.create"],
    assignedWarehouses: [],
  },
  {
    id: "5",
    name: "خالد عبدالله",
    email: "khaled@restaurant.com",
    phone: "01187654321",
    role: "موظف توصيل",
    department: "التوصيل",
    status: "inactive",
    lastLogin: "2025-10-25T18:00:00",
    joinedDate: "2024-05-12",
    permissions: ["delivery.view", "delivery.update"],
    assignedWarehouses: [],
  },
];

const roles: Role[] = [
  {
    id: "1",
    name: "مدير النظام",
    description: "صلاحيات كاملة لإدارة النظام",
    usersCount: 1,
    permissions: ["all"],
    level: "admin",
    canManageUsers: true,
    canManageInventory: true,
    canViewReports: true,
  },
  {
    id: "2",
    name: "مدير المخزون",
    description: "إدارة المخزون والمشتريات",
    usersCount: 1,
    permissions: ["inventory.*", "purchasing.*", "reports.inventory"],
    level: "manager",
    canManageUsers: false,
    canManageInventory: true,
    canViewReports: true,
  },
  {
    id: "3",
    name: "موظف مبيعات",
    description: "إدارة نقاط البيع والطلبات",
    usersCount: 1,
    permissions: ["pos.*", "orders.view", "orders.create"],
    level: "staff",
    canManageUsers: false,
    canManageInventory: false,
    canViewReports: false,
  },
  {
    id: "4",
    name: "محاسب",
    description: "إدارة الفواتير والتقارير المالية",
    usersCount: 1,
    permissions: ["invoices.*", "reports.financial", "reports.view"],
    level: "staff",
    canManageUsers: false,
    canManageInventory: false,
    canViewReports: true,
  },
  {
    id: "5",
    name: "موظف توصيل",
    description: "إدارة طلبات التوصيل",
    usersCount: 1,
    permissions: ["delivery.view", "delivery.update"],
    level: "staff",
    canManageUsers: false,
    canManageInventory: false,
    canViewReports: false,
  },
];

const permissionCategories = [
  {
    name: "المخزون",
    permissions: [
      { id: "inventory.view", name: "عرض المخزون", critical: false },
      { id: "inventory.edit", name: "تعديل المخزون", critical: true },
      { id: "inventory.delete", name: "حذف من المخزون", critical: true },
    ],
  },
  {
    name: "نقاط البيع",
    permissions: [
      { id: "pos.view", name: "عرض نقاط البيع", critical: false },
      { id: "pos.create", name: "إنشاء طلبات", critical: false },
      { id: "pos.refund", name: "استرجاع المبالغ", critical: true },
    ],
  },
  {
    name: "المستخدمون",
    permissions: [
      { id: "users.view", name: "عرض المستخدمين", critical: false },
      { id: "users.create", name: "إضافة مستخدمين", critical: true },
      { id: "users.delete", name: "حذف مستخدمين", critical: true },
    ],
  },
];

const auditLogs: AuditLog[] = [
  {
    id: "1",
    userId: "1",
    userName: "أحمد محمد",
    action: "تسجيل دخول",
    resource: "النظام",
    timestamp: "2025-10-28T11:30:00",
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: "2",
    userId: "2",
    userName: "فاطمة حسن",
    action: "تعديل مخزون",
    resource: "RICE",
    timestamp: "2025-10-28T10:15:00",
    ipAddress: "192.168.1.101",
    status: "success",
  },
  {
    id: "3",
    userId: "3",
    userName: "محمد علي",
    action: "إنشاء طلب",
    resource: "POS-2025-001",
    timestamp: "2025-10-28T12:00:00",
    ipAddress: "192.168.1.102",
    status: "success",
  },
  {
    id: "4",
    userId: "5",
    userName: "خالد عبدالله",
    action: "محاولة تسجيل دخول",
    resource: "النظام",
    timestamp: "2025-10-28T08:00:00",
    ipAddress: "192.168.1.105",
    status: "failed",
  },
];

export default function UsersRoles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "permissions" | "audit">("users");
  
  // Dialog states
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false);
  const [isManagePermissionsDialogOpen, setIsManagePermissionsDialogOpen] = useState(false);
  const [isViewUserDialogOpen, setIsViewUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isViewRoleDialogOpen, setIsViewRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  
  // Selected items
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [selectedRoleItem, setSelectedRoleItem] = useState<Role | null>(null);
  
  // Form states
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    password: ""
  });
  
  const [newRoleForm, setNewRoleForm] = useState({
    name: "",
    description: "",
    level: "staff" as "admin" | "manager" | "staff" | "custom"
  });
  
  // Handler functions
  const handleAddUser = async () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.role) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    try {
      // TODO: Call API to create user
      alert(`✅ تم إضافة المستخدم: ${newUserForm.name}`);
      setIsAddUserDialogOpen(false);
      setNewUserForm({ name: "", email: "", phone: "", role: "", department: "", password: "" });
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إضافة المستخدم');
    }
  };
  
  const handleCreateRole = async () => {
    if (!newRoleForm.name || !newRoleForm.description) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    try {
      // TODO: Call API to create role
      alert(`✅ تم إنشاء الدور: ${newRoleForm.name}`);
      setIsCreateRoleDialogOpen(false);
      setNewRoleForm({ name: "", description: "", level: "staff" });
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إنشاء الدور');
    }
  };
  
  const handleViewUser = (user: UserAccount) => {
    setSelectedUser(user);
    setIsViewUserDialogOpen(true);
  };
  
  const handleEditUser = (user: UserAccount) => {
    setSelectedUser(user);
    setNewUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      password: ""
    });
    setIsEditUserDialogOpen(true);
  };
  
  const handleSaveEditUser = async () => {
    if (!selectedUser) return;
    try {
      // TODO: Call API to update user
      alert(`✅ تم تحديث بيانات المستخدم: ${newUserForm.name}`);
      setIsEditUserDialogOpen(false);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء تحديث المستخدم');
    }
  };
  
  const handleDeleteUser = (user: UserAccount) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };
  
  const handleConfirmDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      // TODO: Call API to delete user
      alert(`✅ تم حذف المستخدم: ${selectedUser.name}`);
      setIsDeleteUserDialogOpen(false);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء حذف المستخدم');
    }
  };
  
  const handleViewRole = (role: Role) => {
    setSelectedRoleItem(role);
    setIsViewRoleDialogOpen(true);
  };
  
  const handleEditRole = (role: Role) => {
    setSelectedRoleItem(role);
    setNewRoleForm({
      name: role.name,
      description: role.description,
      level: role.level
    });
    setIsEditRoleDialogOpen(true);
  };
  
  const handleSaveEditRole = async () => {
    if (!selectedRoleItem) return;
    try {
      // TODO: Call API to update role
      alert(`✅ تم تحديث الدور: ${newRoleForm.name}`);
      setIsEditRoleDialogOpen(false);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء تحديث الدور');
    }
  };
  
  const handleExportUsers = () => {
    alert('📥 جاري تصدير قائمة المستخدمين...');
    // TODO: Implement export functionality
  };
  
  const handleViewAuditLog = () => {
    setActiveTab("audit");
  };

  // Calculate summary stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const totalRoles = roles.length;
  const recentLogins = users.filter(u => u.lastLogin).length;

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery);
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "active": { 
        label: "نشط", 
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        icon: CheckCircle2 
      },
      "inactive": { 
        label: "غير نشط", 
        className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
        icon: Clock 
      },
      "suspended": { 
        label: "موقوف", 
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        icon: Ban 
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

  const getRoleLevelBadge = (level: string) => {
    const levelConfig = {
      "admin": { label: "إداري", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100" },
      "manager": { label: "مدير", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
      "staff": { label: "موظف", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
      "custom": { label: "مخصص", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" },
    };

    const config = levelConfig[level as keyof typeof levelConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getAuditStatusBadge = (status: string) => {
    return status === "success" ? (
      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
        <CheckCircle2 className="w-3 h-3 ml-1" />
        نجح
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
        <XCircle className="w-3 h-3 ml-1" />
        فشل
      </Badge>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-100 dark:from-slate-950 dark:via-cyan-950/10 dark:to-slate-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-l from-cyan-600 to-slate-900 dark:from-cyan-400 dark:to-slate-100 bg-clip-text text-transparent">
                المستخدمون والأدوار
              </h1>
              <p className="text-muted-foreground mt-1">
                إدارة حسابات المستخدمين وتعيين الأدوار وتكوين الصلاحيات. التحكم في الوصول حسب المستودع والموقع والوحدة.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              onClick={() => setIsAddUserDialogOpen(true)}
            >
              <UserPlus className="w-4 h-4 ml-2" />
              إضافة مستخدم
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
              onClick={() => setIsCreateRoleDialogOpen(true)}
            >
              <Shield className="w-4 h-4 ml-2" />
              إنشاء دور
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={() => setIsManagePermissionsDialogOpen(true)}
            >
              <Key className="w-4 h-4 ml-2" />
              إدارة الصلاحيات
            </Button>
            <Button 
              variant="outline"
              onClick={handleExportUsers}
            >
              <Download className="w-4 h-4 ml-2" />
              تصدير قائمة المستخدمين
            </Button>
            <Button 
              variant="outline"
              onClick={handleViewAuditLog}
            >
              <FileText className="w-4 h-4 ml-2" />
              سجل التدقيق
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-white shadow-lg">
                  <Users className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">إجمالي المستخدمين</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-cyan-600 to-slate-900 dark:from-cyan-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalUsers}
              </div>
              <p className="text-xs text-muted-foreground mt-2">مستخدم</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg">
                  <UserCheck className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">مستخدمون نشطون</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-cyan-600 to-slate-900 dark:from-cyan-400 dark:to-slate-100 bg-clip-text text-transparent">
                {activeUsers}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                {((activeUsers / totalUsers) * 100).toFixed(0)}% من الإجمالي
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white shadow-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">الأدوار</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-cyan-600 to-slate-900 dark:from-cyan-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalRoles}
              </div>
              <p className="text-xs text-muted-foreground mt-2">دور مختلف</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                  <Activity className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">نشط مؤخراً</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-cyan-600 to-slate-900 dark:from-cyan-400 dark:to-slate-100 bg-clip-text text-transparent">
                {recentLogins}
              </div>
              <p className="text-xs text-muted-foreground mt-2">اليوم</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
            className={activeTab === "users" ? "bg-gradient-to-r from-cyan-600 to-blue-600" : ""}
          >
            <Users className="w-4 h-4 ml-2" />
            المستخدمون
          </Button>
          <Button
            variant={activeTab === "roles" ? "default" : "outline"}
            onClick={() => setActiveTab("roles")}
            className={activeTab === "roles" ? "bg-gradient-to-r from-cyan-600 to-blue-600" : ""}
          >
            <Shield className="w-4 h-4 ml-2" />
            الأدوار
          </Button>
          <Button
            variant={activeTab === "permissions" ? "default" : "outline"}
            onClick={() => setActiveTab("permissions")}
            className={activeTab === "permissions" ? "bg-gradient-to-r from-cyan-600 to-blue-600" : ""}
          >
            <Key className="w-4 h-4 ml-2" />
            الصلاحيات
          </Button>
          <Button
            variant={activeTab === "audit" ? "default" : "outline"}
            onClick={() => setActiveTab("audit")}
            className={activeTab === "audit" ? "bg-gradient-to-r from-cyan-600 to-blue-600" : ""}
          >
            <FileText className="w-4 h-4 ml-2" />
            سجل التدقيق
          </Button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
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
                      placeholder="ابحث عن مستخدم..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>

                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="الدور" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأدوار</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
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
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                      <SelectItem value="suspended">موقوف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="border-2 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{user.name}</CardTitle>
                          <CardDescription className="text-xs">{user.role}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(user.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Contact Info */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs">{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs">{user.department}</span>
                        </div>
                      </div>

                      {/* Last Login */}
                      {user.lastLogin && (
                        <div className="text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 inline ml-1" />
                          آخر دخول: {formatDateTime(user.lastLogin)}
                        </div>
                      )}

                      {/* Warehouses */}
                      {user.assignedWarehouses.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">المستودعات المعينة:</p>
                          <div className="flex flex-wrap gap-1">
                            {user.assignedWarehouses.slice(0, 2).map((warehouse, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {warehouse}
                              </Badge>
                            ))}
                            {user.assignedWarehouses.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.assignedWarehouses.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="w-3 h-3 ml-1" />
                          عرض
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-3 h-3 ml-1" />
                          تعديل
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id} className="border-2 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-white shadow-lg">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">{role.description}</CardDescription>
                      </div>
                    </div>
                    {getRoleLevelBadge(role.level)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">عدد المستخدمين</span>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          {role.usersCount}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">الصلاحيات</span>
                        <span className="text-sm font-semibold">{role.permissions.length}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">إدارة المستخدمين</span>
                        {role.canManageUsers ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">إدارة المخزون</span>
                        {role.canManageInventory ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">عرض التقارير</span>
                        {role.canViewReports ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewRole(role)}
                      >
                        <Eye className="w-3 h-3 ml-1" />
                        عرض
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditRole(role)}
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
        )}

        {/* Permissions Tab */}
        {activeTab === "permissions" && (
          <div className="space-y-6">
            {permissionCategories.map((category) => (
              <Card key={category.name} className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          {permission.critical ? (
                            <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                          ) : (
                            <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                          )}
                          <div>
                            <p className="font-semibold">{permission.name}</p>
                            <p className="text-xs text-muted-foreground">{permission.id}</p>
                          </div>
                        </div>
                        {permission.critical && (
                          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                            صلاحية حساسة
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === "audit" && (
          <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                سجل التدقيق
              </CardTitle>
              <CardDescription>سجل جميع عمليات المستخدمين والنشاطات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                          {log.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{log.userName}</p>
                          <p className="text-xs text-muted-foreground">{log.action}</p>
                        </div>
                      </div>
                      {getAuditStatusBadge(log.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">المورد</p>
                        <p className="font-semibold">{log.resource}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">التاريخ</p>
                        <p className="font-semibold">{formatDateTime(log.timestamp)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">عنوان IP</p>
                        <p className="font-semibold">{log.ipAddress}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">الحالة</p>
                        <p className={`font-semibold ${log.status === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          {log.status === "success" ? "نجح" : "فشل"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Dialogs */}
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              إضافة مستخدم جديد
            </DialogTitle>
            <DialogDescription>
              أدخل معلومات المستخدم الجديد
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="add-name">الاسم *</Label>
              <Input
                id="add-name"
                value={newUserForm.name}
                onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                placeholder="أدخل اسم المستخدم"
              />
            </div>
            
            <div>
              <Label htmlFor="add-email">البريد الإلكتروني *</Label>
              <Input
                id="add-email"
                type="email"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="add-phone">رقم الهاتف</Label>
              <Input
                id="add-phone"
                value={newUserForm.phone}
                onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                placeholder="01012345678"
              />
            </div>
            
            <div>
              <Label htmlFor="add-role">الدور *</Label>
              <Select value={newUserForm.role} onValueChange={(value) => setNewUserForm({ ...newUserForm, role: value })}>
                <SelectTrigger id="add-role">
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="add-department">القسم</Label>
              <Input
                id="add-department"
                value={newUserForm.department}
                onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                placeholder="القسم"
              />
            </div>
            
            <div>
              <Label htmlFor="add-password">كلمة المرور *</Label>
              <Input
                id="add-password"
                type="password"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                placeholder="كلمة المرور"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-cyan-600 to-blue-600"
              onClick={handleAddUser}
            >
              <UserPlus className="w-4 h-4 ml-2" />
              إضافة المستخدم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Role Dialog */}
      <Dialog open={isCreateRoleDialogOpen} onOpenChange={setIsCreateRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              إنشاء دور جديد
            </DialogTitle>
            <DialogDescription>
              أدخل تفاصيل الدور الجديد
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="role-name">اسم الدور *</Label>
              <Input
                id="role-name"
                value={newRoleForm.name}
                onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                placeholder="مثل: مدير المبيعات"
              />
            </div>
            
            <div>
              <Label htmlFor="role-description">الوصف *</Label>
              <Input
                id="role-description"
                value={newRoleForm.description}
                onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
                placeholder="وصف الدور ومسؤولياته"
              />
            </div>
            
            <div>
              <Label htmlFor="role-level">المستوى</Label>
              <Select value={newRoleForm.level} onValueChange={(value: any) => setNewRoleForm({ ...newRoleForm, level: value })}>
                <SelectTrigger id="role-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">إداري</SelectItem>
                  <SelectItem value="manager">مدير</SelectItem>
                  <SelectItem value="staff">موظف</SelectItem>
                  <SelectItem value="custom">مخصص</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateRoleDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-violet-600"
              onClick={handleCreateRole}
            >
              <Shield className="w-4 h-4 ml-2" />
              إنشاء الدور
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Manage Permissions Dialog */}
      <Dialog open={isManagePermissionsDialogOpen} onOpenChange={setIsManagePermissionsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              إدارة الصلاحيات
            </DialogTitle>
            <DialogDescription>
              تعيين وإدارة صلاحيات المستخدمين والأدوار
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm">
              🔐 يمكنك تعيين صلاحيات مخصصة لكل دور أو مستخدم. الصلاحيات تحدد ما يمكن للمستخدم القيام به في النظام.
            </p>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {permissionCategories.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle className="text-base">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4" 
                            id={`permission-${permission.id}`}
                            aria-label={permission.name}
                          />
                          <label htmlFor={`permission-${permission.id}`} className="cursor-pointer">
                            <p className="font-semibold text-sm">{permission.name}</p>
                            <p className="text-xs text-muted-foreground">{permission.id}</p>
                          </label>
                        </div>
                        {permission.critical && (
                          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 text-xs">
                            حساسة
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManagePermissionsDialogOpen(false)}>
              إغلاق
            </Button>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
              <Key className="w-4 h-4 ml-2" />
              حفظ الصلاحيات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View User Dialog */}
      <Dialog open={isViewUserDialogOpen} onOpenChange={setIsViewUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              معلومات المستخدم
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.role}</p>
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">البريد الإلكتروني</p>
                  <p className="font-semibold">{selectedUser.email}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">رقم الهاتف</p>
                  <p className="font-semibold">{selectedUser.phone}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">القسم</p>
                  <p className="font-semibold">{selectedUser.department}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">تاريخ الانضمام</p>
                  <p className="font-semibold">{selectedUser.joinedDate}</p>
                </div>
              </div>
              
              {selectedUser.lastLogin && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">آخر تسجيل دخول</p>
                  <p className="font-semibold">{formatDateTime(selectedUser.lastLogin)}</p>
                </div>
              )}
              
              {selectedUser.assignedWarehouses.length > 0 && (
                <div>
                  <Label>المستودعات المعينة</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUser.assignedWarehouses.map((warehouse, idx) => (
                      <Badge key={idx} variant="outline">{warehouse}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewUserDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              تعديل معلومات المستخدم
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">الاسم *</Label>
              <Input
                id="edit-name"
                value={newUserForm.name}
                onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-email">البريد الإلكتروني *</Label>
              <Input
                id="edit-email"
                type="email"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-phone">رقم الهاتف</Label>
              <Input
                id="edit-phone"
                value={newUserForm.phone}
                onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-role">الدور *</Label>
              <Select value={newUserForm.role} onValueChange={(value) => setNewUserForm({ ...newUserForm, role: value })}>
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-department">القسم</Label>
              <Input
                id="edit-department"
                value={newUserForm.department}
                onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
              onClick={handleSaveEditUser}
            >
              <Edit className="w-4 h-4 ml-2" />
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              حذف المستخدم
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا المستخدم؟
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="font-semibold mb-2">{selectedUser.name}</p>
              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-3">
                ⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه!
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDeleteUser}
            >
              <Trash2 className="w-4 h-4 ml-2" />
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Role Dialog */}
      <Dialog open={isViewRoleDialogOpen} onOpenChange={setIsViewRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              تفاصيل الدور
            </DialogTitle>
          </DialogHeader>
          
          {selectedRoleItem && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">{selectedRoleItem.name}</h3>
                  {getRoleLevelBadge(selectedRoleItem.level)}
                </div>
                <p className="text-sm text-muted-foreground">{selectedRoleItem.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">عدد المستخدمين</p>
                  <p className="text-2xl font-bold">{selectedRoleItem.usersCount}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">الصلاحيات</p>
                  <p className="text-2xl font-bold">{selectedRoleItem.permissions.length}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>الإمكانيات</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                    <span className="text-sm">إدارة المستخدمين</span>
                    {selectedRoleItem.canManageUsers ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                    <span className="text-sm">إدارة المخزون</span>
                    {selectedRoleItem.canManageInventory ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                    <span className="text-sm">عرض التقارير</span>
                    {selectedRoleItem.canViewReports ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewRoleDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              تعديل الدور
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-role-name">اسم الدور *</Label>
              <Input
                id="edit-role-name"
                value={newRoleForm.name}
                onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-role-description">الوصف *</Label>
              <Input
                id="edit-role-description"
                value={newRoleForm.description}
                onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-role-level">المستوى</Label>
              <Select value={newRoleForm.level} onValueChange={(value: any) => setNewRoleForm({ ...newRoleForm, level: value })}>
                <SelectTrigger id="edit-role-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">إداري</SelectItem>
                  <SelectItem value="manager">مدير</SelectItem>
                  <SelectItem value="staff">موظف</SelectItem>
                  <SelectItem value="custom">مخصص</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-violet-600"
              onClick={handleSaveEditRole}
            >
              <Edit className="w-4 h-4 ml-2" />
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
