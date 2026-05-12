"use client";

import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Upload,
  MapPin,
  Star,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

const cities = [
  "الجزائر العاصمة",
  "وهران",
  "قسنطينة",
  "سطيف",
  "البليدة",
  "تلمسان",
  "عنابة",
  "باتنة",
  "بيجاي",
  "المسيلة",
  "بجاية",
  "سكيكدة",
];

const types = [
  "شقة",
  "فيلا",
  "منزل",
  "مكتب",
  "محل تجاري",
  "أرض",
  "مبنى",
];

export default function AddProperty() {
  const { setCurrentPage } = useAppStore();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    price: "",
    area: "",
    rooms: "",
    bathrooms: "",
    city: "",
    address: "",
    image: "",
    featured: false,
    status: "متاح",
  });

  async function handleSubmit() {
    if (
      !formData.title ||
      !formData.description ||
      !formData.type ||
      !formData.price ||
      !formData.area ||
      !formData.city ||
      !formData.address
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          price: parseFloat(formData.price),
          area: parseFloat(formData.area),
          rooms: formData.rooms ? parseInt(formData.rooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          city: formData.city,
          address: formData.address,
          image: formData.image || null,
          featured: formData.featured,
          status: formData.status,
        }),
      });

      if (res.ok) {
        toast.success("تم إضافة العقار بنجاح!");
        setCurrentPage("properties");
      } else {
        toast.error("حدث خطأ أثناء الإضافة");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl mb-2">إضافة عقار جديد</h1>
          <p className="text-muted-foreground">
            أضف عقاراً جديداً إلى المنصة مع جميع التفاصيل والمعلومات
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4 text-primary" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-1.5 block">عنوان العقار *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="مثال: شقة فاخرة في وسط المدينة"
                />
              </div>
              <div>
                <Label className="mb-1.5 block">وصف العقار *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="اكتب وصفاً تفصيلياً للعقار..."
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">نوع العقار *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block">الحالة</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="متاح">متاح</SelectItem>
                      <SelectItem value="مباع">مباع</SelectItem>
                      <SelectItem value="محجوز">محجوز</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price & Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-primary" />
                السعر والمساحة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">السعر (د.ج) *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="أدخل السعر"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">المساحة (م²) *</Label>
                  <Input
                    type="number"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    placeholder="أدخل المساحة"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">عدد الغرف</Label>
                  <Input
                    type="number"
                    value={formData.rooms}
                    onChange={(e) =>
                      setFormData({ ...formData, rooms: e.target.value })
                    }
                    placeholder="اختياري"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">عدد الحمامات</Label>
                  <Input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bathrooms: e.target.value })
                    }
                    placeholder="اختياري"
                    dir="ltr"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-primary" />
                الموقع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-1.5 block">المدينة *</Label>
                <Select
                  value={formData.city}
                  onValueChange={(v) => setFormData({ ...formData, city: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">العنوان التفصيلي *</Label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="مثال: شارع ديدوش مراد، حيدرة"
                />
              </div>
            </CardContent>
          </Card>

          {/* Image & Featured */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Upload className="h-4 w-4 text-primary" />
                الصورة والظهور
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-1.5 block">رابط الصورة</Label>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="أدخل رابط صورة العقار (اختياري)"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  أدخل رابط صورة خارجية للعقار
                </p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <div>
                    <Label className="text-sm font-medium">عقار مميز</Label>
                    <p className="text-xs text-muted-foreground">
                      سيظهر في قسم العقارات المميزة
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              className="flex-1 h-12"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                "جاري الإضافة..."
              ) : (
                <span className="gap-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4" />
                  إضافة العقار
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              className="h-12 px-6"
              onClick={() => setCurrentPage("properties")}
            >
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
