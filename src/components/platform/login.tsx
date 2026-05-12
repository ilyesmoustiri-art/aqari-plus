"use client";

import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, setCurrentPage } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        login(data.user);
        setCurrentPage("home");
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mx-auto mb-4">
            <Building2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">عقاري بلس</h1>
          <p className="text-muted-foreground mt-1">منصة العقارات والجباية</p>
        </div>

        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5 text-primary" />
              تسجيل الدخول
            </CardTitle>
            <CardDescription>
              أدخل بياناتك للوصول إلى حسابك
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pr-10"
                    dir="ltr"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pr-10 pl-10"
                    dir="ltr"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 gap-2" disabled={loading}>
                {loading ? (
                  "جاري تسجيل الدخول..."
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    تسجيل الدخول
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground pt-2">
                ليس لديك حساب؟{" "}
                <button
                  type="button"
                  onClick={() => setCurrentPage("register")}
                  className="text-primary font-medium hover:underline"
                >
                  إنشاء حساب جديد
                </button>
              </div>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground text-center mb-3 flex items-center justify-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                حسابات تجريبية للتجربة
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full h-9 text-xs justify-start gap-2 font-normal"
                  onClick={() => {
                    setFormData({
                      email: "admin@aqari.dz",
                      password: "admin123",
                    });
                  }}
                >
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span>مدير: admin@aqari.dz / admin123</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-9 text-xs justify-start gap-2 font-normal"
                  onClick={() => {
                    setFormData({
                      email: "user@aqari.dz",
                      password: "user123",
                    });
                  }}
                >
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>مستخدم: user@aqari.dz / user123</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
