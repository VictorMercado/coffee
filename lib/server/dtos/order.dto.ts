import type { Order, OrderItem } from "@/lib/types/order";

export type OrderItemDTO = Omit<OrderItem, "orderId">;

export type OrderDTO = Order;

export interface OrderWithItemsDTO extends OrderDTO {
  items: OrderItemDTO[];
}

// Shape returned by GET /api/orders/my-orders, GET /api/orders
// Prisma returns orders with items included
export interface OrderListDTO {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerName: string;
  customerEmail: string | null;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  items: {
    id: string;
    name: string;
    size: string;
    quantity: number;
    price: number;
  }[];
}
