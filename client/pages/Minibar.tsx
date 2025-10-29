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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Hotel,
  Refrigerator,
  ShoppingBag,
  Search,
  Filter,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Eye,
  Edit,
  RefreshCw,
  ArrowRightLeft,
  Download,
  BarChart3,
  Bed,
  Users,
  Calendar,
  TrendingUp,
  PackageCheck,
  ClipboardList,
  Sparkles,
  Coffee,
  Wine,
  Droplets,
  Candy,
} from "lucide-react";

interface Room {
  code: string;
  name: string;
  status: "occupied" | "vacant" | "cleaning" | "maintenance";
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
  itemsCount: number;
  totalValue: number;
  lastRestocked: string;
  needsRestock: boolean;
}

interface MinibarItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  minStock: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

interface MinibarTransaction {
  id: string;
  roomCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  date: string;
  guestName: string;
  status: "pending" | "charged" | "voided";
}

// Sample data
const rooms: Room[] = [
  {
    code: "ROOM-101",
    name: "منى بار غرفة 101",
    status: "occupied",
    guestName: "أحمد محمد علي",
    checkIn: "2025-10-25",
    checkOut: "2025-10-30",
    itemsCount: 12,
    totalValue: 450,
    lastRestocked: "2025-10-26",
    needsRestock: false,
  },
  {
    code: "ROOM-102",
    name: "منى بار غرفة 102",
    status: "occupied",
    guestName: "فاطمة حسن",
    checkIn: "2025-10-27",
    checkOut: "2025-10-31",
    itemsCount: 8,
    totalValue: 280,
    lastRestocked: "2025-10-27",
    needsRestock: true,
  },
  {
    code: "ROOM-103",
    name: "منى بار غرفة 103",
    status: "vacant",
    itemsCount: 15,
    totalValue: 520,
    lastRestocked: "2025-10-20",
    needsRestock: false,
  },
  {
    code: "ROOM-104",
    name: "منى بار غرفة 104",
    status: "occupied",
    guestName: "محمود خالد",
    checkIn: "2025-10-26",
    checkOut: "2025-10-29",
    itemsCount: 5,
    totalValue: 180,
    lastRestocked: "2025-10-26",
    needsRestock: true,
  },
  {
    code: "ROOM-105",
    name: "منى بار غرفة 105",
    status: "cleaning",
    itemsCount: 10,
    totalValue: 350,
    lastRestocked: "2025-10-28",
    needsRestock: false,
  },
  {
    code: "ROOM-106",
    name: "منى بار غرفة 106",
    status: "vacant",
    itemsCount: 15,
    totalValue: 520,
    lastRestocked: "2025-10-28",
    needsRestock: false,
  },
  {
    code: "ROOM-107",
    name: "منى بار غرفة 107",
    status: "occupied",
    guestName: "سارة أحمد",
    checkIn: "2025-10-28",
    checkOut: "2025-11-02",
    itemsCount: 10,
    totalValue: 380,
    lastRestocked: "2025-10-28",
    needsRestock: false,
  },
  {
    code: "ROOM-108",
    name: "منى بار غرفة 108",
    status: "vacant",
    itemsCount: 15,
    totalValue: 520,
    lastRestocked: "2025-10-27",
    needsRestock: false,
  },
  {
    code: "ROOM-109",
    name: "منى بار غرفة 109",
    status: "occupied",
    guestName: "خالد عمر",
    checkIn: "2025-10-27",
    checkOut: "2025-10-30",
    itemsCount: 8,
    totalValue: 290,
    lastRestocked: "2025-10-27",
    needsRestock: true,
  },
  {
    code: "ROOM-200",
    name: "منى بار غرفة 200",
    status: "occupied",
    guestName: "ليلى حسن",
    checkIn: "2025-10-26",
    checkOut: "2025-10-31",
    itemsCount: 12,
    totalValue: 450,
    lastRestocked: "2025-10-26",
    needsRestock: false,
  },
  {
    code: "ROOM-201",
    name: "منى بار غرفة 201",
    status: "vacant",
    itemsCount: 15,
    totalValue: 520,
    lastRestocked: "2025-10-28",
    needsRestock: false,
  },
  {
    code: "ROOM-202",
    name: "منى بار غرفة 202",
    status: "occupied",
    guestName: "عمر يوسف",
    checkIn: "2025-10-28",
    checkOut: "2025-11-01",
    itemsCount: 9,
    totalValue: 320,
    lastRestocked: "2025-10-28",
    needsRestock: false,
  },
  {
    code: "ROOM-203",
    name: "منى بار غرفة 203",
    status: "cleaning",
    itemsCount: 12,
    totalValue: 410,
    lastRestocked: "2025-10-28",
    needsRestock: false,
  },
  {
    code: "ROOM-204",
    name: "منى بار غرفة 204",
    status: "occupied",
    guestName: "نور الدين",
    checkIn: "2025-10-25",
    checkOut: "2025-10-30",
    itemsCount: 7,
    totalValue: 260,
    lastRestocked: "2025-10-26",
    needsRestock: true,
  },
  {
    code: "ROOM-205",
    name: "منى بار غرفة 205",
    status: "vacant",
    itemsCount: 15,
    totalValue: 520,
    lastRestocked: "2025-10-27",
    needsRestock: false,
  },
  {
    code: "ROOM-206",
    name: "منى بار غرفة 206",
    status: "occupied",
    guestName: "هدى محمود",
    checkIn: "2025-10-27",
    checkOut: "2025-11-02",
    itemsCount: 11,
    totalValue: 400,
    lastRestocked: "2025-10-27",
    needsRestock: false,
  },
  {
    code: "ROOM-207",
    name: "منى بار غرفة 207",
    status: "vacant",
    itemsCount: 15,
    totalValue: 520,
    lastRestocked: "2025-10-28",
    needsRestock: false,
  },
  {
    code: "ROOM-208",
    name: "منى بار غرفة 208",
    status: "occupied",
    guestName: "ياسر علي",
    checkIn: "2025-10-26",
    checkOut: "2025-10-29",
    itemsCount: 6,
    totalValue: 220,
    lastRestocked: "2025-10-26",
    needsRestock: true,
  },
  {
    code: "ROOM-209",
    name: "منى بار غرفة 209",
    status: "cleaning",
    itemsCount: 13,
    totalValue: 460,
    lastRestocked: "2025-10-28",
    needsRestock: false,
  },
  {
    code: "ROOM-210",
    name: "منى بار غرفة 210",
    status: "occupied",
    guestName: "رانيا سعيد",
    checkIn: "2025-10-28",
    checkOut: "2025-11-03",
    itemsCount: 10,
    totalValue: 370,
    lastRestocked: "2025-10-28",
    needsRestock: false,
  },
  {
    code: "ROOM-211",
    name: "منى بار غرفة 211",
    status: "vacant",
    itemsCount: 15,
    totalValue: 520,
    lastRestocked: "2025-10-27",
    needsRestock: false,
  },
  {
    code: "ROOM-212",
    name: "منى بار غرفة 212",
    status: "occupied",
    guestName: "طارق فهمي",
    checkIn: "2025-10-27",
    checkOut: "2025-10-31",
    itemsCount: 9,
    totalValue: 330,
    lastRestocked: "2025-10-27",
    needsRestock: false,
  },
  {
    code: "ROOM-CH01",
    name: "منى بار غرفة ch01",
    status: "occupied",
    guestName: "مريم خالد",
    checkIn: "2025-10-26",
    checkOut: "2025-10-30",
    itemsCount: 14,
    totalValue: 490,
    lastRestocked: "2025-10-26",
    needsRestock: false,
  },
  {
    code: "ROOM-CH02",
    name: "منى بار غرفة ch02",
    status: "cleaning",
    itemsCount: 12,
    totalValue: 420,
    lastRestocked: "2025-10-28",
    needsRestock: false,
  },
  {
    code: "ROOM-CH03",
    name: "منى بار غرفة ch03",
    status: "vacant",
    itemsCount: 15,
    totalValue: 520,
    lastRestocked: "2025-10-28",
    needsRestock: false,
  },
  {
    code: "ROOM-CH04",
    name: "منى بار غرفة ch04",
    status: "occupied",
    guestName: "إبراهيم صلاح",
    checkIn: "2025-10-28",
    checkOut: "2025-11-01",
    itemsCount: 11,
    totalValue: 390,
    lastRestocked: "2025-10-28",
    needsRestock: false,
  },
  {
    code: "ROOM-CH05",
    name: "منى بار غرفة ch05",
    status: "vacant",
    itemsCount: 15,
    totalValue: 520,
    lastRestocked: "2025-10-27",
    needsRestock: false,
  },
  {
    code: "ROOM-CH06",
    name: "منى بار غرفة ch06",
    status: "occupied",
    guestName: "دينا حسام",
    checkIn: "2025-10-27",
    checkOut: "2025-10-30",
    itemsCount: 8,
    totalValue: 300,
    lastRestocked: "2025-10-27",
    needsRestock: true,
  },
  {
    code: "ROOM-CH07",
    name: "منى بار غرفة ch07",
    status: "maintenance",
    itemsCount: 0,
    totalValue: 0,
    lastRestocked: "2025-10-20",
    needsRestock: true,
  },
  {
    code: "ROOM-CH08",
    name: "منى بار غرفة ch08",
    status: "occupied",
    guestName: "وليد عادل",
    checkIn: "2025-10-26",
    checkOut: "2025-10-29",
    itemsCount: 10,
    totalValue: 360,
    lastRestocked: "2025-10-26",
    needsRestock: false,
  },
];

