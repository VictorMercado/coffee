import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import * as OrderRepo from "@/lib/server/repo/order";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }>; }
) {
  try {
    const { id } = await params;

    const order = await OrderRepo.findOrderById(id);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }>; }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Only allow updating specific fields
    const allowedFields = ["userId", "customerName", "customerEmail", "status", "subtotal", "tax", "total"];
    const updateData: Record<string, any> = {};

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const order = await OrderRepo.updateOrder(id, updateData);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
