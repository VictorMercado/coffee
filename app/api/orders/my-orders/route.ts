import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import * as OrderRepo from "@/lib/server/repo/order";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await OrderRepo.findOrdersByUserId(session.user.id);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
