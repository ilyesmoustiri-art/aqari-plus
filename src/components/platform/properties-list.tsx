"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { formatPrice } from "@/lib/utils-format";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Maximize,
  BedDouble,
  Bath,
  Star,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

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
}

const cities = [
  "الكل",
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
];

const types = [
  "الكل",
  "شقة",
  "فيلا",
  "منزل",
  "مكتب",
  "محل تجاري",
  "أرض",
  "مبنى",
];

export default function PropertiesList() {
  const {
    setCurrentPage,
    setSelectedPropertyId,
    searchQuery,
    filterCity,
    filterType,
    filterMinPrice,
    filterMaxPrice,
    filterRooms,
    setSearchQuery,
    setFilterCity,
    setFilterType,
    setFilterMinPrice,
    setFilterMaxPrice,
    setFilterRooms,
    resetFilters,
  } = useAppStore();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [filterCity, filterType, filterMinPrice, filterMaxPrice, filterRooms, searchQuery]);

  async function fetchProperties() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCity && filterCity !== "الكل") params.set("city", filterCity);
      if (filterType && filterType !== "الكل") params.set("type", filterType);
      if (filterMinPrice) params.set("minPrice", filterMinPrice);
      if (filterMaxPrice) params.set("maxPrice", filterMaxPrice);
      if (filterRooms) params.set("rooms", filterRooms);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/properties?${params.toString()}`);
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

  const handleViewProperty = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage("property-detail");
  };

  const hasActiveFilters =
    filterCity !== "الكل" ||
    filterType !== "الكل" ||
    filterMinPrice ||
    filterMaxPrice ||
    filterRooms;

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl mb-2">العقارات المتاحة</h1>
          <p className="text-muted-foreground">
            تصفح جميع العقارات المتاحة وابحث عن عقارك المثالي
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن عقار..."
                className="h-11 pr-10 rounded-xl"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-11 gap-2 rounded-xl"
            >
              <SlidersHorizontal className="h-4 w-4" />
              الفلاتر
              {hasActiveFilters && (
                <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full bg-primary text-primary-foreground">
                  !
                </Badge>
              )}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    المدينة
                  </label>
                  <Select value={filterCity} onValueChange={setFilterCity}>
                    <SelectTrigger className="h-10 rounded-lg">
                      <SelectValue />
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
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    نوع العقار
                  </label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="h-10 rounded-lg">
                      <SelectValue />
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
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    السعر الأدنى
                  </label>
                  <Input
                    type="number"
                    value={filterMinPrice}
                    onChange={(e) => setFilterMinPrice(e.target.value)}
                    placeholder="الحد الأدنى"
                    className="h-10 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    السعر الأقصى
                  </label>
                  <Input
                    type="number"
                    value={filterMaxPrice}
                    onChange={(e) => setFilterMaxPrice(e.target.value)}
                    placeholder="الحد الأقصى"
                    className="h-10 rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-end gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      عدد الغرف
                    </label>
                    <Select value={filterRooms} onValueChange={setFilterRooms}>
                      <SelectTrigger className="h-10 rounded-lg">
                        <SelectValue placeholder="الكل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="الكل">الكل</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {hasActiveFilters && (
                <div className="mt-3 pt-3 border-t flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="gap-1 text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                    مسح الفلاتر
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {loading ? "جاري البحث..." : `تم العثور على ${properties.length} عقار`}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
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
          <div className="text-center py-20">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
            <p className="text-muted-foreground mb-4">
              لم يتم العثور على عقارات تطابق معايير البحث
            </p>
            <Button variant="outline" onClick={resetFilters}>
              مسح الفلاتر
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                onClick={() => handleViewProperty(property.id)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
