import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [
      totalProperties,
      availableProperties,
      soldProperties,
      reservedProperties,
      totalTax,
      paidTax,
      pendingTax,
      overdueTax,
      totalLeads,
      featuredProperties,
    ] = await Promise.all([
      db.property.count(),
      db.property.count({ where: { status: 'متاح' } }),
      db.property.count({ where: { status: 'مباع' } }),
      db.property.count({ where: { status: 'محجوز' } }),
      db.taxPayment.aggregate({ _sum: { amount: true } }),
      db.taxPayment.aggregate({ where: { status: 'مدفوع' }, _sum: { amount: true } }),
      db.taxPayment.aggregate({ where: { status: 'قيد الانتظار' }, _sum: { amount: true } }),
      db.taxPayment.aggregate({ where: { status: 'متأخر' }, _sum: { amount: true } }),
      db.contactRequest.count(),
      db.property.count({ where: { featured: true } }),
    ])

    const propertiesByCity = await db.property.groupBy({
      by: ['city'],
      _count: true,
    })

    const propertiesByType = await db.property.groupBy({
      by: ['type'],
      _count: true,
    })

    return NextResponse.json({
      totalProperties,
      availableProperties,
      soldProperties,
      reservedProperties,
      totalTax: totalTax._sum.amount || 0,
      paidTax: paidTax._sum.amount || 0,
      pendingTax: pendingTax._sum.amount || 0,
      overdueTax: overdueTax._sum.amount || 0,
      totalLeads,
      featuredProperties,
      propertiesByCity,
      propertiesByType,
    })
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الإحصائيات' }, { status: 500 })
  }
}
