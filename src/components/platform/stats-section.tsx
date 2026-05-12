"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils-format";
import { useAppStore } from "@/store/app-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
} from "lucide-react";

interface DashboardData {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  featuredProperties: number;
  propertiesByCity: { city: string; _count: { id: number } }[];
  propertiesByType: { type: string; _count: { id: number } }[];
  totalTaxPaid: number;
  totalTaxPending: number;
  totalTaxOverdue: number;
  totalTaxAmount: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
  recentProperties: {
    id: string;
    title: string;
    type: string;
    price: number;
    city: string;
    status: string;
  }[];
  totalPropertyArea: number;
  avgPrice: number;
  contactRequests: number;
  unreadRequests: number;
}

export default function StatsSection() {
  const { setCurrentPage, setSelectedPropertyId } = useAppStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return (
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse mb-3" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const stats = [
    {
      label: "إجمالي العقارات",
      value: data.totalProperties,
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "العقارات المتاحة",
      value: data.availableProperties,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "الضرائب المدفوعة",
      value: formatPrice(data.totalTaxPaid),
      icon: Receipt,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      label: "متوسط الأسعار",
      value: formatPrice(data.avgPrice),
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      label: "الضرائب المستحقة",
      value: formatPrice(data.totalTaxPending),
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      label: "الضرائب المتأخرة",
      value: formatPrice(data.totalTaxOverdue),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      label: "المساحة الإجمالية",
      value: `${data.totalPropertyArea.toLocaleString("ar-DZ")} م²`,
      icon: MapPin,
      color: "text-teal-600",
      bgColor: "bg-teal-100 dark:bg-teal-900/30",
    },
    {
      label: "طلبات الاتصال",
      value: data.contactRequests,
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold md:text-3xl mb-2">إحصائيات المنصة</h2>
          <p className="text-muted-foreground">
            نظرة شاملة على أداء المنصة والبيانات الرئيسية
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">
                      {stat.label}
                    </span>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-lg md:text-xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Properties */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">آخر العقارات المضافة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedPropertyId(property.id);
                    setCurrentPage("property-detail");
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{property.title}</p>
                    <p className="text-xs text-muted-foreground">{property.city} • {property.type}</p>
                  </div>
                  <div className="text-left mr-4">
                    <p className="font-bold text-sm text-primary">
                      {formatPrice(property.price)}
                    </p>
                    <span
                      className={`text-xs ${
                        property.status === "متاح"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
