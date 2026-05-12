import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const session = request.cookies.get("session")?.value;
    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    const rooms = searchParams.get("rooms");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (city && city !== "الكل") where.city = city;
    if (type && type !== "الكل") where.type = type;
    if (status) where.status = status;
    if (featured === "true") where.featured = true;
    if (rooms) where.rooms = parseInt(rooms);
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { address: { contains: search } },
        { city: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice);
    }

    if (minArea || maxArea) {
      where.area = {};
      if (minArea) (where.area as Record<string, unknown>).gte = parseFloat(minArea);
      if (maxArea) (where.area as Record<string, unknown>).lte = parseFloat(maxArea);
    }

    const properties = await db.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
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

    const property = await db.property.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        price: body.price,
        area: body.area,
        rooms: body.rooms || null,
        bathrooms: body.bathrooms || null,
        city: body.city,
        address: body.address,
        image: body.image || null,
        featured: body.featured || false,
        status: body.status || "متاح",
        userId: user.id,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
