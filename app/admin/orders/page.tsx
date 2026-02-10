import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/admin-header";
import { OrdersList } from "@/components/admin/orders-list";

export const dynamic = "force-dynamic";

async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    status: order.status,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    createdAt: order.createdAt.toISOString(),
    itemCount: order.items.length,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    })),
  }));
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <>
      <AdminHeader
        title="ORDERS"
        description="Manage customer orders"
      />
      <OrdersList initialOrders={orders} />
    </>
  );
}
