"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Building2,
  Receipt,
  LayoutDashboard,
  Plus,
  Menu,
  Moon,
  Sun,
  LogIn,
  UserPlus,
  LogOut,
  User,
  ChevronDown,
  MessagesSquare,
  MessageCircle,
  FolderOpen,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: string[]; // empty = all
}

const allNavItems: NavItem[] = [
  { id: "home", label: "الرئيسية", icon: Home, roles: [] },
  { id: "properties", label: "العقارات", icon: Building2, roles: [] },
  { id: "messages", label: "الرسائل", icon: MessageCircle, roles: [] },
  { id: "my-properties", label: "عقاراتي", icon: FolderOpen, roles: ["مالك عقارات", "وكيل عقاري", "مدير"] },
  { id: "add-property", label: "إضافة عقار", icon: Plus, roles: ["مالك عقارات", "وكيل عقاري", "مدير"] },
  { id: "taxes", label: "الجباية", icon: Receipt, roles: [] },
  { id: "contact-requests", label: "طلبات الاتصال", icon: MessagesSquare, roles: [] },
  { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard, roles: ["مدير"] },
];

export default function Navbar() {
  const {
    currentPage,
    setCurrentPage,
    resetFilters,
    user,
    isAuthenticated,
    loadingAuth,
    setUser,
    logout,
    unreadMessages,
  } = useAppStore();
  const { theme, setTheme } = useTheme();

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    }
    checkAuth();
  }, [setUser]);

  // Fetch unread counts periodically
  useEffect(() => {
    if (!isAuthenticated) return;
    
    function fetchUnreadCounts() {
      fetch("/api/messages/conversations")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const total = data.reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0);
            useAppStore.getState().setUnreadMessages(total);
          }
        })
        .catch(() => {});
    }

    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 30000); // every 30s
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleNavClick = (pageId: string) => {
    if (pageId === "properties") resetFilters();
    setCurrentPage(pageId as any);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      logout();
      toast.success("تم تسجيل الخروج");
    } catch {
      logout();
    }
  };

  // Filter nav items based on auth state and role
  const publicNavItems = allNavItems.filter(item => 
    item.id === "home" || item.id === "properties"
  );

  const authNavItems = isAuthenticated
    ? allNavItems.filter(item => 
        item.roles.length === 0 || item.roles.includes(user?.role || "")
      )
    : publicNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setCurrentPage("home")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold leading-tight">عقاري بلس</h1>
            <p className="text-[10px] text-muted-foreground leading-none">
              منصة العقارات والجباية
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {authNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavClick(item.id)}
                className="gap-1.5 relative"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden xl:inline">{item.label}</span>
                {item.id === "messages" && unreadMessages > 0 && (
                  <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[10px] rounded-full bg-red-500 text-white absolute -top-1 -left-1">
                    {unreadMessages}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">تبديل السمة</span>
          </Button>

          {/* Auth Buttons or User Menu */}
          {!isAuthenticated && !loadingAuth ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage("login")}
                className="gap-1.5"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden md:inline">دخول</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setCurrentPage("register")}
                className="gap-1.5"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden md:inline">حساب جديد</span>
              </Button>
            </div>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {user?.name?.charAt(0) || "م"}
                    </span>
                  </div>
                  <span className="hidden md:inline max-w-24 truncate text-sm">
                    {user?.name}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {user?.role}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentPage("profile")} className="gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  الملف الشخصي
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentPage("messages")} className="gap-2 cursor-pointer">
                  <MessageCircle className="h-4 w-4" />
                  الرسائل
                  {unreadMessages > 0 && (
                    <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[10px] rounded-full bg-red-500 text-white mr-auto">
                      {unreadMessages}
                    </Badge>
                  )}
                </DropdownMenuItem>
                {["مالك عقارات", "وكيل عقاري", "مدير"].includes(user?.role || "") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setCurrentPage("my-properties")} className="gap-2 cursor-pointer">
                      <FolderOpen className="h-4 w-4" />
                      عقاراتي
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCurrentPage("add-property")} className="gap-2 cursor-pointer">
                      <Plus className="h-4 w-4" />
                      إضافة عقار
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={() => setCurrentPage("taxes")} className="gap-2 cursor-pointer">
                  <Receipt className="h-4 w-4" />
                  ضرائبي
                </DropdownMenuItem>
                {user?.role === "مدير" && (
                  <DropdownMenuItem onClick={() => setCurrentPage("dashboard")} className="gap-2 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    لوحة التحكم
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetTitle className="sr-only">القائمة الرئيسية</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center gap-3 border-b p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold">عقاري بلس</h2>
                    <p className="text-xs text-muted-foreground">منصة العقارات والجباية</p>
                  </div>
                </div>

                {/* User Info (mobile) */}
                {isAuthenticated && user && (
                  <div className="p-4 border-b bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nav Items */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {authNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start gap-3 relative"
                        onClick={() => {
                          handleNavClick(item.id);
                          const closeBtn = document.querySelector("[data-radix-sheet-close]");
                          if (closeBtn) (closeBtn as HTMLElement).click();
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                        {item.id === "messages" && unreadMessages > 0 && (
                          <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full bg-red-500 text-white mr-auto">
                            {unreadMessages}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </nav>

                {/* Auth Buttons (mobile) */}
                <div className="p-4 border-t space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => {
                          setCurrentPage("profile");
                          const closeBtn = document.querySelector("[data-radix-sheet-close]");
                          if (closeBtn) (closeBtn as HTMLElement).click();
                        }}
                      >
                        <User className="h-4 w-4" />
                        الملف الشخصي
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full justify-start gap-3"
                        onClick={() => {
                          handleLogout();
                          const closeBtn = document.querySelector("[data-radix-sheet-close]");
                          if (closeBtn) (closeBtn as HTMLElement).click();
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        تسجيل الخروج
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full justify-center gap-2"
                        onClick={() => {
                          setCurrentPage("login");
                          const closeBtn = document.querySelector("[data-radix-sheet-close]");
                          if (closeBtn) (closeBtn as HTMLElement).click();
                        }}
                      >
                        <LogIn className="h-4 w-4" />
                        تسجيل الدخول
                      </Button>
                      <Button
                        className="w-full justify-center gap-2"
                        onClick={() => {
                          setCurrentPage("register");
                          const closeBtn = document.querySelector("[data-radix-sheet-close]");
                          if (closeBtn) (closeBtn as HTMLElement).click();
                        }}
                      >
                        <UserPlus className="h-4 w-4" />
                        إنشاء حساب
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
