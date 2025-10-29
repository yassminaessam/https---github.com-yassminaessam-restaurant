import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ShoppingCart, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SaleLine {
  sku: string;
  qty: number;
  unitPrice: number;
}

export default function POSSale() {
  const { toast } = useToast();
  const [warehouseCode, setWarehouseCode] = useState("KITCHEN");
  const [customerName, setCustomerName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [lines, setLines] = useState<SaleLine[]>([{ sku: "", qty: 1, unitPrice: 0 }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLine = () => {
    setLines([...lines, { sku: "", qty: 1, unitPrice: 0 }]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof SaleLine, value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const calculateSubtotal = () => {
    return lines.reduce((sum, line) => sum + line.qty * line.unitPrice, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.14; // 14% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async () => {
    const validLines = lines.filter((l) => l.sku && l.qty > 0 && l.unitPrice > 0);
    if (validLines.length === 0) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى إضافة صنف واحد على الأقل",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/pos/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warehouseCode,
          items: validLines,
          customerName: customerName || undefined,
          roomNumber: roomNumber || undefined,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل إنشاء الفاتورة");
      }

      const result = await response.json();
      toast({
        title: "تم بنجاح",
        description: `تم إنشاء الطلب: ${result.orderNumber} - الإجمالي: ${result.total.toFixed(2)} ج.م`,
      });

      // Reset form
      setCustomerName("");
      setRoomNumber("");
      setLines([{ sku: "", qty: 1, unitPrice: 0 }]);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: err.message || "حدث خطأ أثناء الحفظ",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sample prices for demo
  const itemPrices: Record<string, number> = {
    "COLA-001": 15,
    "WATER-001": 10,
    "CHIPS-001": 20,
  };

  const handleSkuChange = (index: number, sku: string) => {
    updateLine(index, "sku", sku);
    if (itemPrices[sku]) {
      updateLine(index, "unitPrice", itemPrices[sku]);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">نقطة البيع - بوفيه / منى بار</h1>
        </div>
        <p className="text-muted-foreground">
          مبيعات من البوفيه أو المنى بار
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">معلومات البيع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="warehouse">المخزن</Label>
                <Select value={warehouseCode} onValueChange={setWarehouseCode}>
                  <SelectTrigger id="warehouse">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KITCHEN">المطبخ</SelectItem>
                    <SelectItem value="BUFFET">البوفيه</SelectItem>
                    <SelectItem value="FRIDGE">الثلاجة</SelectItem>
                    <SelectItem value="ROOM-101">منى بار - غرفة 101</SelectItem>
                    <SelectItem value="ROOM-102">منى بار - غرفة 102</SelectItem>
                    <SelectItem value="ROOM-103">منى بار - غرفة 103</SelectItem>
                    <SelectItem value="ROOM-104">منى بار - غرفة 104</SelectItem>
                    <SelectItem value="ROOM-105">منى بار - غرفة 105</SelectItem>
                    <SelectItem value="ROOM-106">منى بار - غرفة 106</SelectItem>
                    <SelectItem value="ROOM-107">منى بار - غرفة 107</SelectItem>
                    <SelectItem value="ROOM-108">منى بار - غرفة 108</SelectItem>
                    <SelectItem value="ROOM-109">منى بار - غرفة 109</SelectItem>
                    <SelectItem value="ROOM-200">منى بار - غرفة 200</SelectItem>
                    <SelectItem value="ROOM-201">منى بار - غرفة 201</SelectItem>
                    <SelectItem value="ROOM-202">منى بار - غرفة 202</SelectItem>
                    <SelectItem value="ROOM-203">منى بار - غرفة 203</SelectItem>
                    <SelectItem value="ROOM-204">منى بار - غرفة 204</SelectItem>
                    <SelectItem value="ROOM-205">منى بار - غرفة 205</SelectItem>
                    <SelectItem value="ROOM-206">منى بار - غرفة 206</SelectItem>
                    <SelectItem value="ROOM-207">منى بار - غرفة 207</SelectItem>
                    <SelectItem value="ROOM-208">منى بار - غرفة 208</SelectItem>
                    <SelectItem value="ROOM-209">منى بار - غرفة 209</SelectItem>
                    <SelectItem value="ROOM-210">منى بار - غرفة 210</SelectItem>
                    <SelectItem value="ROOM-211">منى بار - غرفة 211</SelectItem>
                    <SelectItem value="ROOM-212">منى بار - غرفة 212</SelectItem>
                    <SelectItem value="ROOM-CH01">منى بار - غرفة ch01</SelectItem>
                    <SelectItem value="ROOM-CH02">منى بار - غرفة ch02</SelectItem>
                    <SelectItem value="ROOM-CH03">منى بار - غرفة ch03</SelectItem>
                    <SelectItem value="ROOM-CH04">منى بار - غرفة ch04</SelectItem>
                    <SelectItem value="ROOM-CH05">منى بار - غرفة ch05</SelectItem>
                    <SelectItem value="ROOM-CH06">منى بار - غرفة ch06</SelectItem>
                    <SelectItem value="ROOM-CH07">منى بار - غرفة ch07</SelectItem>
                    <SelectItem value="ROOM-CH08">منى بار - غرفة ch08</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment">طريقة الدفع</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">نقدي</SelectItem>
                    <SelectItem value="card">بطاقة</SelectItem>
                    <SelectItem value="room_charge">رسوم الغرفة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customer">اسم العميل</Label>
                <Input
                  id="customer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="اختياري"
                />
              </div>

              <div>
                <Label htmlFor="room">رقم الغرفة</Label>
                <Input
                  id="room"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="اختياري"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">الإجمالي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-lg">
              <span>المجموع الفرعي:</span>
              <span className="font-semibold">{calculateSubtotal().toFixed(2)} ج.م</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>الضريبة (14%):</span>
              <span className="font-semibold">{calculateTax().toFixed(2)} ج.م</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-xl font-bold text-primary">
              <span>الإجمالي:</span>
              <span>{calculateTotal().toFixed(2)} ج.م</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>الأصناف</CardTitle>
            <Button onClick={addLine} size="sm" variant="outline">
              <Plus className="w-4 h-4 ml-2" />
              إضافة صنف
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الصنف (SKU)</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                  <TableHead className="text-right">السعر</TableHead>
                  <TableHead className="text-right">المجموع</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={line.sku}
                        onChange={(e) => handleSkuChange(index, e.target.value)}
                        placeholder="COLA-001"
                        list="items-list"
                      />
                      <datalist id="items-list">
                        <option value="COLA-001">كوكاكولا - 15 ج.م</option>
                        <option value="WATER-001">ماء معدني - 10 ج.م</option>
                        <option value="CHIPS-001">شيبس - 20 ج.م</option>
                      </datalist>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={line.qty || ""}
                        onChange={(e) =>
                          updateLine(index, "qty", Number(e.target.value))
                        }
                        placeholder="1"
                        min="1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={line.unitPrice || ""}
                        onChange={(e) =>
                          updateLine(index, "unitPrice", Number(e.target.value))
                        }
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell className="font-semibold">
                      {(line.qty * line.unitPrice).toFixed(2)} ج.م
                    </TableCell>
                    <TableCell>
                      {lines.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLine(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => window.history.back()}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
              <DollarSign className="w-5 h-5 ml-2" />
              {isSubmitting ? "جاري الحفظ..." : `دفع ${calculateTotal().toFixed(2)} ج.م`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
