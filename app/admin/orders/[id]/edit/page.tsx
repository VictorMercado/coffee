"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AdminHeader } from "@/components/admin/admin-header";
import { OrderForm } from "@/components/admin/forms/order-form";
import { fetchOrder } from "@/lib/client/api";

export default function EditOrderPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <>
        <AdminHeader title="EDIT ORDER" description="Loading..." />
        <div className="flex items-center justify-center p-12">
          <div className="font-mono text-primary">LOADING...</div>
        </div>
      </>
    );
  }

  if (isError || !order) {
    return (
      <>
        <AdminHeader title="EDIT ORDER" description="Order not found" />
        <div className="flex items-center justify-center p-12">
          <div className="font-mono text-red-500">ORDER NOT FOUND</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title="EDIT ORDER"
        description={`Editing: ${order.orderNumber}`}
      />
      <div className="p-8">
        <OrderForm
          orderId={orderId}
          initialData={order}
        />
      </div>
    </>
  );
}
