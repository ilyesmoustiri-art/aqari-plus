'use client'

import { Building2, Phone, Mail, MapPin } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function Footer() {
  const { setActiveTab } = useAppStore()

  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary">عقاري بلس</span>
                <span className="text-[10px] text-muted-foreground">Aqari Plus</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصتكم الموثوقة لإدارة العقارات والجباية. نساعدكم في العثور على العقار المثالي وإدارة التزاماتكم الضريبية بكفاءة.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">روابط سريعة</h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'الرئيسية', tab: 'home' as const },
                { label: 'العقارات', tab: 'properties' as const },
                { label: 'الجباية', tab: 'tax' as const },
                { label: 'لوحة التحكم', tab: 'dashboard' as const },
              ].map((link) => (
                <button
                  key={link.tab}
                  onClick={() => setActiveTab(link.tab)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors text-right"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span dir="ltr">+213 555 123 456</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>info@aqariplus.dz</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>الجزائر العاصمة، الجزائر</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} عقاري بلس. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
