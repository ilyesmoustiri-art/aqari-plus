import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payment = await db.taxPayment.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error updating tax payment:", error);
    return NextResponse.json({ error: "Failed to update tax payment" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = _request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    await db.taxPayment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tax payment:", error);
    return NextResponse.json({ error: "Failed to delete tax payment" }, { status: 500 });
  }
}
