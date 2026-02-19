"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/lib/client/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Clock, CheckCircle2, XCircle, Package, Pencil } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  itemCount: number;
  items: OrderItem[];
}

interface OrdersListProps {
  initialOrders: Order[];
}

const statusConfig = {
  PENDING: { label: "PENDING", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-900/30" },
  PREPARING: { label: "PREPARING", icon: Package, color: "text-blue-500", bg: "bg-blue-900/30" },
  READY: { label: "READY", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-900/30" },
  COMPLETED: { label: "COMPLETED", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-900/20" },
  CANCELLED: { label: "CANCELLED", icon: XCircle, color: "text-red-500", bg: "bg-red-900/30" },
};

function ClientDate({ date }: { date: string; }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <span>...</span>;

  return (
    <span>
      {new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}
    </span>
  );
};

export function OrdersList({ initialOrders }: OrdersListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string; }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      router.refresh();
    },
    onError: (error: Error) => {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    },
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="border border-border bg-card p-4">
            <div className="font-mono text-xs text-muted-foreground mb-1">TOTAL ORDERS</div>
            <div className="font-mono text-2xl text-primary">{orders.length}</div>
          </div>
          <div className="border border-border bg-card p-4">
            <div className="font-mono text-xs text-muted-foreground mb-1">PENDING</div>
            <div className="font-mono text-2xl text-yellow-500">
              {orders.filter(o => o.status === "PENDING").length}
            </div>
          </div>
          <div className="border border-border bg-card p-4">
            <div className="font-mono text-xs text-muted-foreground mb-1">PREPARING</div>
            <div className="font-mono text-2xl text-blue-500">
              {orders.filter(o => o.status === "PREPARING").length}
            </div>
          </div>
          <div className="border border-border bg-card p-4">
            <div className="font-mono text-xs text-muted-foreground mb-1">READY</div>
            <div className="font-mono text-2xl text-green-500">
              {orders.filter(o => o.status === "READY").length}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="border border-border bg-card overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                  ORDER #
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                  CUSTOMER
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                  ITEMS
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                  TOTAL
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                  STATUS
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                  TIME
                </th>
                <th className="px-4 py-3 text-right font-mono text-xs text-primary">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="font-mono text-sm text-[#F5F5DC]/60">
                      NO ORDERS YET
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock;
                  const statusColor = statusConfig[order.status as keyof typeof statusConfig]?.color || "text-gray-500";
                  const statusBg = statusConfig[order.status as keyof typeof statusConfig]?.bg || "bg-gray-900/30";

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-border hover:bg-[#2D1810]"
                    >
                      <td className="px-4 py-3">
                        <div className="font-mono text-sm text-[#FF6B35]">
                          {order.orderNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-sm text-[#F5F5DC]">
                          {order.customerName}
                        </div>
                        {order.customerEmail && (
                          <div className="font-mono text-xs text-[#F5F5DC]/60 mt-1">
                            {order.customerEmail}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-[#F5F5DC]/80">
                        {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-[#FF6B35]">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className={`w-32 border-0 ${statusBg} ${statusColor} font-mono text-xs`}>
                            <div className="flex items-center gap-2">
                              <StatusIcon className="w-3 h-3" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">PENDING</SelectItem>
                            <SelectItem value="PREPARING">PREPARING</SelectItem>
                            <SelectItem value="READY">READY</SelectItem>
                            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#F5F5DC]/60">
                        <ClientDate date={order.createdAt} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleViewDetails(order)}
                            variant="outline"
                            size="sm"
                            className="border-primary text-primary hover:bg-primary hover:text-[#1A0F08]"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() => router.push(`/admin/orders/${order.id}/edit`)}
                            variant="outline"
                            size="sm"
                            className="border-primary text-primary hover:bg-primary hover:text-[#1A0F08]"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-primary">
              ORDER DETAILS • {selectedOrder?.orderNumber}
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-muted-foreground">
              {selectedOrder && formatDate(selectedOrder.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="border border-border bg-card p-4">
                <div className="font-mono text-xs text-primary mb-3">CUSTOMER</div>
                <div className="space-y-1">
                  <div className="font-mono text-sm text-foreground">
                    {selectedOrder.customerName}
                  </div>
                  {selectedOrder.customerEmail && (
                    <div className="font-mono text-xs text-muted-foreground">
                      {selectedOrder.customerEmail}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="border border-border bg-card p-4">
                <div className="font-mono text-xs text-primary mb-3">ITEMS</div>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
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

              {/* Order Total */}
              <div className="border border-border bg-card p-4">
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-muted-foreground">SUBTOTAL</span>
                    <span className="text-foreground">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-muted-foreground">TAX</span>
                    <span className="text-foreground">${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-mono text-lg pt-2 border-t border-border">
                    <span className="text-primary">TOTAL</span>
                    <span className="text-primary">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