const minibarItems: MinibarItem[] = [
  {
    id: "1",
    sku: "COLA-001",
    name: "كوكاكولا",
    category: "مشروبات",
    price: 25,
    quantity: 45,
    minStock: 20,
    status: "in-stock",
  },
  {
    id: "2",
    sku: "WATER-001",
    name: "ماء معدني",
    category: "مشروبات",
    price: 15,
    quantity: 12,
    minStock: 20,
    status: "low-stock",
  },
  {
    id: "3",
    sku: "CHIPS-001",
    name: "شيبس",
    category: "وجبات خفيفة",
    price: 20,
    quantity: 30,
    minStock: 15,
    status: "in-stock",
  },
  {
    id: "4",
    sku: "CHOC-001",
    name: "شوكولاتة",
    category: "حلويات",
    price: 35,
    quantity: 8,
    minStock: 10,
    status: "low-stock",
  },
  {
    id: "5",
    sku: "JUICE-001",
    name: "عصير برتقال",
    category: "مشروبات",
    price: 30,
    quantity: 0,
    minStock: 15,
    status: "out-of-stock",
  },
];

const transactions: MinibarTransaction[] = [
  {
    id: "1",
    roomCode: "ROOM-101",
    itemName: "كوكاكولا",
    quantity: 2,
    unitPrice: 25,
    totalAmount: 50,
    date: "2025-10-28",
    guestName: "أحمد محمد علي",
    status: "charged",
  },
  {
    id: "2",
    roomCode: "ROOM-102",
    itemName: "ماء معدني",
    quantity: 1,
    unitPrice: 15,
    totalAmount: 15,
    date: "2025-10-28",
    guestName: "فاطمة حسن",
    status: "charged",
  },
  {
    id: "3",
    roomCode: "ROOM-104",
    itemName: "شيبس",
    quantity: 3,
    unitPrice: 20,
    totalAmount: 60,
    date: "2025-10-27",
    guestName: "محمود خالد",
    status: "pending",
  },
];

