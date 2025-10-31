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
import { Plus, Trash2, Save, PackageCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GRNLine {
  sku: string;
  qty: number;
  unitCost: number;
  lotNumber: string;
  expiryDate: string;
}

export default function GoodsReceipt() {
  const { toast } = useToast();
  const [warehouseCode, setWarehouseCode] = useState("RESTAURANT");
  const [supplierName, setSupplierName] = useState("");
  const [lines, setLines] = useState<GRNLine[]>([
    { sku: "", qty: 0, unitCost: 0, lotNumber: "", expiryDate: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLine = () => {
    setLines([
      ...lines,
      { sku: "", qty: 0, unitCost: 0, lotNumber: "", expiryDate: "" },
    ]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof GRNLine, value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const handleSubmit = async () => {
    if (!supplierName.trim()) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى إدخال اسم المورد",
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
      const response = await fetch("/api/inventory/grn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warehouseCode,
          supplierName,
          items: validLines,
        }),
      });

      if (!response.ok) {
        let errorMessage = "فشل إنشاء محضر الاستلام";
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch {
          // If response is not JSON, get text
          const text = await response.text();
          console.error("Server error:", text);
          errorMessage = `خطأ في السيرفر (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      toast({
        title: "تم بنجاح",
        description: `تم إنشاء محضر الاستلام: ${result.grnNumber}`,
      });

      // Reset form
      setSupplierName("");
      setLines([{ sku: "", qty: 0, unitCost: 0, lotNumber: "", expiryDate: "" }]);
    } catch (err: any) {
      console.error("GRN Error:", err);
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
          <PackageCheck className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">محضر استلام بضاعة (GRN)</h1>
        </div>
        <p className="text-muted-foreground">
          إضافة بضاعة واردة من المورد إلى المخزن
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">معلومات الاستلام</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="warehouse">المخزن</Label>
              <Select value={warehouseCode} onValueChange={setWarehouseCode}>
                <SelectTrigger id="warehouse">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESTAURANT">مخزن المطعم</SelectItem>
                  <SelectItem value="CAFETERIA">مخزن الكافتيريا</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="supplier">اسم المورد</Label>
              <Input
                id="supplier"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="أدخل اسم المورد"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>الأصناف المستلمة</CardTitle>
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
                  <TableHead className="text-right">التكلفة الوحدة</TableHead>
                  <TableHead className="text-right">رقم الدفعة</TableHead>
                  <TableHead className="text-right">تاريخ الانتهاء</TableHead>
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
                      <Input
                        type="number"
                        value={line.unitCost || ""}
                        onChange={(e) =>
                          updateLine(index, "unitCost", Number(e.target.value))
                        }
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={line.lotNumber}
                        onChange={(e) =>
                          updateLine(index, "lotNumber", e.target.value)
                        }
                        placeholder="LOT-123"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={line.expiryDate}
                        onChange={(e) =>
                          updateLine(index, "expiryDate", e.target.value)
                        }
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
              {isSubmitting ? "جاري الحفظ..." : "حفظ المحضر"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
