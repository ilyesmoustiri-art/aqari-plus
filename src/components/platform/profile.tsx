"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { formatDate } from "@/lib/utils-format";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Building2,
  Edit3,
  Save,
  KeyRound,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, login, logout, setCurrentPage } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || "",
      });
    }
  }, [user]);

  async function handleUpdateProfile() {
    if (!formData.name) {
      toast.error("الاسم مطلوب");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("تم تحديث الملف الشخصي");
        login(data.user);
        setEditing(false);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword() {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch(`/api/auth/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("تم تغيير كلمة المرور بنجاح");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      logout();
      toast.success("تم تسجيل الخروج");
    } catch {
      logout();
    }
  }

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      "مدير": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      "مالك عقارات": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "وكيل عقاري": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      "مستخدم": "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  if (!user) {
    return (
      <div className="py-20 px-4 text-center">
        <User className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
        <h3 className="text-lg font-semibold mb-2">لم يتم تسجيل الدخول</h3>
        <Button onClick={() => setCurrentPage("login")}>تسجيل الدخول</Button>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl mb-2">الملف الشخصي</h1>
          <p className="text-muted-foreground">إدارة حسابك ومعلوماتك الشخصية</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {user.name.charAt(0)}
                  </span>
                )}
              </div>
              {/* Info */}
              <div className="text-center sm:text-right flex-1">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Badge className={getRoleBadge(user.role)}>
                    <Shield className="h-3 w-3 ml-1" />
                    {user.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 justify-center sm:justify-start">
                  <Calendar className="h-3 w-3" />
                  عضو منذ {formatDate(user.createdAt)}
                </p>
              </div>
              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(!editing)} className="gap-1">
                  <Edit3 className="h-3.5 w-3.5" />
                  تعديل
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1 text-destructive">
                  <LogOut className="h-3.5 w-3.5" />
                  خروج
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Edit Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                المعلومات الشخصية
              </CardTitle>
              <CardDescription>تحديث بياناتك الشخصية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-1.5 block">الاسم الكامل</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editing}
                />
              </div>
              <div>
                <Label className="mb-1.5 block">البريد الإلكتروني</Label>
                <Input value={user.email} disabled className="bg-muted" dir="ltr" />
                <p className="text-xs text-muted-foreground mt-1">لا يمكن تغيير البريد الإلكتروني</p>
              </div>
              <div>
                <Label className="mb-1.5 block">رقم الهاتف</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  placeholder="+213 XXX XXX XXX"
                  dir="ltr"
                />
              </div>
              {editing && (
                <Button onClick={handleUpdateProfile} className="w-full gap-2" disabled={loading}>
                  <Save className="h-4 w-4" />
                  {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                تغيير كلمة المرور
              </CardTitle>
              <CardDescription>تحديث كلمة مرور حسابك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-1.5 block">كلمة المرور الحالية</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  dir="ltr"
                />
              </div>
              <div>
                <Label className="mb-1.5 block">كلمة المرور الجديدة</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  dir="ltr"
                />
              </div>
              <div>
                <Label className="mb-1.5 block">تأكيد كلمة المرور الجديدة</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  dir="ltr"
                />
              </div>
              <Button onClick={handleChangePassword} variant="outline" className="w-full gap-2" disabled={passwordLoading}>
                <KeyRound className="h-4 w-4" />
                {passwordLoading ? "جاري التغيير..." : "تغيير كلمة المرور"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
