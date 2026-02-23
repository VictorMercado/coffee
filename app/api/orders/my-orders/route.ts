import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import * as OrderRepo from "@/lib/server/repo/order";
import { GUEST_USER_ID } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Use session user ID, or fall back to hardcoded guest ID
    const userId = session?.user?.id ?? GUEST_USER_ID;

    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const orders = await OrderRepo.findOrdersByUserId(userId);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

