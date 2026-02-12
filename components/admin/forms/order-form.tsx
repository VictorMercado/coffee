"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrder } from "@/lib/client/api";
import { toast } from "sonner";
import { useState } from "react";

interface OrderItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

interface OrderFormProps {
  orderId: string;
  initialData: {
    orderNumber: string;
    userId: string | null;
    customerName: string;
    customerEmail: string | null;
    status: string;
    subtotal: number;
    tax: number;
    total: number;
    items: OrderItem[];
  };
}

const ORDER_STATUSES = ["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

export function OrderForm({ orderId, initialData }: OrderFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [userId, setUserId] = useState(initialData.userId || "");
  const [customerName, setCustomerName] = useState(initialData.customerName);
  const [customerEmail, setCustomerEmail] = useState(initialData.customerEmail || "");
  const [status, setStatus] = useState(initialData.status);
  const [subtotal, setSubtotal] = useState(initialData.subtotal);
  const [tax, setTax] = useState(initialData.tax);
  const [total, setTotal] = useState(initialData.total);

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof updateOrder>[1]) =>
      updateOrder(orderId, data),
    onSuccess: () => {
      toast.success("Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      router.push("/admin/orders");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      userId: userId.trim() || null,
      customerName,
      customerEmail: customerEmail.trim() || null,
      status,
      subtotal,
      tax,
      total,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Info (read-only) */}
      <div className="border border-border bg-card p-6">
        <h3 className="font-mono text-lg text-primary mb-4">ORDER INFO</h3>
        <div className="font-mono text-sm text-muted-foreground">
          Order Number: <span className="text-primary">{initialData.orderNumber}</span>
        </div>
      </div>

      {/* Customer & Assignment */}
      <div className="space-y-4 border border-border bg-card p-6">
        <h3 className="font-mono text-lg text-primary">CUSTOMER & ASSIGNMENT</h3>

        <div>
          <Label htmlFor="userId" className="font-mono text-xs text-primary">
            USER ID
          </Label>
          <Input
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Leave empty for unassigned"
            className="mt-1 border-border font-mono text-foreground"
          />
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Assign this order to a specific user by their ID
          </p>
        </div>

        <div>
          <Label htmlFor="customerName" className="font-mono text-xs text-primary">
            CUSTOMER NAME *
          </Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="mt-1 border-border font-mono text-foreground"
          />
        </div>

        <div>
          <Label htmlFor="customerEmail" className="font-mono text-xs text-primary">
            CUSTOMER EMAIL
          </Label>
          <Input
            id="customerEmail"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Optional"
            className="mt-1 border-border font-mono text-foreground"
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-4 border border-border bg-card p-6">
        <h3 className="font-mono text-lg text-primary">STATUS</h3>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="border-border font-mono text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pricing */}
      <div className="space-y-4 border border-border bg-card p-6">
        <h3 className="font-mono text-lg text-primary">PRICING</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="subtotal" className="font-mono text-xs text-primary">
              SUBTOTAL ($)
            </Label>
            <Input
              id="subtotal"
              type="number"
              step="0.01"
              min="0"
              value={subtotal}
              onChange={(e) => setSubtotal(parseFloat(e.target.value) || 0)}
              className="mt-1 border-border font-mono text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="tax" className="font-mono text-xs text-primary">
              TAX ($)
            </Label>
            <Input
              id="tax"
              type="number"
              step="0.01"
              min="0"
              value={tax}
              onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
              className="mt-1 border-border font-mono text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="total" className="font-mono text-xs text-primary">
              TOTAL ($)
            </Label>
            <Input
              id="total"
              type="number"
              step="0.01"
              min="0"
              value={total}
              onChange={(e) => setTotal(parseFloat(e.target.value) || 0)}
              className="mt-1 border-border font-mono text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Order Items (read-only) */}
      <div className="border border-border bg-card p-6">
        <h3 className="font-mono text-lg text-primary mb-4">ORDER ITEMS</h3>
        <div className="space-y-3">
          {initialData.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-start pb-3 border-b border-border last:border-0"
            >
              <div className="flex-1">
                <div className="font-mono text-sm text-foreground">
                  {item.name}
                </div>
                <div className="font-mono text-xs text-muted-foreground mt-1">
                  {item.size} • Qty: {item.quantity}
                </div>
              </div>
              <div className="font-mono text-sm text-primary">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-primary font-mono text-background hover:bg-primary/80"
        >
          {mutation.isPending ? "UPDATING..." : "UPDATE ORDER"}
        </Button>
        <Button
          type="button"
          onClick={() => router.push("/admin/orders")}
          disabled={mutation.isPending}
          variant="outline"
          className="border-border font-mono text-primary"
        >
          CANCEL
        </Button>
      </div>
    </form>
  );
}
