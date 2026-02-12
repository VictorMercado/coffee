export interface OrderItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
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
  items: OrderItem[];
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string | null;
  items: {
    menuItemId: string;
    quantity: number;
    size: string;
    price: number;
  }[];
  total: number;
}

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
  data: {
    userId?: string | null;
    customerName?: string;
    customerEmail?: string | null;
    status?: string;
    subtotal?: number;
    tax?: number;
    total?: number;
  }
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
