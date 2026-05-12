'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface ContactFormProps {
  propertyId?: string
  propertyTitle?: string
}

export function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: propertyTitle ? `مرحباً، أرغب في الاستفسار عن: ${propertyTitle}` : '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          propertyId: propertyId || null,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        toast({
          title: 'تم الإرسال بنجاح',
          description: 'سنتواصل معك في أقرب وقت ممكن',
        })
      }
    } catch {
      toast({
        title: 'خطأ',
        description: 'فشل في إرسال الطلب، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">تم إرسال طلبك بنجاح</h3>
        <p className="text-sm text-muted-foreground">
          سيتواصل فريقنا معك في أقرب وقت ممكن
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setSubmitted(false)
            setForm({ name: '', phone: '', email: '', message: '' })
          }}
        >
          إرسال طلب آخر
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">الاسم الكامل *</Label>
        <Input
          id="name"
          placeholder="أدخل اسمك الكامل"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف *</Label>
          <Input
            id="phone"
            placeholder="0555 123 456"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            dir="ltr"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            dir="ltr"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">الرسالة *</Label>
        <Textarea
          id="message"
          placeholder="اكتب رسالتك هنا..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            جاري الإرسال...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            إرسال الطلب
          </span>
        )}
      </Button>
    </form>
  )
}
