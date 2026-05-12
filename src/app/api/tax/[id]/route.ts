import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const taxPayment = await db.taxPayment.findUnique({
      where: { id },
      include: { property: true },
    })
    if (!taxPayment) {
      return NextResponse.json({ error: 'الدفعة غير موجودة' }, { status: 404 })
    }
    return NextResponse.json(taxPayment)
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الدفعة' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updateData: Record<string, unknown> = {}

    if (body.status) updateData.status = body.status
    if (body.status === 'مدفوع' && !body.paidDate) {
      updateData.paidDate = new Date()
    }
    if (body.paidDate) updateData.paidDate = new Date(body.paidDate)
    if (body.type) updateData.type = body.type
    if (body.amount) updateData.amount = parseFloat(body.amount)
    if (body.reference) updateData.reference = body.reference
    if (body.description) updateData.description = body.description

    const taxPayment = await db.taxPayment.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json(taxPayment)
  } catch (error) {
    return NextResponse.json({ error: 'فشل في تحديث الدفعة' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.taxPayment.delete({ where: { id } })
    return NextResponse.json({ message: 'تم حذف الدفعة بنجاح' })
  } catch (error) {
    return NextResponse.json({ error: 'فشل في حذف الدفعة' }, { status: 500 })
  }
}
