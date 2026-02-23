import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import * as OrderRepo from "@/lib/server/repo/order";
import * as UserRepo from "@/lib/server/repo/user";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    let userId: string | null = null;

    if (session?.user) {
      userId = session.user.id;
    } else {
      // No session — look up the shared guest user
      const guestUser = await UserRepo.findUserByUsername("guest");
      if (guestUser) {
        userId = guestUser.id;
      }
    }

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

