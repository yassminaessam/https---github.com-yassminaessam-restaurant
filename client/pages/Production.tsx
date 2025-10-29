import { useState, useEffect } from "react";
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
  ChefHat,
  FileText,
  Factory,
  Search,
  Filter,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  PlayCircle,
  XCircle,
  Plus,
  Eye,
  Edit,
  Download,
  RefreshCw,
  BarChart3,
  Utensils,
  ShoppingBag,
  ListChecks,
  Sparkles,
  CookingPot,
  Users,
  Calendar,
  ArrowRight,
  Percent,
  DollarSign,
  Trash2,
} from "lucide-react";

interface Recipe {
  id: string;
  code: string;
  name: string;
  description: string;
  yieldQty: number;
  yieldUom: string;
  ingredientsCount: number;
  costPerUnit: number;
  category: string;
  preparationTime: number;
  status: "active" | "inactive";
}

interface ProductionOrder {
  id: string;
  poNumber: string;
  recipeName: string;
  plannedQty: number;
  actualQty: number;
  uom: string;
  status: "draft" | "released" | "in_progress" | "completed" | "cancelled";
  date: string;
  createdBy: string;
  completionPercent: number;
}

interface Ingredient {
  id: string;
  itemName: string;
  sku: string;
  quantity: number;
  uom: string;
  cost: number;
  available: number;
}

interface RecipeIngredient {
  id: string;
  itemId: string;
  itemName: string;
  sku: string;
  quantity: number;
  uom: string;
  costPerUnit: number;
  totalCost: number;
}

// Sample data
const recipes: Recipe[] = [
  {
    id: "1",
    code: "RCP-001",
    name: "وجبة مشكلة",
    description: "طبق رئيسي مع أرز ولحم وخضروات",
    yieldQty: 1,
    yieldUom: "طبق",
    ingredientsCount: 8,
    costPerUnit: 45,
    category: "وجبات رئيسية",
    preparationTime: 45,
    status: "active",
  },
  {
    id: "2",
    code: "RCP-002",
    name: "سلطة خضراء",
    description: "سلطة طازجة مع الخضروات المتنوعة",
    yieldQty: 1,
    yieldUom: "طبق",
    ingredientsCount: 5,
    costPerUnit: 15,
    category: "مقبلات",
    preparationTime: 15,
    status: "active",
  },
  {
    id: "3",
    code: "RCP-003",
    name: "عصير فواكه طازج",
    description: "عصير طبيعي من الفواكه الموسمية",
    yieldQty: 1,
    yieldUom: "كوب",
    ingredientsCount: 3,
    costPerUnit: 12,
    category: "مشروبات",
    preparationTime: 10,
    status: "active",
  },
  {
    id: "4",
    code: "RCP-004",
    name: "حلى الشوكولاتة",
    description: "حلوى فاخرة بالشوكولاتة",
    yieldQty: 1,
    yieldUom: "قطعة",
    ingredientsCount: 6,
    costPerUnit: 25,
    category: "حلويات",
    preparationTime: 30,
    status: "active",
  },
];

const productionOrders: ProductionOrder[] = [
  {
    id: "1",
    poNumber: "PRO-2025-001",
    recipeName: "وجبة مشكلة",
    plannedQty: 50,
    actualQty: 50,
    uom: "طبق",
    status: "completed",
    date: "2025-10-28",
    createdBy: "أحمد محمد",
    completionPercent: 100,
  },
  {
    id: "2",
    poNumber: "PRO-2025-002",
    recipeName: "سلطة خضراء",
    plannedQty: 30,
    actualQty: 20,
    uom: "طبق",
    status: "in_progress",
    date: "2025-10-28",
    createdBy: "فاطمة علي",
    completionPercent: 67,
  },
  {
    id: "3",
    poNumber: "PRO-2025-003",
    recipeName: "عصير فواكه طازج",
    plannedQty: 40,
    actualQty: 0,
    uom: "كوب",
    status: "released",
    date: "2025-10-28",
    createdBy: "محمود حسن",
    completionPercent: 0,
  },
  {
    id: "4",
    poNumber: "PRO-2025-004",
    recipeName: "حلى الشوكولاتة",
    plannedQty: 25,
    actualQty: 0,
    uom: "قطعة",
    status: "draft",
    date: "2025-10-28",
    createdBy: "سارة خالد",
    completionPercent: 0,
  },
];

const sampleIngredients: Ingredient[] = [
  {
    id: "1",
    itemName: "أرز بسمتي",
    sku: "RICE-001",
    quantity: 0.25,
    uom: "كجم",
    cost: 3.13,
    available: 150,
  },
  {
    id: "2",
    itemName: "دجاج طازج",
    sku: "CHICKEN-001",
    quantity: 0.15,
    uom: "كجم",
    cost: 6.75,
    available: 25,
  },
  {
    id: "3",
    itemName: "خضروات مشكلة",
    sku: "VEG-001",
    quantity: 0.1,
    uom: "كجم",
    cost: 2.5,
    available: 40,
  },
];

