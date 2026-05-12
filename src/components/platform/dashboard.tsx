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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
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
    image: string | null;
  }[];
  totalPropertyArea: number;
  avgPrice: number;
  contactRequests: number;
  unreadRequests: number;
}

export default function Dashboard() {
  const { setCurrentPage, setSelectedPropertyId } = useAppStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        const result = await res.json();
        setData(result);
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
      <div className="py-8 px-4">
        <div className="container mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const taxCompletionRate =
    data.totalTaxAmount > 0
      ? Math.round((data.totalTaxPaid / data.totalTaxAmount) * 100)
      : 0;

  const mainStats = [
    {
      title: "إجمالي العقارات",
      value: data.totalProperties,
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      change: `+${data.featuredProperties} مميز`,
      changeType: "positive" as const,
    },
    {
      title: "إجمالي الضرائب",
      value: formatPrice(data.totalTaxAmount),
      icon: Receipt,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      borderColor: "border-emerald-200 dark:border-emerald-900/50",
      change: `${data.paidCount} مدفوع من ${data.paidCount + data.pendingCount + data.overdueCount}`,
      changeType: "positive" as const,
    },
    {
      title: "نسبة التحصيل",
      value: `${taxCompletionRate}%`,
      icon: BarChart3,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      borderColor: "border-amber-200 dark:border-amber-900/50",
      change: `${data.pendingCount} قيد الانتظار`,
      changeType: "neutral" as const,
    },
    {
      title: "طلبات الاتصال",
      value: data.contactRequests,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      borderColor: "border-purple-200 dark:border-purple-900/50",
      change: `${data.unreadRequests} غير مقروء`,
      changeType: data.unreadRequests > 0 ? ("negative" as const) : ("positive" as const),
    },
  ];

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl mb-2">لوحة التحكم</h1>
          <p className="text-muted-foreground">
            نظرة شاملة على أداء منصة عقاري بلس
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {mainStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className={`border ${stat.borderColor}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </span>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600" />
                    ) : stat.changeType === "negative" ? (
                      <ArrowDownRight className="h-3 w-3 text-red-600" />
                    ) : (
                      <Activity className="h-3 w-3 text-amber-600" />
                    )}
                    <span
                      className={
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : stat.changeType === "negative"
                          ? "text-red-600"
                          : "text-amber-600"
                      }
                    >
                      {stat.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Properties by City */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-primary" />
                العقارات حسب المدينة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.propertiesByCity
                  .sort((a, b) => b._count.id - a._count.id)
                  .slice(0, 6)
                  .map((item) => {
                    const maxCount = Math.max(
                      ...data.propertiesByCity.map((c) => c._count.id)
                    );
                    const percentage = Math.round(
                      (item._count.id / maxCount) * 100
                    );
                    return (
                      <div key={item.city}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.city}</span>
                          <span className="text-sm text-muted-foreground">
                            {item._count.id} عقار
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Properties by Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="h-4 w-4 text-primary" />
                العقارات حسب النوع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.propertiesByType
                  .sort((a, b) => b._count.id - a._count.id)
                  .map((item) => {
                    const maxCount = Math.max(
                      ...data.propertiesByType.map((c) => c._count.id)
                    );
                    const percentage = Math.round(
                      (item._count.id / maxCount) * 100
                    );
                    return (
                      <div key={item.type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.type}</span>
                          <span className="text-sm text-muted-foreground">
                            {item._count.id} عقار
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Tax Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4 text-primary" />
                ملخص الضرائب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">المدفوع</span>
                </div>
                <span className="font-bold text-green-600">
                  {formatPrice(data.totalTaxPaid)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">قيد الانتظار</span>
                </div>
                <span className="font-bold text-amber-600">
                  {formatPrice(data.totalTaxPending)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">متأخرات</span>
                </div>
                <span className="font-bold text-red-600">
                  {formatPrice(data.totalTaxOverdue)}
                </span>
              </div>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">نسبة التحصيل</span>
                  <span className="text-sm font-bold text-primary">
                    {taxCompletionRate}%
                  </span>
                </div>
                <Progress value={taxCompletionRate} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Properties */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                آخر العقارات المضافة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedPropertyId(property.id);
                      setCurrentPage("property-detail");
                    }}
                  >
                    <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden shrink-0">
                      {property.image ? (
                        <img
                          src={property.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {property.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {property.city} &bull; {property.type}
                      </p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="font-bold text-sm text-primary">
                        {formatPrice(property.price)}
                      </p>
                      <Badge
                        className={`text-xs ${
                          property.status === "متاح"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {property.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => setCurrentPage("add-property")}
              >
                <Building2 className="h-5 w-5 text-primary" />
                <span className="text-sm">إضافة عقار</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => setCurrentPage("taxes")}
              >
                <Receipt className="h-5 w-5 text-primary" />
                <span className="text-sm">إدارة الجباية</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => setCurrentPage("properties")}
              >
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm">تصفح العقارات</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => setCurrentPage("contact-requests")}
              >
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm">طلبات الاتصال</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
