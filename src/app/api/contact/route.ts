import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = request.cookies.get("session")?.value;

    // If user is logged in, link the contact request to their account
    let userId = body.userId || null;
    if (session && !userId) {
      const user = await db.user.findUnique({
        where: { id: session },
        select: { id: true },
      });
      if (user) userId = user.id;
    }

    const contactRequest = await db.contactRequest.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        propertyId: body.propertyId || null,
        message: body.message,
        userId: userId,
      },
    });
    return NextResponse.json(contactRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating contact request:", error);
    return NextResponse.json({ error: "Failed to create contact request" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
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

    // Admin sees all contact requests
    // Other users see only requests related to their properties
    const where: Record<string, unknown> = {};
    if (user.role !== "مدير") {
      where.userId = user.id;
    }

    const requests = await db.contactRequest.findMany({
      where: user.role === "مدير" ? {} : {
        OR: [
          { userId: user.id },
          {
            property: {
              userId: user.id,
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { property: { select: { title: true } } },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching contact requests:", error);
    return NextResponse.json({ error: "Failed to fetch contact requests" }, { status: 500 });
  }
}
