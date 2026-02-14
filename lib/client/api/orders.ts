import type { z } from "zod";
import type { orderRequestSchema, orderUpdateRequestSchema } from "@/lib/validations";
import type { OrderListDTO } from "@/lib/server/dtos";

// ── Re-export server DTOs as client-friendly names ─────────────

export type Order = OrderListDTO;
export type OrderItem = OrderListDTO["items"][number];

// ── Input types derived from Zod schemas ───────────────────────

export type CreateOrderInput = z.infer<typeof orderRequestSchema>;
export type UpdateOrderInput = z.infer<typeof orderUpdateRequestSchema>;

// ── Fetchers ───────────────────────────────────────────────────

// Fetch user's orders
export async function fetchMyOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders/my-orders");
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
}

// Create order
export async function createOrder(data: CreateOrderInput): Promise<Order> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to place order");
  }

  return response.json();
}

// Update order status (admin)
export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<void> {
  const response = await fetch(`/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update order status");
  }
}

// Fetch single order
export async function fetchOrder(id: string): Promise<Order> {
  const response = await fetch(`/api/orders/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }
  return response.json();
}

// Update order (admin)
export async function updateOrder(
  orderId: string,
  data: UpdateOrderInput
): Promise<Order> {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update order");
  }

  return response.json();
}