export default function Minibar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRoomFilter, setSelectedRoomFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"rooms" | "inventory" | "transactions">("rooms");
  
  // Dialog states
  const [isConsumptionDialogOpen, setIsConsumptionDialogOpen] = useState(false);
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false);
  const [isRevenueReportDialogOpen, setIsRevenueReportDialogOpen] = useState(false);
  const [isRoomDetailsDialogOpen, setIsRoomDetailsDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [isInventoryEditDialogOpen, setIsInventoryEditDialogOpen] = useState(false);
  const [isTransactionDetailsDialogOpen, setIsTransactionDetailsDialogOpen] = useState(false);
  
  // Selected items
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedItem, setSelectedItem] = useState<MinibarItem | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<MinibarTransaction | null>(null);
  
  // Consumption form
  const [consumptionForm, setConsumptionForm] = useState({
    roomCode: "",
    itemId: "",
    quantity: "1"
  });
  
  // Audit form
  const [auditForm, setAuditForm] = useState({
    roomCode: "",
    expectedItems: [] as { itemId: string; expectedQty: number; actualQty: number; }[]
  });
  
  // Report filters
  const [reportFilters, setReportFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    roomCode: "all"
  });

  // Fetch rooms from API
  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/minibar/rooms');
      if (response.ok) {
        const data = await response.json();
        // Transform API data to match Room interface if needed
        console.log('Rooms loaded:', data);
        // TODO: Update rooms state with transformed data
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Handlers
  const handleRecordConsumption = async () => {
    if (!consumptionForm.roomCode || !consumptionForm.itemId || !consumptionForm.quantity) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    try {
      const room = rooms.find(r => r.code === consumptionForm.roomCode);
      const item = minibarItems.find(i => i.id === consumptionForm.itemId);
      
      if (!room || !item) {
        alert('غرفة أو صنف غير صحيح');
        return;
      }
      
      // Get or create folio for the room
      let folioResponse = await fetch(`/api/minibar/folio/${room.code}`);
      let folio = await folioResponse.json();
      
      // If no open folio exists, create one
      if (!folio) {
        const createFolioResponse = await fetch('/api/minibar/folio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: room.code,
            guestName: room.guestName || 'Guest'
          })
        });
        folio = await createFolioResponse.json();
      }
      
      // Add charge to folio
      const response = await fetch('/api/minibar/folio/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folioId: folio.id,
          itemId: consumptionForm.itemId,
          quantity: parseInt(consumptionForm.quantity),
          unitPrice: item.price,
          warehouseId: 'minibar-stock' // Default minibar warehouse
        })
      });
      
      if (response.ok) {
        alert(`✅ تم تسجيل استهلاك ${consumptionForm.quantity} × ${item.name} للغرفة ${room.name}\nالمبلغ: ${parseInt(consumptionForm.quantity) * item.price} ج.م`);
        setIsConsumptionDialogOpen(false);
        setConsumptionForm({ roomCode: "", itemId: "", quantity: "1" });
        // Refresh data
        fetchRooms();
      } else {
        throw new Error('Failed to record consumption');
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء تسجيل الاستهلاك');
    }
  };
  
  const handleStartAudit = () => {
    if (!auditForm.roomCode) {
      alert('يرجى اختيار غرفة للتدقيق');
      return;
    }
    
    const room = rooms.find(r => r.code === auditForm.roomCode);
    if (!room) return;
    
    // Initialize expected items for audit
    const expectedItems = minibarItems.map(item => ({
      itemId: item.id,
      itemName: item.name,
      expectedQty: 2, // Default expected quantity
      actualQty: 0
    }));
    
    alert(`بدء تدقيق منى بار ${room.name}\nسيتم مقارنة الكميات الفعلية مع المتوقعة`);
  };
  
  const handleGenerateRevenueReport = () => {
    const filtered = transactions.filter(t => {
      const tDate = new Date(t.date);
      const start = new Date(reportFilters.startDate);
      const end = new Date(reportFilters.endDate);
      const matchesDate = tDate >= start && tDate <= end;
      const matchesRoom = reportFilters.roomCode === "all" || t.roomCode === reportFilters.roomCode;
      return matchesDate && matchesRoom && t.status !== "voided";
    });
    
    const total = filtered.reduce((sum, t) => sum + t.totalAmount, 0);
    const itemsSold = filtered.reduce((sum, t) => sum + t.quantity, 0);
    
    alert(`📊 تقرير الإيرادات\n\nالفترة: ${reportFilters.startDate} إلى ${reportFilters.endDate}\n\nإجمالي المعاملات: ${filtered.length}\nإجمالي الأصناف المباعة: ${itemsSold}\nإجمالي الإيرادات: ${total} ج.م`);
  };
  
  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsRoomDetailsDialogOpen(true);
  };
  
  const handleRestockRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsRestockDialogOpen(true);
  };
  
  const handleEditInventoryItem = (item: MinibarItem) => {
    setSelectedItem(item);
    setIsInventoryEditDialogOpen(true);
  };
  
  const handleViewTransaction = (transaction: MinibarTransaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionDetailsDialogOpen(true);
  };
  
  const handleChargeTransaction = async (transactionId: string) => {
    try {
      if (!selectedTransaction) return;
      
      // Find the folio for this transaction and close it
      const room = rooms.find(r => r.code === selectedTransaction.roomCode);
      if (!room) return;
      
      const folioResponse = await fetch(`/api/minibar/folio/${room.code}`);
      const folio = await folioResponse.json();
      
      if (folio) {
        const response = await fetch(`/api/minibar/folio/${folio.id}/close`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentMethod: 'ROOM_CHARGE' })
        });
        
        if (response.ok) {
          alert(`✅ تم تحصيل المعاملة رقم ${transactionId}`);
          setIsTransactionDetailsDialogOpen(false);
          fetchRooms();
        } else {
          throw new Error('Failed to charge transaction');
        }
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء التحصيل');
    }
  };
  
  const handleSaveInventoryEdit = async () => {
    try {
      if (!selectedItem) return;
      
      const response = await fetch(`/api/inventory/items/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedItem.name,
          price: selectedItem.price,
          minStock: selectedItem.minStock
        })
      });
      
      if (response.ok) {
        alert(`✅ تم تحديث الصنف: ${selectedItem.name}`);
        setIsInventoryEditDialogOpen(false);
      } else {
        throw new Error('Failed to update item');
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء التحديث');
    }
  };
  
  const handleSaveRestock = async () => {
    try {
      if (!selectedRoom) return;
      
      const response = await fetch('/api/minibar/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumber: selectedRoom.code,
          status: 'OCCUPIED',
          lastRestocked: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        alert(`✅ تم تعبئة منى بار ${selectedRoom.name}`);
        setIsRestockDialogOpen(false);
        fetchRooms();
      } else {
        throw new Error('Failed to restock room');
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء التعبئة');
    }
  };

  // Calculate summary stats
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === "occupied").length;
  const needsRestockCount = rooms.filter(r => r.needsRestock).length;
  const totalRevenue = transactions.reduce((sum, t) => t.status !== "voided" ? sum + t.totalAmount : sum, 0);

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.guestName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || room.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Filter items
  const filteredItems = minibarItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.roomCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.guestName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoom = selectedRoomFilter === "all" || t.roomCode === selectedRoomFilter;
    
    return matchesSearch && matchesRoom;
  });

  const getRoomStatusBadge = (status: string) => {
    const statusConfig = {
      "occupied": { 
        label: "مشغولة", 
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        icon: CheckCircle2 
      },
      "vacant": { 
        label: "فارغة", 
        className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
        icon: XCircle 
      },
      "cleaning": { 
        label: "تنظيف", 
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        icon: Sparkles 
      },
      "maintenance": { 
        label: "صيانة", 
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        icon: AlertTriangle 
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

  const getStockStatusBadge = (status: string) => {
    const statusConfig = {
      "in-stock": { label: "متوفر", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
      "low-stock": { label: "مخزون منخفض", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" },
      "out-of-stock": { label: "نفذ", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getTransactionStatusBadge = (status: string) => {
    const statusConfig = {
      "pending": { label: "معلق", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" },
      "charged": { label: "تم التحصيل", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
      "voided": { label: "ملغي", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-100 dark:from-slate-950 dark:via-cyan-950/10 dark:to-slate-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl shadow-lg">
              <Refrigerator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-l from-cyan-600 to-slate-900 dark:from-cyan-400 dark:to-slate-100 bg-clip-text text-transparent">
                منى بار الفندق
              </h1>
              <p className="text-muted-foreground mt-1">
                إدارة تخزين منى بار ورسوم الغرف والتكامل مع نظام إدارة الفندق. تتبع مخزون وتوزيع أتمتة الرسوم.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link to="/transfer">
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                <ArrowRightLeft className="w-4 h-4 ml-2" />
                إعادة تخزين منى بار
              </Button>
            </Link>
            <Button 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={() => setIsConsumptionDialogOpen(true)}
            >
              <ShoppingBag className="w-4 h-4 ml-2" />
              تسجيل استهلاك
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={() => setIsAuditDialogOpen(true)}
            >
              <ClipboardList className="w-4 h-4 ml-2" />
              تدقيق منى بار
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsRevenueReportDialogOpen(true)}
            >
              <BarChart3 className="w-4 h-4 ml-2" />
              تقارير الإيرادات
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-white shadow-lg">
                  <Hotel className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">إجمالي الغرف</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-cyan-600 to-slate-900 dark:from-cyan-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalRooms}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{occupiedRooms} مشغولة</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">الإيرادات اليوم</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-cyan-600 to-slate-900 dark:from-cyan-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalRevenue}
              </div>
              <p className="text-xs text-muted-foreground mt-2">جنيه مصري</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl text-white shadow-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">يحتاج إعادة تخزين</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-cyan-600 to-slate-900 dark:from-cyan-400 dark:to-slate-100 bg-clip-text text-transparent">
                {needsRestockCount}
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-medium">
                غرفة تحتاج تعبئة
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                  <Package className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">الأصناف المتاحة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-cyan-600 to-slate-900 dark:from-cyan-400 dark:to-slate-100 bg-clip-text text-transparent">
                {minibarItems.length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">صنف مختلف</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "rooms" ? "default" : "outline"}
            onClick={() => setActiveTab("rooms")}
            className={activeTab === "rooms" ? "bg-gradient-to-r from-cyan-600 to-blue-600" : ""}
          >
            <Bed className="w-4 h-4 ml-2" />
            الغرف
          </Button>
          <Button
            variant={activeTab === "inventory" ? "default" : "outline"}
            onClick={() => setActiveTab("inventory")}
            className={activeTab === "inventory" ? "bg-gradient-to-r from-cyan-600 to-blue-600" : ""}
          >
            <Package className="w-4 h-4 ml-2" />
            المخزون
          </Button>
          <Button
            variant={activeTab === "transactions" ? "default" : "outline"}
            onClick={() => setActiveTab("transactions")}
            className={activeTab === "transactions" ? "bg-gradient-to-r from-cyan-600 to-blue-600" : ""}
          >
            <ClipboardList className="w-4 h-4 ml-2" />
            المعاملات
          </Button>
        </div>

        {/* Rooms Tab */}
        {activeTab === "rooms" && (
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="ابحث عن غرفة أو نزيل..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="حالة الغرفة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="occupied">مشغولة</SelectItem>
                      <SelectItem value="vacant">فارغة</SelectItem>
                      <SelectItem value="cleaning">تنظيف</SelectItem>
                      <SelectItem value="maintenance">صيانة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <Card key={room.code} className="border-2 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg text-white">
                        <Bed className="w-5 h-5" />
                      </div>
                      {getRoomStatusBadge(room.status)}
                    </div>
                    <CardTitle className="text-lg mt-3">{room.name}</CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {room.code}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {room.guestName && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-xs text-muted-foreground">النزيل</p>
                          <p className="font-semibold">{room.guestName}</p>
                          <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                            <span>دخول: {new Date(room.checkIn!).toLocaleDateString('ar-EG')}</span>
                            <span>•</span>
                            <span>خروج: {new Date(room.checkOut!).toLocaleDateString('ar-EG')}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">عدد الأصناف</p>
                          <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                            {room.itemsCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">القيمة</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {room.totalValue} ج.م
                          </p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground">آخر تعبئة</p>
                        <p className="text-sm">{new Date(room.lastRestocked).toLocaleDateString('ar-EG')}</p>
                      </div>

                      {room.needsRestock && (
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                            يحتاج إعادة تخزين
                          </span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewRoom(room)}
                        >
                          <Eye className="w-3 h-3 ml-1" />
                          عرض
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleRestockRoom(room)}
                        >
                          <PackageCheck className="w-3 h-3 ml-1" />
                          تعبئة
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
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
                      placeholder="ابحث عن صنف..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="حالة المخزون" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="in-stock">متوفر</SelectItem>
                      <SelectItem value="low-stock">مخزون منخفض</SelectItem>
                      <SelectItem value="out-of-stock">نفذ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  مخزون المنى بار
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">SKU</TableHead>
                      <TableHead className="text-right">الصنف</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">السعر</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">الحد الأدنى</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20">
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell className="font-semibold">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="font-semibold">{item.price} ج.م</TableCell>
                        <TableCell>
                          <span className={`font-bold ${
                            item.status === 'out-of-stock' ? 'text-red-600' :
                            item.status === 'low-stock' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {item.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.minStock}
                        </TableCell>
                        <TableCell>{getStockStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditInventoryItem(item)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditInventoryItem(item)}
                            >
                              <Edit className="w-4 h-4" />
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

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
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
                      placeholder="ابحث..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>

                  <Select value={selectedRoomFilter} onValueChange={setSelectedRoomFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الغرفة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الغرف</SelectItem>
                      {rooms.map((room) => (
                        <SelectItem key={room.code} value={room.code}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  معاملات المنى بار
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الغرفة</TableHead>
                      <TableHead className="text-right">النزيل</TableHead>
                      <TableHead className="text-right">الصنف</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">السعر</TableHead>
                      <TableHead className="text-right">الإجمالي</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20">
                        <TableCell>
                          <Badge variant="outline">{transaction.roomCode}</Badge>
                        </TableCell>
                        <TableCell>{transaction.guestName}</TableCell>
                        <TableCell className="font-semibold">{transaction.itemName}</TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell>{transaction.unitPrice} ج.م</TableCell>
                        <TableCell className="font-bold">{transaction.totalAmount} ج.م</TableCell>
                        <TableCell className="text-sm">
                          {new Date(transaction.date).toLocaleDateString('ar-EG')}
                        </TableCell>
                        <TableCell>{getTransactionStatusBadge(transaction.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewTransaction(transaction)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {transaction.status === "pending" && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleChargeTransaction(transaction.id)}
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              </Button>
                            )}
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
      
      {/* Dialogs */}
      {/* Record Consumption Dialog */}
      <Dialog open={isConsumptionDialogOpen} onOpenChange={setIsConsumptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              تسجيل استهلاك من المنى بار
            </DialogTitle>
            <DialogDescription>
              سجل الأصناف التي استهلكها النزيل من الغرفة
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="consumption-room">الغرفة *</Label>
              <Select 
                value={consumptionForm.roomCode}
                onValueChange={(value) => setConsumptionForm({ ...consumptionForm, roomCode: value })}
              >
                <SelectTrigger id="consumption-room">
                  <SelectValue placeholder="اختر الغرفة" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.filter(r => r.status === 'occupied').map((room) => (
                    <SelectItem key={room.code} value={room.code}>
                      {room.name} - {room.guestName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="consumption-item">الصنف *</Label>
              <Select 
                value={consumptionForm.itemId}
                onValueChange={(value) => setConsumptionForm({ ...consumptionForm, itemId: value })}
              >
                <SelectTrigger id="consumption-item">
                  <SelectValue placeholder="اختر الصنف" />
                </SelectTrigger>
                <SelectContent>
                  {minibarItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - {item.price} ج.م
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="consumption-quantity">الكمية *</Label>
              <Input
                id="consumption-quantity"
                type="number"
                min="1"
                value={consumptionForm.quantity}
                onChange={(e) => setConsumptionForm({ ...consumptionForm, quantity: e.target.value })}
              />
            </div>
            
            {consumptionForm.itemId && consumptionForm.quantity && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-semibold">الإجمالي:</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {parseInt(consumptionForm.quantity) * (minibarItems.find(i => i.id === consumptionForm.itemId)?.price || 0)} ج.م
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConsumptionDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-emerald-600"
              onClick={handleRecordConsumption}
            >
              <ShoppingBag className="w-4 h-4 ml-2" />
              تسجيل الاستهلاك
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Minibar Audit Dialog */}
      <Dialog open={isAuditDialogOpen} onOpenChange={setIsAuditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              تدقيق منى بار
            </DialogTitle>
            <DialogDescription>
              تحقق من الكميات الفعلية وقارنها مع المتوقع
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="audit-room">الغرفة *</Label>
              <Select 
                value={auditForm.roomCode}
                onValueChange={(value) => setAuditForm({ ...auditForm, roomCode: value })}
              >
                <SelectTrigger id="audit-room">
                  <SelectValue placeholder="اختر الغرفة" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.code} value={room.code}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm">
                📝 سيتم عرض قائمة بجميع الأصناف لتسجيل الكميات الفعلية ومقارنتها مع المتوقع
              </p>
            </div>
            
            {auditForm.roomCode && (
              <div className="space-y-2">
                <Label>قائمة التدقيق</Label>
                <div className="max-h-96 overflow-y-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الصنف</TableHead>
                        <TableHead className="text-right">المتوقع</TableHead>
                        <TableHead className="text-right">الفعلي</TableHead>
                        <TableHead className="text-right">الفرق</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {minibarItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>2</TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              min="0" 
                              defaultValue="0"
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell className="font-semibold text-yellow-600">-2</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAuditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
              onClick={handleStartAudit}
            >
              <ClipboardList className="w-4 h-4 ml-2" />
              حفظ التدقيق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Revenue Report Dialog */}
      <Dialog open={isRevenueReportDialogOpen} onOpenChange={setIsRevenueReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              تقرير إيرادات المنى بار
            </DialogTitle>
            <DialogDescription>
              عرض إحصائيات الإيرادات والمبيعات
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="report-start">من تاريخ</Label>
                <Input
                  id="report-start"
                  type="date"
                  value={reportFilters.startDate}
                  onChange={(e) => setReportFilters({ ...reportFilters, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="report-end">إلى تاريخ</Label>
                <Input
                  id="report-end"
                  type="date"
                  value={reportFilters.endDate}
                  onChange={(e) => setReportFilters({ ...reportFilters, endDate: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="report-room">الغرفة</Label>
              <Select 
                value={reportFilters.roomCode}
                onValueChange={(value) => setReportFilters({ ...reportFilters, roomCode: value })}
              >
                <SelectTrigger id="report-room">
                  <SelectValue placeholder="جميع الغرف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الغرف</SelectItem>
                  {rooms.map((room) => (
                    <SelectItem key={room.code} value={room.code}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">إجمالي المعاملات</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {transactions.filter(t => {
                    const tDate = new Date(t.date);
                    const start = new Date(reportFilters.startDate);
                    const end = new Date(reportFilters.endDate);
                    return tDate >= start && tDate <= end && t.status !== "voided";
                  }).length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">الأصناف المباعة</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {transactions.filter(t => {
                    const tDate = new Date(t.date);
                    const start = new Date(reportFilters.startDate);
                    const end = new Date(reportFilters.endDate);
                    return tDate >= start && tDate <= end && t.status !== "voided";
                  }).reduce((sum, t) => sum + t.quantity, 0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {transactions.filter(t => {
                    const tDate = new Date(t.date);
                    const start = new Date(reportFilters.startDate);
                    const end = new Date(reportFilters.endDate);
                    return tDate >= start && tDate <= end && t.status !== "voided";
                  }).reduce((sum, t) => sum + t.totalAmount, 0)} ج.م
                </p>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm">
                📊 يمكنك تصدير التقرير إلى Excel أو PDF للحصول على تحليل مفصل
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevenueReportDialogOpen(false)}>
              إغلاق
            </Button>
            <Button 
              variant="outline"
              onClick={handleGenerateRevenueReport}
            >
              <Download className="w-4 h-4 ml-2" />
              تصدير التقرير
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Room Details Dialog */}
      <Dialog open={isRoomDetailsDialogOpen} onOpenChange={setIsRoomDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bed className="w-5 h-5" />
              تفاصيل {selectedRoom?.name}
            </DialogTitle>
            <DialogDescription>
              معلومات مفصلة عن الغرفة ومحتويات المنى بار
            </DialogDescription>
          </DialogHeader>
          
          {selectedRoom && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">كود الغرفة</p>
                  <p className="font-mono font-bold">{selectedRoom.code}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">الحالة</p>
                  {getRoomStatusBadge(selectedRoom.status)}
                </div>
              </div>
              
              {selectedRoom.guestName && (
                <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">معلومات النزيل</p>
                  <p className="font-semibold text-lg mb-2">{selectedRoom.guestName}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">تاريخ الدخول</p>
                      <p className="font-semibold">{selectedRoom.checkIn && new Date(selectedRoom.checkIn).toLocaleDateString('ar-EG')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">تاريخ الخروج</p>
                      <p className="font-semibold">{selectedRoom.checkOut && new Date(selectedRoom.checkOut).toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">عدد الأصناف</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedRoom.itemsCount}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">القيمة الإجمالية</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedRoom.totalValue} ج.م</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">آخر تعبئة</p>
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {new Date(selectedRoom.lastRestocked).toLocaleDateString('ar-EG')}
                  </p>
                </div>
              </div>
              
              {selectedRoom.needsRestock && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="font-semibold text-yellow-700 dark:text-yellow-300">تحتاج إعادة تخزين</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">هذه الغرفة بحاجة إلى تعبئة المنى بار</p>
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-gradient-to-r from-slate-50 to-cyan-50 dark:from-slate-800 dark:to-cyan-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">📋 الإجراءات المتاحة:</p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setIsRoomDetailsDialogOpen(false);
                      handleRestockRoom(selectedRoom);
                    }}
                  >
                    <PackageCheck className="w-3 h-3 ml-1" />
                    إعادة تخزين
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setIsRoomDetailsDialogOpen(false);
                      setConsumptionForm({ ...consumptionForm, roomCode: selectedRoom.code });
                      setIsConsumptionDialogOpen(true);
                    }}
                  >
                    <ShoppingBag className="w-3 h-3 ml-1" />
                    تسجيل استهلاك
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setIsRoomDetailsDialogOpen(false);
                      setAuditForm({ ...auditForm, roomCode: selectedRoom.code });
                      setIsAuditDialogOpen(true);
                    }}
                  >
                    <ClipboardList className="w-3 h-3 ml-1" />
                    تدقيق
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoomDetailsDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Room Restock Dialog */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5" />
              إعادة تخزين منى بار - {selectedRoom?.name}
            </DialogTitle>
            <DialogDescription>
              حدد الأصناف والكميات لتعبئة المنى بار
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bed className="w-4 h-4" />
                <p className="font-semibold">{selectedRoom?.name}</p>
              </div>
              {selectedRoom?.guestName && (
                <p className="text-sm text-muted-foreground">النزيل: {selectedRoom.guestName}</p>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الصنف</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-right">الكمية الحالية</TableHead>
                    <TableHead className="text-right">كمية التعبئة</TableHead>
                    <TableHead className="text-right">الإجمالي الجديد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {minibarItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold">{item.name}</TableCell>
                      <TableCell>{item.price} ج.م</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.quantity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          min="0" 
                          defaultValue="0"
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">✅ ملاحظات التعبئة:</p>
              <Input placeholder="أضف أي ملاحظات (اختياري)" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-cyan-600 to-blue-600"
              onClick={handleSaveRestock}
            >
              <PackageCheck className="w-4 h-4 ml-2" />
              حفظ التعبئة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Inventory Item Edit Dialog */}
      <Dialog open={isInventoryEditDialogOpen} onOpenChange={setIsInventoryEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              تعديل صنف - {selectedItem?.name}
            </DialogTitle>
            <DialogDescription>
              تحديث معلومات وأسعار الصنف
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-sku">SKU</Label>
                <Input
                  id="edit-sku"
                  defaultValue={selectedItem.sku}
                  className="font-mono"
                  disabled
                />
              </div>
              
              <div>
                <Label htmlFor="edit-name">اسم الصنف *</Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedItem.name}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-category">الفئة</Label>
                <Select defaultValue={selectedItem.category}>
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مشروبات">مشروبات</SelectItem>
                    <SelectItem value="وجبات خفيفة">وجبات خفيفة</SelectItem>
                    <SelectItem value="حلويات">حلويات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">السعر (ج.م) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={selectedItem.price}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-minStock">الحد الأدنى للمخزون *</Label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    min="0"
                    defaultValue={selectedItem.minStock}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">الكمية الحالية</p>
                    <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{selectedItem.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">الحالة</p>
                    <div className="mt-1">{getStockStatusBadge(selectedItem.status)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInventoryEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
              onClick={handleSaveInventoryEdit}
            >
              <Edit className="w-4 h-4 ml-2" />
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Transaction Details Dialog */}
      <Dialog open={isTransactionDetailsDialogOpen} onOpenChange={setIsTransactionDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              تفاصيل المعاملة #{selectedTransaction?.id}
            </DialogTitle>
            <DialogDescription>
              معلومات مفصلة عن معاملة المنى بار
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">الغرفة</p>
                  <Badge variant="outline" className="text-base">{selectedTransaction.roomCode}</Badge>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">الحالة</p>
                  {getTransactionStatusBadge(selectedTransaction.status)}
                </div>
              </div>
              
              <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">النزيل</p>
                <p className="font-semibold text-lg">{selectedTransaction.guestName}</p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">تفاصيل الصنف</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الصنف:</span>
                    <span className="font-semibold">{selectedTransaction.itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الكمية:</span>
                    <span className="font-semibold">{selectedTransaction.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">السعر للوحدة:</span>
                    <span className="font-semibold">{selectedTransaction.unitPrice} ج.م</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">الإجمالي</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {selectedTransaction.totalAmount} ج.م
                </p>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">التاريخ والوقت</p>
                <p className="font-semibold">
                  {new Date(selectedTransaction.date).toLocaleString('ar-EG')}
                </p>
              </div>
              
              {selectedTransaction.status === "pending" && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <p className="font-semibold text-yellow-700 dark:text-yellow-300">معاملة معلقة</p>
                  </div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">هذه المعاملة لم يتم تحصيلها بعد</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransactionDetailsDialogOpen(false)}>
              إغلاق
            </Button>
            {selectedTransaction?.status === "pending" && (
              <Button 
                className="bg-gradient-to-r from-green-600 to-emerald-600"
                onClick={() => {
                  handleChargeTransaction(selectedTransaction.id);
                  setIsTransactionDetailsDialogOpen(false);
                }}
              >
                <CheckCircle2 className="w-4 h-4 ml-2" />
                تحصيل الآن
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
