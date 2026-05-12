import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: Record<string, unknown> = {}

    if (status) where.status = status
    if (type) where.type = type

    const taxPayments = await db.taxPayment.findMany({
      where,
      orderBy: { dueDate: 'desc' },
      include: {
        property: {
          select: { title: true },
        },
      },
    })

    return NextResponse.json(taxPayments)
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب المدفوعات الضريبية' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const taxPayment = await db.taxPayment.create({
      data: {
        type: body.type,
        amount: parseFloat(body.amount),
        status: body.status || 'قيد الانتظار',
        dueDate: new Date(body.dueDate),
        paidDate: body.paidDate ? new Date(body.paidDate) : null,
        reference: body.reference,
        description: body.description,
        propertyId: body.propertyId || null,
      },
    })
    return NextResponse.json(taxPayment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'فشل في إنشاء الدفعة الضريبية' }, { status: 500 })
  }
}
