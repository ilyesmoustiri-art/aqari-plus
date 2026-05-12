"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/app-store";
import {
  Search,
  Building2,
  Receipt,
  TrendingUp,
  Shield,
} from "lucide-react";

export default function HeroSection() {
  const { setCurrentPage, setSearchQuery } = useAppStore();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    setSearchQuery(query);
    setCurrentPage("properties");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-primary/10 via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm backdrop-blur">
            <Shield className="h-4 w-4 text-primary" />
            <span>منصة موثوقة ومعتمدة</span>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="block">ابحث عن عقارك</span>
            <span className="block mt-2 text-primary">المثالي بكل سهولة</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-10 text-base text-muted-foreground sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            منصة شاملة لإدارة ومعاملة العقارات والجباية. اكتشف أفضل العقارات، تابع ضرائبك،
            وأدر أعمالك العقارية بكفاءة عالية.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto mb-12 flex max-w-2xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                type="text"
                placeholder="ابحث عن عقار حسب المدينة، النوع، أو العنوان..."
                className="h-12 pr-10 text-base rounded-xl"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-6 rounded-xl">
              بحث
            </Button>
          </form>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all"
              onClick={() => setCurrentPage("properties")}
            >
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-semibold">تصفح العقارات</span>
              <span className="text-xs text-muted-foreground">عقارات متنوعة</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all"
              onClick={() => setCurrentPage("taxes")}
            >
              <Receipt className="h-6 w-6 text-primary" />
              <span className="font-semibold">إدارة الجباية</span>
              <span className="text-xs text-muted-foreground">ضرائب ورسوم</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all"
              onClick={() => setCurrentPage("dashboard")}
            >
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="font-semibold">لوحة التحكم</span>
              <span className="text-xs text-muted-foreground">إحصائيات شاملة</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
