"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { formatPrice, formatDate } from "@/lib/utils-format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Maximize,
  BedDouble,
  Bath,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Tag,
  Home,
  CheckCircle2,
  Share2,
  Heart,
  Building2,
  Copy,
  Send,
} from "lucide-react";
import { toast } from "sonner";

interface PropertyOwner {
  id: string;
  name: string;
  phone: string | null;
}

interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  area: number;
  rooms: number | null;
  bathrooms: number | null;
  city: string;
  address: string;
  image: string | null;
  featured: boolean;
  status: string;
  createdAt: string;
  user?: PropertyOwner | null;
}

export default function PropertyDetail() {
  const { selectedPropertyId, setCurrentPage, setSelectedPropertyId, user, isAuthenticated } = useAppStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [messageForm, setMessageForm] = useState({
    message: "",
  });
  const [directMessageOpen, setDirectMessageOpen] = useState(false);
  const [directMessageText, setDirectMessageText] = useState("");

  useEffect(() => {
    if (selectedPropertyId) {
      fetchProperty();
      // Load favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorited(favorites.includes(selectedPropertyId));
    }
  }, [selectedPropertyId]);

  async function fetchProperty() {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${selectedPropertyId}`);
      if (res.ok) {
        const data = await res.json();
        setProperty(data);
        // Pre-fill form if user is logged in
        if (isAuthenticated && user) {
          setFormData(prev => ({
            ...prev,
            name: user.name || "",
            phone: user.phone || "",
            email: user.email || "",
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitContact() {
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          propertyId: selectedPropertyId,
          userId: user?.id || null,
        }),
      });
      if (res.ok) {
        toast.success("تم إرسال طلب الاتصال بنجاح!");
        setContactOpen(false);
        setFormData(prev => ({ ...prev, message: "" }));
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإرسال");
    } finally {
      setSending(false);
    }
  }

  async function handleSendMessage() {
    if (!messageForm.message) {
      toast.error("يرجى كتابة رسالة");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name || formData.name || "مستخدم",
          phone: user?.phone || formData.phone || "",
          email: user?.email || formData.email || "",
          message: messageForm.message,
          propertyId: selectedPropertyId,
          userId: user?.id || null,
        }),
      });
      if (res.ok) {
        toast.success("تم إرسال طلب الاتصال بنجاح!");
        setMessageOpen(false);
        setMessageForm({ message: "" });
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإرسال");
    } finally {
      setSending(false);
    }
  }

  async function handleDirectMessage() {
    if (!isAuthenticated) {
      setCurrentPage("login");
      toast.info("يرجى تسجيل الدخول أولاً");
      return;
    }
    if (!directMessageText.trim()) {
      toast.error("يرجى كتابة رسالة");
      return;
    }
    if (!property?.user?.id) {
      toast.error("لا يوجد مالك لهذا العقار");
      return;
    }
    if (property.user.id === user?.id) {
      toast.error("لا يمكنك إرسال رسالة لنفسك");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: property.user.id,
          content: directMessageText.trim(),
          propertyId: selectedPropertyId,
        }),
      });
      if (res.ok) {
        toast.success("تم إرسال الرسالة بنجاح!");
        setDirectMessageOpen(false);
        setDirectMessageText("");
        // Navigate to messages page with this conversation
        setCurrentPage("messages");
      } else {
        toast.error("حدث خطأ أثناء الإرسال");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإرسال");
    } finally {
      setSending(false);
    }
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: property?.title || "عقار",
        text: `عقار للبيع: ${property?.title} - ${formatPrice(property?.price || 0)}`,
        url: url,
      }).catch(() => {
        fallbackCopy(url);
      });
    } else {
      fallbackCopy(url);
    }
  }

  function fallbackCopy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("تم نسخ رابط العقار!");
    }).catch(() => {
      toast.error("فشل في نسخ الرابط");
    });
  }

  function handleToggleFavorite() {
    const favorites: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorited) {
      const updated = favorites.filter(id => id !== selectedPropertyId);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorited(false);
      toast.success("تم إزالة العقار من المفضلة");
    } else {
      favorites.push(selectedPropertyId || "");
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorited(true);
      toast.success("تم إضافة العقار إلى المفضلة");
    }
  }

  function handleCall() {
    if (property?.user?.phone) {
      toast.info(`رقم الاتصال: ${property.user.phone}`);
    } else {
      toast.info("رقم الاتصال: +213 555 123 456");
    }
  }

  function handleGoToMessages() {
    if (!isAuthenticated) {
      setCurrentPage("login");
      toast.info("يرجى تسجيل الدخول أولاً");
      return;
    }
    if (!property?.user?.id) {
      toast.error("لا يوجد مالك لهذا العقار");
      return;
    }
    if (property.user.id === user?.id) {
      toast.error("هذا عقارك");
      return;
    }
    setDirectMessageOpen(true);
  }

  if (loading) {
    return (
      <div className="py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-80 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-60 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="py-20 px-4 text-center">
        <Building2 className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
        <h3 className="text-lg font-semibold mb-2">لم يتم العثور على العقار</h3>
        <Button variant="outline" onClick={() => setCurrentPage("properties")}>
          العودة للعقارات
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button
            variant="link"
            className="h-auto p-0 text-muted-foreground"
            onClick={() => setCurrentPage("home")}
          >
            الرئيسية
          </Button>
          <span>/</span>
          <Button
            variant="link"
            className="h-auto p-0 text-muted-foreground"
            onClick={() => setCurrentPage("properties")}
          >
            العقارات
          </Button>
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">
            {property.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative h-72 sm:h-96 lg:h-[480px] rounded-xl overflow-hidden">
              {property.image ? (
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <Maximize className="h-20 w-20 text-muted-foreground/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute top-4 right-4 flex gap-2">
                {property.featured && (
                  <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5 ml-1" />
                    عقار مميز
                  </Badge>
                )}
                <Badge
                  className={`text-sm px-3 py-1 ${
                    property.status === "متاح"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {property.status}
                </Badge>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-10 w-10 backdrop-blur"
                  onClick={handleShare}
                  title="مشاركة العقار"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className={`rounded-full h-10 w-10 backdrop-blur ${isFavorited ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
                  onClick={handleToggleFavorite}
                  title="إضافة للمفضلة"
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">{property.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location */}
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                  <span>
                    {property.address}، {property.city}
                  </span>
                </div>

                <Separator />

                {/* Features Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Tag className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">النوع</p>
                    <p className="font-semibold text-sm">{property.type}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Maximize className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">المساحة</p>
                    <p className="font-semibold text-sm">{property.area} م²</p>
                  </div>
                  {property.rooms && (
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <BedDouble className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xs text-muted-foreground">الغرف</p>
                      <p className="font-semibold text-sm">{property.rooms}</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Bath className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xs text-muted-foreground">الحمامات</p>
                      <p className="font-semibold text-sm">{property.bathrooms}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-3">الوصف</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>تاريخ الإضافة: {formatDate(property.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-1">السعر</p>
                <p className="text-3xl font-bold text-primary mb-6">
                  {formatPrice(property.price)}
                </p>
                <div className="space-y-3">
                  <Button
                    className="w-full h-12 text-base gap-2"
                    onClick={() => setContactOpen(true)}
                  >
                    <MessageSquare className="h-5 w-5" />
                    تواصل معنا
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 h-11 gap-2" onClick={handleCall}>
                      <Phone className="h-4 w-4" />
                      اتصل
                    </Button>
                    <Button variant="outline" className="flex-1 h-11 gap-2" onClick={handleGoToMessages}>
                      <Mail className="h-4 w-4" />
                      مراسلة المالك
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Summary */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    النوع
                  </span>
                  <span className="font-medium text-sm">{property.type}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Maximize className="h-4 w-4" />
                    المساحة
                  </span>
                  <span className="font-medium text-sm">{property.area} م²</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <BedDouble className="h-4 w-4" />
                    الغرف
                  </span>
                  <span className="font-medium text-sm">
                    {property.rooms || "-"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Bath className="h-4 w-4" />
                    الحمامات
                  </span>
                  <span className="font-medium text-sm">
                    {property.bathrooms || "-"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    المدينة
                  </span>
                  <span className="font-medium text-sm">{property.city}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    الحالة
                  </span>
                  <Badge
                    className={
                      property.status === "متاح"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }
                  >
                    {property.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Contact Dialog */}
            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>تواصل بخصوص هذا العقار</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      الاسم الكامل *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      رقم الهاتف *
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="أدخل رقم هاتفك"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      البريد الإلكتروني
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="أدخل بريدك الإلكتروني"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      الرسالة *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="اكتب رسالتك..."
                      rows={4}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleSubmitContact}
                    disabled={sending}
                  >
                    {sending ? "جاري الإرسال..." : "إرسال الطلب"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Quick Message Dialog - Contact Request */}
            <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>أرسل طلب اتصال بخصوص {property.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      رسالتك *
                    </label>
                    <Textarea
                      value={messageForm.message}
                      onChange={(e) =>
                        setMessageForm({ message: e.target.value })
                      }
                      placeholder="اكتب رسالتك الاستفسارية..."
                      rows={5}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleSendMessage}
                    disabled={sending}
                  >
                    {sending ? "جاري الإرسال..." : "إرسال طلب الاتصال"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Direct Message Dialog - Chat with Owner */}
            <Dialog open={directMessageOpen} onOpenChange={setDirectMessageOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    مراسلة {property.user?.name || "المالك"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {property.user && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {property.user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{property.user.name}</p>
                        {property.user.phone && (
                          <p className="text-xs text-muted-foreground" dir="ltr">{property.user.phone}</p>
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      رسالتك *
                    </label>
                    <Textarea
                      value={directMessageText}
                      onChange={(e) =>
                        setDirectMessageText(e.target.value)
                      }
                      placeholder={`اكتب رسالتك بخصوص ${property.title}...`}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 gap-2"
                      onClick={handleDirectMessage}
                      disabled={sending}
                    >
                      <Send className="h-4 w-4" />
                      {sending ? "جاري الإرسال..." : "إرسال رسالة"}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        setDirectMessageOpen(false);
                        if (property?.user?.id && property.user.id !== user?.id) {
                          setCurrentPage("messages");
                        }
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                      فتح المحادثة
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
