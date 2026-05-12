import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const withUserId = request.nextUrl.searchParams.get("with");
    if (!withUserId) {
      return NextResponse.json({ error: "معرف المستخدم مطلوب" }, { status: 400 });
    }

    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: session, receiverId: withUserId },
          { senderId: withUserId, receiverId: session },
        ],
      },
      include: {
        sender: { select: { name: true, role: true } },
        receiver: { select: { name: true, role: true } },
        property: { select: { title: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { receiverId, content, propertyId } = await request.json();

    if (!receiverId || !content) {
      return NextResponse.json({ error: "البيانات مطلوبة" }, { status: 400 });
    }

    const message = await db.message.create({
      data: {
        senderId: session,
        receiverId,
        content,
        propertyId: propertyId || null,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
