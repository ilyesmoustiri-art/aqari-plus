import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalProperties = await db.property.count();
    const availableProperties = await db.property.count({ where: { status: "متاح" } });
    const soldProperties = await db.property.count({ where: { status: "مباع" } });
    const featuredProperties = await db.property.count({ where: { featured: true } });

    const propertiesByCity = await db.property.groupBy({
      by: ["city"],
      _count: { id: true },
    });

    const propertiesByType = await db.property.groupBy({
      by: ["type"],
      _count: { id: true },
    });

    const totalTaxPaid = await db.taxPayment.aggregate({
      where: { status: "مدفوع" },
      _sum: { amount: true },
    });

    const totalTaxPending = await db.taxPayment.aggregate({
      where: { status: "قيد الانتظار" },
      _sum: { amount: true },
    });

    const totalTaxOverdue = await db.taxPayment.aggregate({
      where: { status: "متأخر" },
      _sum: { amount: true },
    });

    const totalTaxAmount = await db.taxPayment.aggregate({
      _sum: { amount: true },
    });

    const paidCount = await db.taxPayment.count({ where: { status: "مدفوع" } });
    const pendingCount = await db.taxPayment.count({ where: { status: "قيد الانتظار" } });
    const overdueCount = await db.taxPayment.count({ where: { status: "متأخر" } });

    const recentProperties = await db.property.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const totalPropertyArea = await db.property.aggregate({
      _sum: { area: true },
    });

    const avgPrice = await db.property.aggregate({
      _avg: { price: true },
    });

    const contactRequests = await db.contactRequest.count();
    const unreadRequests = await db.contactRequest.count({ where: { read: false } });

    return NextResponse.json({
      totalProperties,
      availableProperties,
      soldProperties,
      featuredProperties,
      propertiesByCity,
      propertiesByType,
      totalTaxPaid: totalTaxPaid._sum.amount || 0,
      totalTaxPending: totalTaxPending._sum.amount || 0,
      totalTaxOverdue: totalTaxOverdue._sum.amount || 0,
      totalTaxAmount: totalTaxAmount._sum.amount || 0,
      paidCount,
      pendingCount,
      overdueCount,
      recentProperties,
      totalPropertyArea: totalPropertyArea._sum.area || 0,
      avgPrice: avgPrice._avg.price || 0,
      contactRequests,
      unreadRequests,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
