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
import { Plus, Trash2, Save, ArrowRightLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TransferLine {
  sku: string;
  qty: number;
}

export default function StockTransfer() {
  const { toast } = useToast();
  const [fromWarehouse, setFromWarehouse] = useState("RESTAURANT");
  const [toWarehouse, setToWarehouse] = useState("KITCHEN");
  const [lines, setLines] = useState<TransferLine[]>([{ sku: "", qty: 0 }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLine = () => {
    setLines([...lines, { sku: "", qty: 0 }]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof TransferLine, value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const handleSubmit = async () => {
    // Must be different warehouses
    if (fromWarehouse === toWarehouse) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يجب اختيار مخزنين مختلفين",
      });
      return;
    }

    const validLines = lines.filter((l) => l.sku && l.qty > 0);
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
      const response = await fetch("/api/inventory/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromWarehouse,
          toWarehouse,
          items: validLines,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل إنشاء التحويل");
      }

      const result = await response.json();
      toast({
        title: "تم بنجاح",
        description: `تم إنشاء التحويل: ${result.transferNumber}`,
      });

      // Reset form
      setLines([{ sku: "", qty: 0 }]);
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

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ArrowRightLeft className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">تحويل بين المخازن</h1>
        </div>
        <p className="text-muted-foreground">
          نقل الأصناف من مخزن إلى آخر
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">من المخزن</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">المخزن</label>
              <Select value={fromWarehouse} onValueChange={setFromWarehouse}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESTAURANT">مخزن المطعم</SelectItem>
                  <SelectItem value="CAFETERIA">مخزن الكافتيريا</SelectItem>
                  <SelectItem value="KITCHEN">المطبخ</SelectItem>
                  <SelectItem value="BUFFET">البوفيه</SelectItem>
                  <SelectItem value="FRIDGE">الثلاجة</SelectItem>
                  <SelectItem value="ROOM-101">منى بار غرفة 101</SelectItem>
                  <SelectItem value="ROOM-102">منى بار غرفة 102</SelectItem>
                  <SelectItem value="ROOM-103">منى بار غرفة 103</SelectItem>
                  <SelectItem value="ROOM-104">منى بار غرفة 104</SelectItem>
                  <SelectItem value="ROOM-105">منى بار غرفة 105</SelectItem>
                  <SelectItem value="ROOM-106">منى بار غرفة 106</SelectItem>
                  <SelectItem value="ROOM-107">منى بار غرفة 107</SelectItem>
                  <SelectItem value="ROOM-108">منى بار غرفة 108</SelectItem>
                  <SelectItem value="ROOM-109">منى بار غرفة 109</SelectItem>
                  <SelectItem value="ROOM-200">منى بار غرفة 200</SelectItem>
                  <SelectItem value="ROOM-201">منى بار غرفة 201</SelectItem>
                  <SelectItem value="ROOM-202">منى بار غرفة 202</SelectItem>
                  <SelectItem value="ROOM-203">منى بار غرفة 203</SelectItem>
                  <SelectItem value="ROOM-204">منى بار غرفة 204</SelectItem>
                  <SelectItem value="ROOM-205">منى بار غرفة 205</SelectItem>
                  <SelectItem value="ROOM-206">منى بار غرفة 206</SelectItem>
                  <SelectItem value="ROOM-207">منى بار غرفة 207</SelectItem>
                  <SelectItem value="ROOM-208">منى بار غرفة 208</SelectItem>
                  <SelectItem value="ROOM-209">منى بار غرفة 209</SelectItem>
                  <SelectItem value="ROOM-210">منى بار غرفة 210</SelectItem>
                  <SelectItem value="ROOM-211">منى بار غرفة 211</SelectItem>
                  <SelectItem value="ROOM-212">منى بار غرفة 212</SelectItem>
                  <SelectItem value="ROOM-CH01">منى بار غرفة ch01</SelectItem>
                  <SelectItem value="ROOM-CH02">منى بار غرفة ch02</SelectItem>
                  <SelectItem value="ROOM-CH03">منى بار غرفة ch03</SelectItem>
                  <SelectItem value="ROOM-CH04">منى بار غرفة ch04</SelectItem>
                  <SelectItem value="ROOM-CH05">منى بار غرفة ch05</SelectItem>
                  <SelectItem value="ROOM-CH06">منى بار غرفة ch06</SelectItem>
                  <SelectItem value="ROOM-CH07">منى بار غرفة ch07</SelectItem>
                  <SelectItem value="ROOM-CH08">منى بار غرفة ch08</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">إلى المخزن</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">المخزن</label>
              <Select value={toWarehouse} onValueChange={setToWarehouse}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESTAURANT">مخزن المطعم</SelectItem>
                  <SelectItem value="CAFETERIA">مخزن الكافتيريا</SelectItem>
                  <SelectItem value="KITCHEN">المطبخ</SelectItem>
                  <SelectItem value="BUFFET">البوفيه</SelectItem>
                  <SelectItem value="FRIDGE">الثلاجة</SelectItem>
                  <SelectItem value="ROOM-101">منى بار غرفة 101</SelectItem>
                  <SelectItem value="ROOM-102">منى بار غرفة 102</SelectItem>
                  <SelectItem value="ROOM-103">منى بار غرفة 103</SelectItem>
                  <SelectItem value="ROOM-104">منى بار غرفة 104</SelectItem>
                  <SelectItem value="ROOM-105">منى بار غرفة 105</SelectItem>
                  <SelectItem value="ROOM-106">منى بار غرفة 106</SelectItem>
                  <SelectItem value="ROOM-107">منى بار غرفة 107</SelectItem>
                  <SelectItem value="ROOM-108">منى بار غرفة 108</SelectItem>
                  <SelectItem value="ROOM-109">منى بار غرفة 109</SelectItem>
                  <SelectItem value="ROOM-200">منى بار غرفة 200</SelectItem>
                  <SelectItem value="ROOM-201">منى بار غرفة 201</SelectItem>
                  <SelectItem value="ROOM-202">منى بار غرفة 202</SelectItem>
                  <SelectItem value="ROOM-203">منى بار غرفة 203</SelectItem>
                  <SelectItem value="ROOM-204">منى بار غرفة 204</SelectItem>
                  <SelectItem value="ROOM-205">منى بار غرفة 205</SelectItem>
                  <SelectItem value="ROOM-206">منى بار غرفة 206</SelectItem>
                  <SelectItem value="ROOM-207">منى بار غرفة 207</SelectItem>
                  <SelectItem value="ROOM-208">منى بار غرفة 208</SelectItem>
                  <SelectItem value="ROOM-209">منى بار غرفة 209</SelectItem>
                  <SelectItem value="ROOM-210">منى بار غرفة 210</SelectItem>
                  <SelectItem value="ROOM-211">منى بار غرفة 211</SelectItem>
                  <SelectItem value="ROOM-212">منى بار غرفة 212</SelectItem>
                  <SelectItem value="ROOM-CH01">منى بار غرفة ch01</SelectItem>
                  <SelectItem value="ROOM-CH02">منى بار غرفة ch02</SelectItem>
                  <SelectItem value="ROOM-CH03">منى بار غرفة ch03</SelectItem>
                  <SelectItem value="ROOM-CH04">منى بار غرفة ch04</SelectItem>
                  <SelectItem value="ROOM-CH05">منى بار غرفة ch05</SelectItem>
                  <SelectItem value="ROOM-CH06">منى بار غرفة ch06</SelectItem>
                  <SelectItem value="ROOM-CH07">منى بار غرفة ch07</SelectItem>
                  <SelectItem value="ROOM-CH08">منى بار غرفة ch08</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>الأصناف المحولة</CardTitle>
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
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={line.sku}
                        onChange={(e) => updateLine(index, "sku", e.target.value)}
                        placeholder="RICE-001"
                        list="items-list"
                      />
                      <datalist id="items-list">
                        <option value="RICE-001">أرز بسمتي</option>
                        <option value="CHICKEN-001">دجاج طازج</option>
                        <option value="COLA-001">كوكاكولا</option>
                        <option value="WATER-001">ماء معدني</option>
                        <option value="CHIPS-001">شيبس</option>
                      </datalist>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={line.qty || ""}
                        onChange={(e) =>
                          updateLine(index, "qty", Number(e.target.value))
                        }
                        placeholder="0"
                        min="0"
                      />
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
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="w-4 h-4 ml-2" />
              {isSubmitting ? "جاري الحفظ..." : "تنفيذ التحويل"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
