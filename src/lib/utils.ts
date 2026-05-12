import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-DZ').format(price) + ' دج'
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function getPropertyTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    'شقة': 'Building2',
    'فيلا': 'Home',
    'أرض': 'MapPin',
    'تجاري': 'Store',
    'مكتب': 'Briefcase',
  }
  return icons[type] || 'Building2'
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'متاح': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'مباع': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'محجوز': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'مدفوع': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'قيد الانتظار': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'متأخر': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}
