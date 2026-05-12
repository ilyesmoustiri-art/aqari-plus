import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { messageIds } = await request.json();

    if (Array.isArray(messageIds) && messageIds.length > 0) {
      await db.message.updateMany({
        where: {
          id: { in: messageIds },
          receiverId: session,
        },
        data: { read: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
