import type { Order, OrderItem } from "@/lib/types/order";

export type OrderItemDTO = Omit<OrderItem, "orderId">;

export type OrderDTO = Order;

export interface OrderWithItemsDTO extends OrderDTO {
  items: OrderItemDTO[];
}
