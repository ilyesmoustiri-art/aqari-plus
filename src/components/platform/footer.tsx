"use client";

import { Building2, Phone, Mail, MapPin } from "lucide-react";
import { useAppStore } from "@/store/app-store";

export default function Footer() {
  const { setCurrentPage, user, isAuthenticated } = useAppStore();

  const handleNavClick = (page: string) => {
    if (page === "taxes" || page === "contact-requests") {
      if (!isAuthenticated) {
        setCurrentPage("login");
        return;
      }
    }
    setCurrentPage(page as any);
  };

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold">عقاري بلس</h3>
                <p className="text-xs text-muted-foreground">منصة العقارات والجباية</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصة إلكترونية متكاملة لبيع وشراء العقارات في الجزائر مع نظام جباية ذكي
              يساعدك على إدارة ضرائبك العقارية بكل سهولة وشفافية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => handleNavClick("home")}
                  className="hover:text-primary transition-colors"
                >
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("properties")}
                  className="hover:text-primary transition-colors"
                >
                  العقارات المتاحة
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("taxes")}
                  className="hover:text-primary transition-colors"
                >
                  إدارة الجباية
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("contact-requests")}
                  className="hover:text-primary transition-colors"
                >
                  اتصل بنا
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>الجزائر العاصمة، حيدرة</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span dir="ltr">+213 555 123 456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>contact@aqari-plus.dz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 عقاري بلس. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
