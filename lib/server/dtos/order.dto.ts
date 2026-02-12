export interface OrderItemDTO {
  id: string;
  menuItemId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerName: string;
  customerEmail: string | null;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderWithItemsDTO extends OrderDTO {
  items: OrderItemDTO[];
}
