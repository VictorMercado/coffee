import { prisma } from "@/lib/prisma";

// --- Queries ---

export async function findAllOrders(options?: { limit?: number; }) {
  return prisma.order.findMany({
    take: options?.limit || 50,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function findOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}

export async function findOrdersByUserId(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function countOrders() {
  return prisma.order.count();
}

export async function generateOrderNumber(): Promise<string> {
  const orderCount = await countOrders();
  return `ORB-${(1000 + orderCount + 1).toString()}`;
}

// --- Mutations ---

export interface CreateOrderData {
  orderNumber: string;
  userId: string | null;
  customerName: string;
  customerEmail: string | null;
  subtotal: number;
  tax: number;
  total: number;
  items: {
    menuItemId: string;
    name: string;
    size: string;
    quantity: number;
    price: number;
  }[];
}

export async function createOrder(data: CreateOrderData) {
  return prisma.order.create({
    data: {
      orderNumber: data.orderNumber,
      userId: data.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      items: {
        create: data.items,
      },
    },
    include: { items: true },
  });
}

export async function updateOrderStatus(id: string, status: string) {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}

export async function updateOrder(
  id: string,
  data: {
    userId?: string | null;
    customerName?: string;
    customerEmail?: string | null;
    status?: string;
    subtotal?: number;
    tax?: number;
    total?: number;
  }
) {
  return prisma.order.update({
    where: { id },
    data,
    include: { items: true },
  });
}
