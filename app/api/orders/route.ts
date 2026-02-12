import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import { z } from "zod";
import * as OrderRepo from "@/lib/server/repo/order";
import * as MenuItemRepo from "@/lib/server/repo/menu-item";

const orderItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().int().positive(),
  size: z.string(),
  price: z.number().positive(),
});

const orderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email().optional().nullable(),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  total: z.number().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const validationResult = orderSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { customerName, customerEmail, items, total } =
      validationResult.data;

    // Get userId if user is logged in
    const userId = session?.user?.id ?? null;

    // Calculate subtotal and tax
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;

    // Generate order number
    const orderNumber = await OrderRepo.generateOrderNumber();

    // Get menu item names for order items
    const menuItemIds = items.map((item) => item.menuItemId);
    const menuItems = await MenuItemRepo.findMenuItemsByIds(menuItemIds);

    const menuItemMap = new Map(menuItems.map((item) => [item.id, item.name]));

    // Create order with items
    const order = await OrderRepo.createOrder({
      orderNumber,
      userId,
      customerName,
      customerEmail: customerEmail || null,
      subtotal,
      tax,
      total: subtotal + tax,
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        name: menuItemMap.get(item.menuItemId) || "Unknown Item",
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const orders = await OrderRepo.findAllOrders({ limit });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
