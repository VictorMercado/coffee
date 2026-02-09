import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { OrderConfirmationContent } from "@/components/order-confirmation-content"

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
    },
  })

  if (!order) {
    return null
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    status: order.status,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    })),
  }
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  return <OrderConfirmationContent order={order} />
}
