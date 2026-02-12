import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import { z } from "zod";
import * as OrderRepo from "@/lib/server/repo/order";

const statusSchema = z.object({
  status: z.enum(["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELLED"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }>; }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validationResult = statusSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { status } = validationResult.data;

    const order = await OrderRepo.updateOrderStatus(id, status);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
