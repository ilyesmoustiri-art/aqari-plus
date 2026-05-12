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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  MapPin,
  Maximize,
  BedDouble,
  Bath,
  Star,
  Plus,
  Eye,
  Trash2,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

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
}

export default function MyProperties() {
  const { setCurrentPage, setSelectedPropertyId, user } = useAppStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProperties();
  }, []);

  async function fetchMyProperties() {
    setLoading(true);
    try {
      const res = await fetch("/api/properties/mine");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProperties(data);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`هل أنت متأكد من حذف "${title}"؟`)) return;
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("تم حذف العقار بنجاح");
        fetchMyProperties();
      } else {
        toast.error("فشل في حذف العقار");
      }
    } catch {
      toast.error("حدث خطأ أثناء الحذف");
    }
  }

  const handleViewProperty = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage("property-detail");
  };

  const availableCount = properties.filter(p => p.status === "متاح").length;
  const soldCount = properties.filter(p => p.status === "مباع").length;
  const reservedCount = properties.filter(p => p.status === "محجوز").length;

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl mb-2">عقاراتي</h1>
            <p className="text-muted-foreground">
              إدارة العقارات الخاصة بك
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={() => setCurrentPage("add-property")}
          >
            <Plus className="h-4 w-4" />
            إضافة عقار جديد
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{properties.length}</p>
              <p className="text-xs text-muted-foreground">إجمالي عقاراتي</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{availableCount}</p>
              <p className="text-xs text-muted-foreground">متاح</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{soldCount}</p>
              <p className="text-xs text-muted-foreground">مباع</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{reservedCount}</p>
              <p className="text-xs text-muted-foreground">محجوز</p>
            </CardContent>
          </Card>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <Card className="py-16">
            <CardContent className="text-center">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد عقارات</h3>
              <p className="text-muted-foreground mb-4">
                لم تقم بإضافة أي عقارات بعد
              </p>
              <Button onClick={() => setCurrentPage("add-property")} className="gap-2">
                <Plus className="h-4 w-4" />
                أضف عقارك الأول
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                {/* Image */}
                <div
                  className="relative h-48 overflow-hidden cursor-pointer"
                  onClick={() => handleViewProperty(property.id)}
                >
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <Maximize className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {property.featured && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 ml-1 fill-current" />
                        مميز
                      </Badge>
                    )}
                    <Badge
                      className={
                        property.status === "متاح"
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : property.status === "محجوز"
                          ? "bg-amber-500 hover:bg-amber-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }
                    >
                      {property.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="text-xl font-bold text-white drop-shadow-lg">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  <h3 className="mb-2 text-base font-bold line-clamp-1 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-1">
                      {property.city} - {property.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    {property.rooms && (
                      <div className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4" />
                        <span>{property.rooms} غرف</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms} حمامات</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Maximize className="h-4 w-4" />
                      <span>{property.area} م²</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => handleViewProperty(property.id)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      عرض
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-red-50"
                      onClick={() => handleDelete(property.id, property.title)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
