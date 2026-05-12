import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const session = request.cookies.get("session")?.value;
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const propertyId = searchParams.get("propertyId");

    const where: Record<string, unknown> = {};
    if (status && status !== "الكل") where.status = status;
    if (type && type !== "الكل") where.type = type;
    if (propertyId) where.propertyId = propertyId;

    // If user is logged in, filter by user role
    if (session) {
      const user = await db.user.findUnique({
        where: { id: session },
        select: { id: true, role: true },
      });

      if (user && user.role !== "مدير") {
        // Non-admin users see only their own taxes
        where.userId = user.id;
      }
      // Admin sees all taxes
    }

    const payments = await db.taxPayment.findMany({
      where,
      orderBy: { dueDate: "desc" },
      include: { property: { select: { title: true, city: true } } },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching tax payments:", error);
    return NextResponse.json({ error: "Failed to fetch tax payments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const payment = await db.taxPayment.create({
      data: {
        type: body.type,
        amount: body.amount,
        status: body.status || "قيد الانتظار",
        dueDate: body.dueDate,
        reference: body.reference || null,
        description: body.description,
        propertyId: body.propertyId || null,
        userId: user.role === "مدير" ? (body.userId || null) : user.id,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Error creating tax payment:", error);
    return NextResponse.json({ error: "Failed to create tax payment" }, { status: 500 });
  }
}
