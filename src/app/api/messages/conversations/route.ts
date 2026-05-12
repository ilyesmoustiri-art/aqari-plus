import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // Get all messages where the user is sender or receiver
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: session },
          { receiverId: session },
        ],
      },
      include: {
        sender: { select: { name: true, role: true } },
        receiver: { select: { name: true, role: true } },
        property: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by the other user (conversation partner)
    const convMap = new Map<string, {
      userId: string;
      userName: string;
      userRole: string;
      lastMessage: string;
      lastTime: string;
      unreadCount: number;
      propertyTitle?: string;
    }>();

    for (const msg of messages) {
      const isSent = msg.senderId === session;
      const partnerId = isSent ? msg.receiverId : msg.senderId;
      const partnerName = isSent ? msg.receiver.name : msg.sender.name;
      const partnerRole = isSent ? msg.receiver.role : msg.sender.role;

      const existing = convMap.get(partnerId);
      if (!existing) {
        convMap.set(partnerId, {
          userId: partnerId,
          userName: partnerName,
          userRole: partnerRole,
          lastMessage: msg.content,
          lastTime: msg.createdAt,
          unreadCount: isSent ? 0 : (msg.read ? 0 : 1),
          propertyTitle: msg.property?.title || undefined,
        });
      } else {
        existing.unreadCount += isSent ? 0 : (msg.read ? 0 : 1);
        // Update last message/time if this message is newer
        if (new Date(msg.createdAt) > new Date(existing.lastTime)) {
          existing.lastMessage = msg.content;
          existing.lastTime = msg.createdAt;
          if (msg.property?.title) existing.propertyTitle = msg.property.title;
        }
      }
    }

    const conversations = Array.from(convMap.values()).sort(
      (a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
    );

    // Format lastTime
    const formatted = conversations.map(c => ({
      ...c,
      lastTime: formatDateRecent(c.lastTime),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

function formatDateRecent(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return `منذ ${diffMins} د`;
  if (diffHours < 24) return `منذ ${diffHours} س`;
  if (diffDays < 7) return `منذ ${diffDays} ي`;
  return date.toLocaleDateString("ar-DZ");
}
