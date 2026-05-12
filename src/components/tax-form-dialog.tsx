'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Receipt } from 'lucide-react'

const taxTypes = ['ضريبة عقارية', 'رسم تسجيل', 'رسوم بلدية', 'رسم توثيق', 'ضريبة انتقال']

export function TaxFormDialog() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    type: 'ضريبة عقارية',
    amount: '',
    dueDate: '',
    reference: '',
    description: '',
    propertyId: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.amount || !form.dueDate) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء المبلغ وتاريخ الاستحقاق',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast({
          title: 'تم الإضافة بنجاح',
          description: 'تمت إضافة الدفعة الضريبية',
        })
        setOpen(false)
        setForm({
          type: 'ضريبة عقارية',
          amount: '',
          dueDate: '',
          reference: '',
          description: '',
          propertyId: '',
        })
        // Trigger refresh
        window.dispatchEvent(new Event('tax-updated'))
      }
    } catch {
      toast({
        title: 'خطأ',
        description: 'فشل في إضافة الدفعة الضريبية',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة دفعة ضريبية
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            إضافة دفعة ضريبية جديدة
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>نوع الضريبة</Label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {taxTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax-amount">المبلغ (دج)</Label>
              <Input
                id="tax-amount"
                type="number"
                placeholder="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-date">تاريخ الاستحقاق</Label>
              <Input
                id="tax-date"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax-ref">المرجع</Label>
            <Input
              id="tax-ref"
              placeholder="TXN-2025-XXX"
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax-desc">الوصف</Label>
            <Textarea
              id="tax-desc"
              placeholder="وصف الدفعة الضريبية..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
