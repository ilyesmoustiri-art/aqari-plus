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
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Maximize,
  BedDouble,
  Bath,
  ArrowLeft,
  Star,
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

export default function FeaturedProperties() {
  const { setCurrentPage, setSelectedPropertyId } = useAppStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/properties?featured=true");
        const data = await res.json();
        setProperties(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const handleViewProperty = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage("property-detail");
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-primary fill-primary" />
              <h2 className="text-2xl font-bold md:text-3xl">عقارات مميزة</h2>
            </div>
            <p className="text-muted-foreground">
              اكتشف أفضل العقارات المختارة بعناية لتحقيق أعلى معايير الجودة والراحة
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage("properties")}
            className="gap-2"
          >
            عرض الكل
            <ArrowLeft className="h-4 w-4" />
          </Button>
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
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {property.featured && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 ml-1 fill-current" />
                        مميز
                      </Badge>
                    )}
                    <Badge
                      variant={
                        property.status === "متاح"
                          ? "default"
                          : "destructive"
                      }
                      className={
                        property.status === "متاح"
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
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
                    <span className="line-clamp-1">{property.city} - {property.address}</span>
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
    </section>
  );
}
