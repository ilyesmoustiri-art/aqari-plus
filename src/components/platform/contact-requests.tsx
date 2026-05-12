"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { formatDate } from "@/lib/utils-format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Phone,
  Mail,
  MessageSquare,
  Eye,
  EyeOff,
  User,
  Clock,
  Building2,
  Trash2,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface ContactRequest {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  propertyId: string | null;
  message: string;
  read: boolean;
  createdAt: string;
  property?: { title: string } | null;
}

export default function ContactRequests() {
  const { setCurrentPage, setSelectedPropertyId, user } = useAppStore();
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching contact requests:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(id: string, currentRead: boolean) {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (res.ok) {
        toast.success(currentRead ? "تم تعليم الطلب كغير مقروء" : "تم تعليم الطلب كمقروء");
        fetchRequests();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("تم حذف الطلب بنجاح");
        if (selectedRequest?.id === id) {
          setSelectedRequest(null);
        }
        fetchRequests();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  }

  const handleViewProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setCurrentPage("property-detail");
  };

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl mb-2">طلبات الاتصال</h1>
          <p className="text-muted-foreground">
            جميع طلبات الاتصال والاستفسارات المرسلة عبر المنصة
            {user?.role === "مدير" && " - يمكن للمدير إدارة جميع الطلبات"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{requests.length}</p>
                <p className="text-xs text-muted-foreground">إجمالي الطلبات</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <EyeOff className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {requests.filter((r) => !r.read).length}
                </p>
                <p className="text-xs text-muted-foreground">غير مقروء</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {requests.filter((r) => r.read).length}
                </p>
                <p className="text-xs text-muted-foreground">مقروء</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              قائمة الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="h-14 w-14 mx-auto text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
                <p className="text-muted-foreground">
                  لم يتم استلام أي طلبات اتصال بعد
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-sm ${
                      !request.read
                        ? "border-primary/30 bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                            !request.read
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {request.name}
                            </span>
                            {!request.read && (
                              <Badge className="h-5 px-1.5 text-xs bg-primary text-primary-foreground">
                                جديد
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {request.message}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {request.phone}
                            </span>
                            {request.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {request.email}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(request.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {request.property && (
                          <Badge variant="outline" className="text-xs">
                            <Building2 className="h-3 w-3 ml-1" />
                            {request.property.title}
                          </Badge>
                        )}
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleMarkAsRead(request.id, request.read)}
                            title={request.read ? "تعليم كغير مقروء" : "تعليم كمقروء"}
                          >
                            {request.read ? (
                              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : (
                              <Eye className="h-3.5 w-3.5 text-primary" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(request.id)}
                            title="حذف الطلب"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        >
          {selectedRequest && (
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  تفاصيل الطلب
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">الاسم</p>
                    <p className="font-medium">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">الهاتف</p>
                    <p className="font-medium" dir="ltr">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">البريد الإلكتروني</p>
                    <p className="font-medium" dir="ltr">
                      {selectedRequest.email || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">التاريخ</p>
                    <p className="font-medium">{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                </div>
                {selectedRequest.property && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">العقار</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-primary"
                      onClick={() => {
                        if (selectedRequest.propertyId) {
                          handleViewProperty(selectedRequest.propertyId);
                          setSelectedRequest(null);
                        }
                      }}
                    >
                      <Building2 className="h-3 w-3" />
                      {selectedRequest.property.title}
                    </Button>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">الرسالة</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg leading-relaxed">
                    {selectedRequest.message}
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => {
                      handleMarkAsRead(selectedRequest.id, selectedRequest.read);
                      setSelectedRequest(null);
                    }}
                  >
                    {selectedRequest.read ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        تعليم كغير مقروء
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        تعليم كمقروء
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={() => {
                      handleDelete(selectedRequest.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف الطلب
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
}
