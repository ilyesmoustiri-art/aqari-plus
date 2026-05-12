'use client'

import { useEffect } from "react"
import { useAppStore } from "@/store/app-store"
import Navbar from "@/components/platform/navbar"
import HeroSection from "@/components/platform/hero-section"
import FeaturedProperties from "@/components/platform/featured-properties"
import StatsSection from "@/components/platform/stats-section"
import PropertiesList from "@/components/platform/properties-list"
import PropertyDetail from "@/components/platform/property-detail"
import TaxManagement from "@/components/platform/tax-management"
import Dashboard from "@/components/platform/dashboard"
import AddProperty from "@/components/platform/add-property"
import MyProperties from "@/components/platform/my-properties"
import ContactRequests from "@/components/platform/contact-requests"
import MessagesPage from "@/components/platform/messages"
import Login from "@/components/platform/login"
import Register from "@/components/platform/register"
import Profile from "@/components/platform/profile"
import Footer from "@/components/platform/footer"
import { Button } from "@/components/ui/button"
import { LogIn, Shield } from "lucide-react"

type RoleAccess = "all" | "auth" | "admin" | "owner_agent" | "owner";

function ProtectedRoute({ 
  children, 
  access = "auth" 
}: { 
  children: React.ReactNode; 
  access?: RoleAccess;
}) {
  const { user, isAuthenticated, setCurrentPage } = useAppStore()

  useEffect(() => {
    if (access === "all") return
    if (!isAuthenticated) {
      setCurrentPage("login")
    } else if (access === "admin" && user?.role !== "مدير") {
      setCurrentPage("home")
    } else if (access === "owner_agent" && !["مدير", "مالك عقارات", "وكيل عقاري"].includes(user?.role || "")) {
      setCurrentPage("home")
    } else if (access === "owner" && !["مدير", "مالك عقارات"].includes(user?.role || "")) {
      setCurrentPage("home")
    }
  }, [isAuthenticated, user, access, setCurrentPage])

  if (access === "all") return <>{children}</>

  if (!isAuthenticated) {
    return (
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-md text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <LogIn className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">يجب تسجيل الدخول</h2>
          <p className="text-muted-foreground mb-6">
            يرجى تسجيل الدخول للوصول إلى هذه الصفحة
          </p>
          <Button onClick={() => setCurrentPage("login")} className="gap-2">
            <LogIn className="h-4 w-4" />
            تسجيل الدخول
          </Button>
        </div>
      </div>
    )
  }

  if (access === "admin" && user?.role !== "مدير") {
    return (
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-md text-center">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-3">غير مصرح</h2>
          <p className="text-muted-foreground mb-6">
            هذه الصفحة متاحة للمديرين فقط
          </p>
          <Button onClick={() => setCurrentPage("home")} variant="outline">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    )
  }

  if (access === "owner_agent" && !["مدير", "مالك عقارات", "وكيل عقاري"].includes(user?.role || "")) {
    return (
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-md text-center">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-3">غير مصرح</h2>
          <p className="text-muted-foreground mb-6">
            هذه الصفحة متاحة لمالكي العقارات ووكلاء العقارات فقط
          </p>
          <Button onClick={() => setCurrentPage("home")} variant="outline">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default function Home() {
  const { currentPage } = useAppStore()

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <HeroSection />
            <FeaturedProperties />
            <StatsSection />
          </>
        )
      case 'properties':
        return <PropertiesList />
      case 'property-detail':
        return <PropertyDetail />
      case 'login':
        return <Login />
      case 'register':
        return <Register />
      case 'profile':
        return <Profile />
      case 'messages':
        return (
          <ProtectedRoute access="auth">
            <MessagesPage />
          </ProtectedRoute>
        )
      case 'my-properties':
        return (
          <ProtectedRoute access="owner_agent">
            <MyProperties />
          </ProtectedRoute>
        )
      case 'add-property':
        return (
          <ProtectedRoute access="owner_agent">
            <AddProperty />
          </ProtectedRoute>
        )
      case 'taxes':
        return (
          <ProtectedRoute access="auth">
            <TaxManagement />
          </ProtectedRoute>
        )
      case 'dashboard':
        return (
          <ProtectedRoute access="admin">
            <Dashboard />
          </ProtectedRoute>
        )
      case 'contact-requests':
        return (
          <ProtectedRoute access="auth">
            <ContactRequests />
          </ProtectedRoute>
        )
      default:
        return (
          <>
            <HeroSection />
            <FeaturedProperties />
            <StatsSection />
          </>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  )
}
