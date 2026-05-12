"use client";

import { useEffect, useState } from "react";
import { formatPrice, formatDate } from "@/lib/utils-format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/store/app-store";

interface TaxPayment {
  id: string;
  propertyId: string | null;
  userId: string | null;
  type: string;
  amount: number;
  status: string;
  dueDate: string;
  paidDate: string | null;
  reference: string | null;
  description: string;
  createdAt: string;
  property?: { title: string; city: string } | null;
}

export default function TaxManagement() {
  const { user } = useAppStore();
  const [payments, setPayments] = useState<TaxPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [filterType, setFilterType] = useState("الكل");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTax, setNewTax] = useState({
    type: "ضريبة العقار",
    amount: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    fetchPayments();
  }, [filterStatus, filterType]);

  async function fetchPayments() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "الكل") params.set("status", filterStatus);
      if (filterType !== "الكل") params.set("type", filterType);
      const res = await fetch(`/api/taxes?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPayments(data);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTax() {
    if (!newTax.amount || !newTax.description || !newTax.dueDate) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    try {
      const res = await fetch("/api/taxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newTax.type,
          amount: parseFloat(newTax.amount),
          description: newTax.description,
          dueDate: newTax.dueDate,
          userId: user?.id || null,
          reference: `TAX-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        }),
      });
      if (res.ok) {
        toast.success("تم إضافة الضريبة بنجاح!");
        setDialogOpen(false);
        setNewTax({ type: "ضريبة العقار", amount: "", description: "", dueDate: "" });
        fetchPayments();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة");
    }
  }

  async function handleMarkAsPaid(id: string) {
    try {
      const res = await fetch(`/api/taxes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "مدفوع",
          paidDate: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        toast.success("تم تسجيل الدفع بنجاح!");
        fetchPayments();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه الضريبة؟")) return;
    try {
      const res = await fetch(`/api/taxes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("تم حذف الضريبة بنجاح");
        fetchPayments();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  }

  // Calculate stats
  const totalPaid = payments
    .filter((p) => p.status === "مدفوع")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === "قيد الانتظار")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments
    .filter((p) => p.status === "متأخر")
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مدفوع":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 ml-1" />
            مدفوع
          </Badge>
        );
      case "قيد الانتظار":
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100">
            <Clock className="h-3 w-3 ml-1" />
            قيد الانتظار
          </Badge>
        );
      case "متأخر":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100">
            <AlertTriangle className="h-3 w-3 ml-1" />
            متأخر
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl mb-2">إدارة الجباية</h1>
            <p className="text-muted-foreground">
              تتبع الضرائب والرسوم العقارية وإدارة المدفوعات
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة ضريبة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة ضريبة جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">نوع الضريبة</label>
                  <Select
                    value={newTax.type}
                    onValueChange={(v) => setNewTax({ ...newTax, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ضريبة العقار">ضريبة العقار</SelectItem>
                      <SelectItem value="ضريبة الأراضي">ضريبة الأراضي</SelectItem>
                      <SelectItem value="ضريبة التسجيل">ضريبة التسجيل</SelectItem>
                      <SelectItem value="ضريبة الخدمات البلدية">
                        ضريبة الخدمات البلدية
                      </SelectItem>
                      <SelectItem value="ضريبة المهنية">ضريبة المهنية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">المبلغ (د.ج)</label>
                  <Input
                    type="number"
                    value={newTax.amount}
                    onChange={(e) =>
                      setNewTax({ ...newTax, amount: e.target.value })
                    }
                    placeholder="أدخل المبلغ"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    تاريخ الاستحقاق
                  </label>
                  <Input
                    type="date"
                    value={newTax.dueDate}
                    onChange={(e) =>
                      setNewTax({ ...newTax, dueDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">الوصف</label>
                  <Textarea
                    value={newTax.description}
                    onChange={(e) =>
                      setNewTax({ ...newTax, description: e.target.value })
                    }
                    placeholder="وصف الضريبة..."
                    rows={3}
                  />
                </div>
                <Button className="w-full" onClick={handleAddTax}>
                  إضافة
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-green-200 dark:border-green-900/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">إجمالي المدفوعات</span>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-green-600">
                {formatPrice(totalPaid)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {payments.filter((p) => p.status === "مدفوع").length} عملية دفع
              </p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 dark:border-amber-900/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">قيد الانتظار</span>
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-amber-600">
                {formatPrice(totalPending)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {payments.filter((p) => p.status === "قيد الانتظار").length} عملية دفع
              </p>
            </CardContent>
          </Card>
          <Card className="border-red-200 dark:border-red-900/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">متأخرات</span>
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-red-600">
                {formatPrice(totalOverdue)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {payments.filter((p) => p.status === "متأخر").length} عملية دفع
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  الحالة
                </label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الكل">الكل</SelectItem>
                    <SelectItem value="مدفوع">مدفوع</SelectItem>
                    <SelectItem value="قيد الانتظار">قيد الانتظار</SelectItem>
                    <SelectItem value="متأخر">متأخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  نوع الضريبة
                </label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الكل">الكل</SelectItem>
                    <SelectItem value="ضريبة العقار">ضريبة العقار</SelectItem>
                    <SelectItem value="ضريبة الأراضي">ضريبة الأراضي</SelectItem>
                    <SelectItem value="ضريبة التسجيل">ضريبة التسجيل</SelectItem>
                    <SelectItem value="ضريبة الخدمات البلدية">
                      ضريبة الخدمات البلدية
                    </SelectItem>
                    <SelectItem value="ضريبة المهنية">ضريبة المهنية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              سجل المدفوعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 mx-auto text-muted-foreground/20 mb-3" />
                <p className="text-muted-foreground">لا توجد مدفوعات</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المرجع</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>العقار</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الاستحقاق</TableHead>
                      <TableHead>تاريخ الدفع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-xs">
                          {payment.reference}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {payment.type}
                        </TableCell>
                        <TableCell className="max-w-48 text-sm text-muted-foreground truncate">
                          {payment.description}
                        </TableCell>
                        <TableCell className="text-sm">
                          {payment.property?.title || "-"}
                        </TableCell>
                        <TableCell className="font-semibold text-sm">
                          {formatPrice(payment.amount)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(payment.dueDate)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {payment.paidDate
                            ? formatDate(payment.paidDate)
                            : "-"}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {payment.status !== "مدفوع" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs gap-1 text-green-600 border-green-300 hover:bg-green-50"
                                onClick={() => handleMarkAsPaid(payment.id)}
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                دفع
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-xs gap-1 text-destructive hover:text-destructive hover:bg-red-50"
                              onClick={() => handleDelete(payment.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
