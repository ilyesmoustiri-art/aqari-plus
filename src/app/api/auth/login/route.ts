import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        active: true,
        createdAt: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "بريد إلكتروني أو كلمة مرور خاطئة" }, { status: 401 });
    }

    if (!user.active) {
      return NextResponse.json({ error: "الحساب معطل. تواصل مع الإدارة" }, { status: 403 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "بريد إلكتروني أو كلمة مرور خاطئة" }, { status: 401 });
    }

    // Store session in a simple way (cookie-based)
    const { password: _, ...userWithoutPassword } = user as typeof user & { password: string };

    const response = NextResponse.json({
      user: userWithoutPassword,
      message: "تم تسجيل الدخول بنجاح",
    });

    // Set session cookie
    response.cookies.set("session", user.id, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الدخول" }, { status: 500 });
  }
}
