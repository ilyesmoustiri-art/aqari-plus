import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await db.user.findUnique({
      where: { id: session },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        active: true,
        createdAt: true,
      },
    });

    if (!user || !user.active) {
      const response = NextResponse.json({ user: null });
      response.cookies.set("session", "", { maxAge: 0, path: "/" });
      return response;
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get session error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
