"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
        <div className="flex items-center justify-center p-12">
          <div className="font-mono text-primary">LOADING...</div>
        </div>
      </>
    );
  }

  if (isError || !order) {
    return (
      <>
        <div className="flex items-center justify-center p-12">
          <div className="font-mono text-red-500">ORDER NOT FOUND</div>
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto">
      <OrderForm
        orderId={orderId}
        initialData={order}
      />
    </div>
  );
}