export default function Production() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<"recipes" | "production">("recipes");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  // Dialog states
  const [isViewRecipeDialogOpen, setIsViewRecipeDialogOpen] = useState(false);
  const [isEditRecipeDialogOpen, setIsEditRecipeDialogOpen] = useState(false);
  const [isAddRecipeDialogOpen, setIsAddRecipeDialogOpen] = useState(false);
  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false);
  const [isEditOrderDialogOpen, setIsEditOrderDialogOpen] = useState(false);
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Recipe | ProductionOrder | null>(null);
  
  // Ingredient management states
  const [isManageIngredientsDialogOpen, setIsManageIngredientsDialogOpen] = useState(false);
  const [isAddIngredientDialogOpen, setIsAddIngredientDialogOpen] = useState(false);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [ingredientsLoading, setIngredientsLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [ingredientUom, setIngredientUom] = useState("");
  
  // Data states
  const [recipesData, setRecipesData] = useState<Recipe[]>(recipes);
  const [ordersData, setOrdersData] = useState<ProductionOrder[]>(productionOrders);
  const [loading, setLoading] = useState(false);
  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [recipesRes, ordersRes] = await Promise.all([
          fetch('/api/production/recipes'),
          fetch('/api/production/orders')
        ]);
        
        if (recipesRes.ok) {
          const data = await recipesRes.json();
          // Map API data to component format
          const mappedRecipes = data.map((r: any) => ({
            id: r.id,
            code: r.recipeCode,
            name: r.name,
            description: r.description || '',
            yieldQty: r.yieldQuantity,
            yieldUom: r.yieldUom,
            ingredientsCount: r.ingredients?.length || 0,
            costPerUnit: r.ingredients?.reduce((sum: number, i: any) => sum + (i.quantity * i.item.avgCost), 0) || 0,
            category: r.category || 'عام',
            preparationTime: r.prepTime || 30,
            status: r.isActive ? 'active' : 'inactive'
          }));
          setRecipesData(mappedRecipes);
        }
        
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          const mappedOrders = data.map((o: any) => ({
            id: o.id,
            poNumber: o.poNumber,
            recipeName: o.recipe?.name || 'N/A',
            plannedQty: o.plannedQuantity,
            actualQty: o.actualQuantity || 0,
            uom: o.recipe?.yieldUom || 'وحدة',
            status: o.status,
            date: o.plannedDate,
            createdBy: o.createdBy?.name || 'نظام',
            completionPercent: o.plannedQuantity > 0 ? Math.round((o.actualQuantity || 0) / o.plannedQuantity * 100) : 0
          }));
          setOrdersData(mappedOrders);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Keep sample data on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handler functions
  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedItem(recipe);
    setIsViewRecipeDialogOpen(true);
  };
  
  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedItem(recipe);
    setIsEditRecipeDialogOpen(true);
  };
  
  const handleViewOrder = (order: ProductionOrder) => {
    setSelectedItem(order);
    setIsViewOrderDialogOpen(true);
  };
  
  const handleEditOrder = (order: ProductionOrder) => {
    setSelectedItem(order);
    setIsEditOrderDialogOpen(true);
  };
  
  const handleStartProduction = async (orderId: string) => {
    if (confirm('هل تريد بدء تنفيذ أمر الإنتاج؟')) {
      try {
        const response = await fetch(`/api/production/orders/${orderId}/start`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          alert('تم بدء تنفيذ أمر الإنتاج!');
          window.location.reload();
        } else {
          const error = await response.json();
          alert(`خطأ: ${error.error || 'فشل بدء الإنتاج'}`);
        }
      } catch (error) {
        console.error('Error starting production:', error);
        alert('حدث خطأ أثناء بدء الإنتاج');
      }
    }
  };
  
  // Ingredient management functions
  const handleManageIngredients = async (recipe: Recipe) => {
    setSelectedItem(recipe);
    setIsManageIngredientsDialogOpen(true);
    
    // Fetch recipe ingredients
    setIngredientsLoading(true);
    try {
      const [ingredientsRes, itemsRes] = await Promise.all([
        fetch(`/api/production/recipes/${recipe.id}/ingredients`),
        fetch('/api/inventory/items')
      ]);
      
      if (ingredientsRes.ok) {
        const data = await ingredientsRes.json();
        const mapped = data.map((ing: any) => ({
          id: ing.id,
          itemId: ing.itemId,
          itemName: ing.item?.name || 'N/A',
          sku: ing.item?.sku || '',
          quantity: ing.quantity,
          uom: ing.uom,
          costPerUnit: ing.item?.avgCost || 0,
          totalCost: ing.quantity * (ing.item?.avgCost || 0)
        }));
        setRecipeIngredients(mapped);
      } else {
        // Use sample data
        setRecipeIngredients([]);
      }
      
      if (itemsRes.ok) {
        const items = await itemsRes.json();
        setAvailableItems(items);
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      setRecipeIngredients([]);
      setAvailableItems([]);
    } finally {
      setIngredientsLoading(false);
    }
  };
  
  const handleDeleteIngredient = async (ingredientId: string) => {
    if (!confirm('هل تريد حذف هذا المكون من الوصفة؟')) return;
    
    try {
      const response = await fetch(`/api/production/recipe-ingredients/${ingredientId}`, { 
        method: 'DELETE'
      });
      
      if (response.ok) {
        setRecipeIngredients(recipeIngredients.filter(i => i.id !== ingredientId));
        alert('تم حذف المكون بنجاح!');
      } else {
        const error = await response.json();
        alert(`خطأ: ${error.error || 'فشل حذف المكون'}`);
      }
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      alert('حدث خطأ أثناء حذف المكون');
    }
  };
  
  const handleAddIngredientToRecipe = async () => {
    if (!selectedItemId || !ingredientQuantity || !ingredientUom) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    const quantity = parseFloat(ingredientQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert('الكمية يجب أن تكون رقماً صحيحاً أكبر من صفر');
      return;
    }
    
    const selectedItemData = availableItems.find(item => item.id === selectedItemId);
    if (!selectedItemData) {
      alert('الصنف غير موجود');
      return;
    }
    
    try {
      const recipeId = (selectedItem as any).id;
      const response = await fetch(`/api/production/recipes/${recipeId}/ingredients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: selectedItemId, quantity, uom: ingredientUom })
      });
      
      if (response.ok) {
        const addedIngredient = await response.json();
        const newIngredient: RecipeIngredient = {
          id: addedIngredient.id,
          itemId: addedIngredient.itemId,
          itemName: addedIngredient.item?.name || selectedItemData.name,
          sku: addedIngredient.item?.sku || selectedItemData.sku,
          quantity: addedIngredient.quantity,
          uom: addedIngredient.uom || ingredientUom,
          costPerUnit: addedIngredient.item?.avgCost || selectedItemData.avgCost || 0,
          totalCost: addedIngredient.quantity * (addedIngredient.item?.avgCost || selectedItemData.avgCost || 0)
        };
        
        setRecipeIngredients([...recipeIngredients, newIngredient]);
        setIsAddIngredientDialogOpen(false);
        
        // Reset form
        setSelectedItemId('');
        setIngredientQuantity('');
        setIngredientUom('');
        
        alert('تم إضافة المكون بنجاح!');
      } else {
        const error = await response.json();
        alert(`خطأ: ${error.error || 'فشل إضافة المكون'}`);
      }
    } catch (error) {
      console.error('Error adding ingredient:', error);
      alert('حدث خطأ أثناء إضافة المكون');
    }
  };

  // Calculate summary stats
  const totalRecipes = recipes.filter(r => r.status === "active").length;
  const totalProduction = productionOrders.filter(p => p.status === "completed").reduce((sum, p) => sum + p.actualQty, 0);
  const inProgressOrders = productionOrders.filter(p => p.status === "in_progress").length;
  const avgCost = recipes.reduce((sum, r) => sum + r.costPerUnit, 0) / recipes.length;

  // Filter recipes
  const filteredRecipes = recipesData.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || recipe.status === selectedStatus;
    const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Filter production orders
  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.recipeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "draft": { 
        label: "مسودة", 
        className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
        icon: FileText 
      },
      "released": { 
        label: "جاهز للتنفيذ", 
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        icon: PlayCircle 
      },
      "in_progress": { 
        label: "قيد التنفيذ", 
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        icon: Clock 
      },
      "completed": { 
        label: "مكتمل", 
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        icon: CheckCircle2 
      },
      "cancelled": { 
        label: "ملغي", 
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        icon: XCircle 
      },
      "active": { 
        label: "نشط", 
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        icon: CheckCircle2 
      },
      "inactive": { 
        label: "غير نشط", 
        className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
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

  const categories = Array.from(new Set(recipesData.map(r => r.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 dark:from-slate-950 dark:via-amber-950/10 dark:to-slate-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-l from-amber-600 to-slate-900 dark:from-amber-400 dark:to-slate-100 bg-clip-text text-transparent">
                الوصفات والإنتاج
              </h1>
              <p className="text-muted-foreground mt-1">
                تحديد الوصفات مع قوائم المكونات وإنشاء أوامر الإنتاج وتتبع العائد. مراقبة استهلاك المكونات والتحضير الفعلي بكميات كبيرة.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              onClick={() => setIsAddRecipeDialogOpen(true)}
            >
              <Plus className="w-4 h-4 ml-2" />
              وصفة جديدة
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={() => setIsAddOrderDialogOpen(true)}
            >
              <Factory className="w-4 h-4 ml-2" />
              أمر إنتاج جديد
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              onClick={() => {
                if (filteredRecipes.length > 0) {
                  handleManageIngredients(filteredRecipes[0]);
                } else {
                  alert('لا توجد وصفات متاحة');
                }
              }}
            >
              <ListChecks className="w-4 h-4 ml-2" />
              قائمة المواد (BOM)
            </Button>
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 ml-2" />
              تقارير الإنتاج
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white shadow-lg">
                  <Utensils className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">الوصفات النشطة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-amber-600 to-slate-900 dark:from-amber-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalRecipes}
              </div>
              <p className="text-xs text-muted-foreground mt-2">وصفة جاهزة</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg">
                  <Factory className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">الإنتاج اليوم</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-amber-600 to-slate-900 dark:from-amber-400 dark:to-slate-100 bg-clip-text text-transparent">
                {totalProduction}
              </div>
              <p className="text-xs text-muted-foreground mt-2">وحدة منتجة</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">قيد التنفيذ</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-amber-600 to-slate-900 dark:from-amber-400 dark:to-slate-100 bg-clip-text text-transparent">
                {inProgressOrders}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
                أمر نشط
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white shadow-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <CardDescription className="text-sm font-semibold">متوسط التكلفة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-l from-amber-600 to-slate-900 dark:from-amber-400 dark:to-slate-100 bg-clip-text text-transparent">
                {avgCost.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">جنيه للوحدة</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "recipes" ? "default" : "outline"}
            onClick={() => setActiveTab("recipes")}
            className={activeTab === "recipes" ? "bg-gradient-to-r from-amber-600 to-orange-600" : ""}
          >
            <CookingPot className="w-4 h-4 ml-2" />
            الوصفات
          </Button>
          <Button
            variant={activeTab === "production" ? "default" : "outline"}
            onClick={() => setActiveTab("production")}
            className={activeTab === "production" ? "bg-gradient-to-r from-amber-600 to-orange-600" : ""}
          >
            <Factory className="w-4 h-4 ml-2" />
            أوامر الإنتاج
          </Button>
        </div>

        {/* Recipes Tab */}
        {activeTab === "recipes" && (
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
                      placeholder="ابحث عن وصفة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفئات</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
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
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Recipes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <Card key={recipe.id} className="border-2 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg text-white">
                        <ChefHat className="w-5 h-5" />
                      </div>
                      {getStatusBadge(recipe.status)}
                    </div>
                    <CardTitle className="text-lg mt-3">{recipe.name}</CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {recipe.code}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {recipe.description}
                      </p>
                      
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <Badge variant="outline" className="mb-2">{recipe.category}</Badge>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">العائد</p>
                            <p className="font-semibold">{recipe.yieldQty} {recipe.yieldUom}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">المكونات</p>
                            <p className="font-semibold">{recipe.ingredientsCount} صنف</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">التكلفة</p>
                          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            {recipe.costPerUnit} ج.م
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">وقت التحضير</p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {recipe.preparationTime} دقيقة
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewRecipe(recipe)}
                        >
                          <Eye className="w-3 h-3 ml-1" />
                          عرض
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditRecipe(recipe)}
                        >
                          <Edit className="w-3 h-3 ml-1" />
                          تعديل
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20"
                          onClick={() => handleManageIngredients(recipe)}
                          title="إدارة المكونات"
                        >
                          <ListChecks className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20"
                          onClick={() => {
                            setSelectedRecipe(recipe);
                            setIsAddOrderDialogOpen(true);
                          }}
                          title="إنشاء أمر إنتاج"
                        >
                          <Factory className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recipe Details Modal (Simple) */}
            {selectedRecipe && (
              <Card className="mt-6 border-2 border-amber-400 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ListChecks className="w-5 h-5" />
                      قائمة المواد - {selectedRecipe.name}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedRecipe(null)}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">المكون</TableHead>
                        <TableHead className="text-right">SKU</TableHead>
                        <TableHead className="text-right">الكمية</TableHead>
                        <TableHead className="text-right">الوحدة</TableHead>
                        <TableHead className="text-right">التكلفة</TableHead>
                        <TableHead className="text-right">المتاح</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleIngredients.map((ing) => (
                        <TableRow key={ing.id}>
                          <TableCell className="font-semibold">{ing.itemName}</TableCell>
                          <TableCell className="font-mono text-sm">{ing.sku}</TableCell>
                          <TableCell>{ing.quantity}</TableCell>
                          <TableCell>{ing.uom}</TableCell>
                          <TableCell>{ing.cost.toFixed(2)} ج.م</TableCell>
                          <TableCell>
                            <span className={ing.available < 30 ? "text-red-600 font-bold" : "text-green-600"}>
                              {ing.available}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Production Orders Tab */}
        {activeTab === "production" && (
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
                      placeholder="ابحث عن أمر إنتاج..."
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
                      <SelectItem value="released">جاهز للتنفيذ</SelectItem>
                      <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Factory className="w-5 h-5" />
                    أوامر الإنتاج
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {filteredOrders.length} أمر
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الأمر</TableHead>
                      <TableHead className="text-right">الوصفة</TableHead>
                      <TableHead className="text-right">الكمية المخططة</TableHead>
                      <TableHead className="text-right">الكمية الفعلية</TableHead>
                      <TableHead className="text-right">التقدم</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">أنشأ بواسطة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20">
                        <TableCell className="font-mono text-sm font-semibold">
                          {order.poNumber}
                        </TableCell>
                        <TableCell className="font-semibold">{order.recipeName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.plannedQty} {order.uom}</Badge>
                        </TableCell>
                        <TableCell className="font-bold">
                          {order.actualQty} {order.uom}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all ${
                                  order.completionPercent === 0 ? 'w-0' :
                                  order.completionPercent < 25 ? 'w-1/4' :
                                  order.completionPercent < 50 ? 'w-1/2' :
                                  order.completionPercent < 75 ? 'w-3/4' :
                                  'w-full'
                                }`}
                              />
                            </div>
                            <span className="text-xs font-semibold min-w-[3rem] text-right">
                              {order.completionPercent}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.date).toLocaleDateString('ar-EG')}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {order.createdBy}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                              title="عرض التفاصيل"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditOrder(order)}
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {order.status === "released" && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleStartProduction(order.id)}
                                title="بدء الإنتاج"
                              >
                                <PlayCircle className="w-4 h-4 text-green-600" />
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

      {/* View Recipe Dialog */}
      <Dialog open={isViewRecipeDialogOpen} onOpenChange={setIsViewRecipeDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              تفاصيل الوصفة
            </DialogTitle>
          </DialogHeader>
          {selectedItem && 'code' in selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">كود الوصفة</Label>
                  <p className="font-mono text-lg font-bold">{selectedItem.code}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">اسم الوصفة</Label>
                  <p className="text-lg font-bold">{selectedItem.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الفئة</Label>
                  <p className="text-lg">{selectedItem.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الحالة</Label>
                  <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">العائد</Label>
                  <p className="text-lg font-bold">{selectedItem.yieldQty} {selectedItem.yieldUom}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">عدد المكونات</Label>
                  <p className="text-lg font-bold">{selectedItem.ingredientsCount} صنف</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">وقت التحضير</Label>
                  <p className="text-lg font-bold text-blue-600">{selectedItem.preparationTime} دقيقة</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">التكلفة للوحدة</Label>
                  <p className="text-lg font-bold text-amber-600">{selectedItem.costPerUnit.toFixed(2)} ج.م</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">الوصف</Label>
                <p className="text-sm mt-1">{selectedItem.description}</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <p className="text-sm">💡 لعرض قائمة المواد الكاملة، استخدم زر "قائمة المواد (BOM)"</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewRecipeDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Recipe Dialog */}
      <Dialog open={isEditRecipeDialogOpen} onOpenChange={setIsEditRecipeDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              تعديل الوصفة
            </DialogTitle>
          </DialogHeader>
          {selectedItem && 'code' in selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-recipe-code">كود الوصفة</Label>
                  <Input id="edit-recipe-code" defaultValue={selectedItem.code} className="font-mono" />
                </div>
                <div>
                  <Label htmlFor="edit-recipe-name">اسم الوصفة</Label>
                  <Input id="edit-recipe-name" defaultValue={selectedItem.name} />
                </div>
                <div>
                  <Label htmlFor="edit-recipe-category">الفئة</Label>
                  <Input id="edit-recipe-category" defaultValue={selectedItem.category} />
                </div>
                <div>
                  <Label htmlFor="edit-recipe-status">الحالة</Label>
                  <Select defaultValue={selectedItem.status}>
                    <SelectTrigger id="edit-recipe-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-recipe-yield">العائد (كمية)</Label>
                  <Input id="edit-recipe-yield" type="number" defaultValue={selectedItem.yieldQty} />
                </div>
                <div>
                  <Label htmlFor="edit-recipe-uom">وحدة العائد</Label>
                  <Input id="edit-recipe-uom" defaultValue={selectedItem.yieldUom} />
                </div>
                <div>
                  <Label htmlFor="edit-recipe-time">وقت التحضير (دقيقة)</Label>
                  <Input id="edit-recipe-time" type="number" defaultValue={selectedItem.preparationTime} />
                </div>
                <div>
                  <Label htmlFor="edit-recipe-cost">التكلفة المقدرة (ج.م)</Label>
                  <Input id="edit-recipe-cost" type="number" step="0.01" defaultValue={selectedItem.costPerUnit} disabled />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-recipe-desc">الوصف</Label>
                <Input id="edit-recipe-desc" defaultValue={selectedItem.description} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRecipeDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={async () => {
              try {
                const recipeId = (selectedItem as any).id;
                const recipeData = {
                  recipeCode: (document.getElementById('edit-recipe-code') as HTMLInputElement)?.value,
                  name: (document.getElementById('edit-recipe-name') as HTMLInputElement)?.value,
                  category: (document.getElementById('edit-recipe-category') as HTMLInputElement)?.value,
                  yieldQuantity: parseFloat((document.getElementById('edit-recipe-yield') as HTMLInputElement)?.value || '1'),
                  yieldUom: (document.getElementById('edit-recipe-uom') as HTMLInputElement)?.value,
                  prepTime: parseInt((document.getElementById('edit-recipe-time') as HTMLInputElement)?.value || '0'),
                  description: (document.getElementById('edit-recipe-desc') as HTMLInputElement)?.value,
                  isActive: (selectedItem as any).status === 'active'
                };
                
                const response = await fetch(`/api/production/recipes/${recipeId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(recipeData)
                });
                
                if (response.ok) {
                  alert('تم حفظ التعديلات!');
                  setIsEditRecipeDialogOpen(false);
                  window.location.reload();
                } else {
                  const error = await response.json();
                  alert(`خطأ: ${error.error || 'فشل حفظ التعديلات'}`);
                }
              } catch (error) {
                console.error('Error updating recipe:', error);
                alert('حدث خطأ أثناء حفظ التعديلات');
              }
            }}>
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Recipe Dialog */}
      <Dialog open={isAddRecipeDialogOpen} onOpenChange={setIsAddRecipeDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              إضافة وصفة جديدة
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-recipe-code">كود الوصفة *</Label>
                <Input id="new-recipe-code" placeholder="RCP-005" className="font-mono" required />
              </div>
              <div>
                <Label htmlFor="new-recipe-name">اسم الوصفة *</Label>
                <Input id="new-recipe-name" placeholder="اسم الوصفة" required />
              </div>
              <div>
                <Label htmlFor="new-recipe-category">الفئة *</Label>
                <Input id="new-recipe-category" placeholder="وجبات رئيسية، مقبلات، حلويات..." required />
              </div>
              <div>
                <Label htmlFor="new-recipe-status">الحالة</Label>
                <Select defaultValue="active">
                  <SelectTrigger id="new-recipe-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-recipe-yield">العائد (كمية) *</Label>
                <Input id="new-recipe-yield" type="number" placeholder="1" defaultValue="1" required />
              </div>
              <div>
                <Label htmlFor="new-recipe-uom">وحدة العائد *</Label>
                <Input id="new-recipe-uom" placeholder="طبق، كوب، قطعة..." required />
              </div>
              <div>
                <Label htmlFor="new-recipe-time">وقت التحضير (دقيقة)</Label>
                <Input id="new-recipe-time" type="number" placeholder="30" defaultValue="30" />
              </div>
            </div>
            <div>
              <Label htmlFor="new-recipe-desc">الوصف</Label>
              <Input id="new-recipe-desc" placeholder="وصف تفصيلي للوصفة" />
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm">💡 ملاحظة: بعد إضافة الوصفة، قم بإضافة المكونات من خلال زر "قائمة المواد (BOM)"</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRecipeDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={async () => {
              try {
                const recipeData = {
                  recipeCode: (document.getElementById('new-recipe-code') as HTMLInputElement)?.value,
                  name: (document.getElementById('new-recipe-name') as HTMLInputElement)?.value,
                  category: (document.getElementById('new-recipe-category') as HTMLInputElement)?.value,
                  yieldQuantity: parseFloat((document.getElementById('new-recipe-yield') as HTMLInputElement)?.value || '1'),
                  yieldUom: (document.getElementById('new-recipe-uom') as HTMLInputElement)?.value,
                  prepTime: parseInt((document.getElementById('new-recipe-time') as HTMLInputElement)?.value || '0'),
                  description: (document.getElementById('new-recipe-desc') as HTMLInputElement)?.value,
                  isActive: true,
                  outputItemId: null // Will need to be created separately
                };
                
                if (!recipeData.recipeCode || !recipeData.name || !recipeData.yieldUom) {
                  alert('يرجى ملء جميع الحقول المطلوبة');
                  return;
                }
                
                const response = await fetch('/api/production/recipes', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(recipeData)
                });
                
                if (response.ok) {
                  alert('تم إضافة الوصفة بنجاح!');
                  setIsAddRecipeDialogOpen(false);
                  window.location.reload();
                } else {
                  const error = await response.json();
                  alert(`خطأ: ${error.error || 'فشل إضافة الوصفة'}`);
                }
              } catch (error) {
                console.error('Error creating recipe:', error);
                alert('حدث خطأ أثناء إضافة الوصفة');
              }
            }}>
              إضافة الوصفة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Production Order Dialog */}
      <Dialog open={isViewOrderDialogOpen} onOpenChange={setIsViewOrderDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Factory className="w-5 h-5" />
              تفاصيل أمر الإنتاج
            </DialogTitle>
          </DialogHeader>
          {selectedItem && 'poNumber' in selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">رقم الأمر</Label>
                  <p className="font-mono text-lg font-bold">{selectedItem.poNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الوصفة</Label>
                  <p className="text-lg font-bold">{selectedItem.recipeName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الحالة</Label>
                  <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">التاريخ</Label>
                  <p className="text-lg">{new Date(selectedItem.date).toLocaleDateString('ar-EG')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الكمية المخططة</Label>
                  <p className="text-lg font-bold">{selectedItem.plannedQty} {selectedItem.uom}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الكمية الفعلية</Label>
                  <p className="text-lg font-bold text-green-600">{selectedItem.actualQty} {selectedItem.uom}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">نسبة الإنجاز</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all ${
                          selectedItem.completionPercent === 0 ? 'w-0' :
                          selectedItem.completionPercent < 25 ? 'w-1/4' :
                          selectedItem.completionPercent < 50 ? 'w-1/2' :
                          selectedItem.completionPercent < 75 ? 'w-3/4' :
                          selectedItem.completionPercent === 100 ? 'w-full' :
                          'w-3/4'
                        }`}
                      />
                    </div>
                    <span className="text-sm font-bold">{selectedItem.completionPercent}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">أنشأ بواسطة</Label>
                  <p className="text-lg">{selectedItem.createdBy}</p>
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

      {/* Edit Production Order Dialog */}
      <Dialog open={isEditOrderDialogOpen} onOpenChange={setIsEditOrderDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              تعديل أمر الإنتاج
            </DialogTitle>
          </DialogHeader>
          {selectedItem && 'poNumber' in selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-order-number">رقم الأمر</Label>
                  <Input id="edit-order-number" defaultValue={selectedItem.poNumber} className="font-mono" disabled />
                </div>
                <div>
                  <Label htmlFor="edit-order-recipe">الوصفة</Label>
                  <Input id="edit-order-recipe" defaultValue={selectedItem.recipeName} disabled />
                </div>
                <div>
                  <Label htmlFor="edit-order-planned">الكمية المخططة</Label>
                  <Input id="edit-order-planned" type="number" defaultValue={selectedItem.plannedQty} />
                </div>
                <div>
                  <Label htmlFor="edit-order-actual">الكمية الفعلية</Label>
                  <Input id="edit-order-actual" type="number" defaultValue={selectedItem.actualQty} />
                </div>
                <div>
                  <Label htmlFor="edit-order-status">الحالة</Label>
                  <Select defaultValue={selectedItem.status}>
                    <SelectTrigger id="edit-order-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="released">جاهز للتنفيذ</SelectItem>
                      <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-order-date">التاريخ</Label>
                  <Input id="edit-order-date" type="date" defaultValue={selectedItem.date} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOrderDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={async () => {
              try {
                const orderId = (selectedItem as any).id;
                const orderData = {
                  plannedQuantity: parseFloat((document.getElementById('edit-order-planned') as HTMLInputElement)?.value || '0'),
                  actualQuantity: parseFloat((document.getElementById('edit-order-actual') as HTMLInputElement)?.value || '0'),
                  plannedDate: (document.getElementById('edit-order-date') as HTMLInputElement)?.value,
                };
                
                const response = await fetch(`/api/production/orders/${orderId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(orderData)
                });
                
                if (response.ok) {
                  alert('تم حفظ التعديلات!');
                  setIsEditOrderDialogOpen(false);
                  window.location.reload();
                } else {
                  const error = await response.json();
                  alert(`خطأ: ${error.error || 'فشل حفظ التعديلات'}`);
                }
              } catch (error) {
                console.error('Error updating order:', error);
                alert('حدث خطأ أثناء حفظ التعديلات');
              }
            }}>
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Production Order Dialog */}
      <Dialog open={isAddOrderDialogOpen} onOpenChange={setIsAddOrderDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              أمر إنتاج جديد
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-order-number">رقم الأمر *</Label>
                <Input 
                  id="new-order-number" 
                  placeholder="PRO-2025-XXX" 
                  className="font-mono" 
                  defaultValue={`PRO-2025-${String(ordersData.length + 1).padStart(3, '0')}`}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="new-order-recipe">الوصفة *</Label>
                <Select defaultValue={selectedRecipe?.id || recipesData[0]?.id}>
                  <SelectTrigger id="new-order-recipe">
                    <SelectValue placeholder="اختر وصفة" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipesData.filter(r => r.status === 'active').map((recipe) => (
                      <SelectItem key={recipe.id} value={recipe.id}>
                        {recipe.name} ({recipe.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-order-planned">الكمية المخططة *</Label>
                <Input id="new-order-planned" type="number" placeholder="50" required />
              </div>
              <div>
                <Label htmlFor="new-order-date">تاريخ الإنتاج *</Label>
                <Input 
                  id="new-order-date" 
                  type="date" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="new-order-status">الحالة</Label>
                <Select defaultValue="draft">
                  <SelectTrigger id="new-order-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="released">جاهز للتنفيذ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-sm">💡 ملاحظة: سيتم خصم المكونات من المخزون عند إكمال أمر الإنتاج وإضافة المنتج النهائي</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddOrderDialogOpen(false);
              setSelectedRecipe(null);
            }}>
              إلغاء
            </Button>
            <Button onClick={async () => {
              try {
                const selectedRecipeId = (document.getElementById('new-order-recipe') as HTMLSelectElement)?.value;
                if (!selectedRecipeId) {
                  alert('يرجى اختيار وصفة');
                  return;
                }
                
                const orderData = {
                  poNumber: (document.getElementById('new-order-number') as HTMLInputElement)?.value,
                  recipeId: selectedRecipeId,
                  plannedQuantity: parseFloat((document.getElementById('new-order-planned') as HTMLInputElement)?.value || '0'),
                  plannedDate: (document.getElementById('new-order-date') as HTMLInputElement)?.value,
                  status: 'draft',
                  sourceWarehouseId: null, // Will be set based on recipe
                  destinationWarehouseId: null
                };
                
                if (!orderData.poNumber || orderData.plannedQuantity <= 0) {
                  alert('يرجى ملء جميع الحقول المطلوبة');
                  return;
                }
                
                const response = await fetch('/api/production/orders', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(orderData)
                });
                
                if (response.ok) {
                  alert('تم إنشاء أمر الإنتاج بنجاح!');
                  setIsAddOrderDialogOpen(false);
                  setSelectedRecipe(null);
                  window.location.reload();
                } else {
                  const error = await response.json();
                  alert(`خطأ: ${error.error || 'فشل إنشاء أمر الإنتاج'}`);
                }
              } catch (error) {
                console.error('Error creating production order:', error);
                alert('حدث خطأ أثناء إنشاء أمر الإنتاج');
              }
            }}>
              إنشاء الأمر
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Recipe Ingredients Dialog */}
      <Dialog open={isManageIngredientsDialogOpen} onOpenChange={setIsManageIngredientsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListChecks className="w-5 h-5" />
              إدارة مكونات الوصفة - {selectedItem && 'code' in selectedItem ? selectedItem.name : ''}
            </DialogTitle>
            <DialogDescription>
              أضف أو عدل أو احذف المكونات المطلوبة لهذه الوصفة
            </DialogDescription>
          </DialogHeader>
          
          {ingredientsLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Ingredients Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                      <TableHead className="text-right font-bold">الصنف</TableHead>
                      <TableHead className="text-right font-bold">SKU</TableHead>
                      <TableHead className="text-right font-bold">الكمية</TableHead>
                      <TableHead className="text-right font-bold">الوحدة</TableHead>
                      <TableHead className="text-right font-bold">سعر الوحدة</TableHead>
                      <TableHead className="text-right font-bold">الإجمالي</TableHead>
                      <TableHead className="text-right font-bold">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipeIngredients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          لا توجد مكونات مضافة بعد. اضغط "إضافة مكون" للبدء
                        </TableCell>
                      </TableRow>
                    ) : (
                      recipeIngredients.map((ingredient) => (
                        <TableRow key={ingredient.id} className="hover:bg-amber-50/30 dark:hover:bg-amber-950/10">
                          <TableCell className="font-semibold">{ingredient.itemName}</TableCell>
                          <TableCell className="font-mono text-sm">{ingredient.sku}</TableCell>
                          <TableCell className="font-bold">{ingredient.quantity}</TableCell>
                          <TableCell>{ingredient.uom}</TableCell>
                          <TableCell>{ingredient.costPerUnit.toFixed(2)} ج.م</TableCell>
                          <TableCell className="font-bold text-amber-600">
                            {ingredient.totalCost.toFixed(2)} ج.م
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteIngredient(ingredient.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              {recipeIngredients.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border-2 border-amber-200 dark:border-amber-800">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">عدد المكونات</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {recipeIngredients.length} صنف
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">إجمالي التكلفة</p>
                      <p className="text-2xl font-bold text-green-600">
                        {recipeIngredients.reduce((sum, i) => sum + i.totalCost, 0).toFixed(2)} ج.م
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">العائد</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedItem && 'yieldQty' in selectedItem ? `${selectedItem.yieldQty} ${selectedItem.yieldUom}` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-sm">
                  💡 <strong>نصيحة:</strong> تأكد من اختيار الكميات الصحيحة لكل مكون. سيتم خصم هذه الكميات من المخزون عند إنتاج الوصفة.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsManageIngredientsDialogOpen(false)}
            >
              إغلاق
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={() => setIsAddIngredientDialogOpen(true)}
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة مكون
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Ingredient Dialog */}
      <Dialog open={isAddIngredientDialogOpen} onOpenChange={setIsAddIngredientDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              إضافة مكون للوصفة
            </DialogTitle>
            <DialogDescription>
              اختر الصنف من المخزون وحدد الكمية المطلوبة
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="ingredient-item">الصنف *</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger id="ingredient-item">
                  <SelectValue placeholder="اختر صنفاً من المخزون" />
                </SelectTrigger>
                <SelectContent>
                  {availableItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.sku}) - {item.avgCost?.toFixed(2) || '0.00'} ج.م
                    </SelectItem>
                  ))}
                  {availableItems.length === 0 && (
                    <SelectItem value="none" disabled>
                      لا توجد أصناف متاحة
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ingredient-quantity">الكمية المطلوبة *</Label>
                <Input
                  id="ingredient-quantity"
                  type="number"
                  step="0.01"
                  placeholder="0.25"
                  value={ingredientQuantity}
                  onChange={(e) => setIngredientQuantity(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ingredient-uom">الوحدة *</Label>
                <Input
                  id="ingredient-uom"
                  placeholder="كجم، لتر، قطعة..."
                  value={ingredientUom}
                  onChange={(e) => setIngredientUom(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              <p className="text-sm">
                <strong>مثال:</strong> إذا كانت الوصفة تنتج 1 طبق وتحتاج 0.25 كجم أرز، 
                فعند إنتاج 50 طبقاً سيتم خصم 12.5 كجم أرز من المخزون تلقائياً.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddIngredientDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button 
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              onClick={handleAddIngredientToRecipe}
            >
              إضافة المكون
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
