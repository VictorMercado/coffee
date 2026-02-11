"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/cart-drawer";
import { useSettings } from "@/lib/settings-store";
import { fetchMyOrders } from "@/lib/client/api";
import { Clock, CheckCircle2, XCircle, Package, ChevronDown, ChevronUp } from "lucide-react";

interface User {
  id: string;
  username: string;
  email?: string | null;
  role: string;
}

interface MyOrdersContentProps {
  user: User;
}

const statusConfig = {
  PENDING: {
    label: "Order Received",
    description: "Your order has been received and is being prepared",
    icon: Clock,
    color: "text-yellow-500",
    bg: "bg-yellow-900/30",
    border: "border-yellow-500",
  },
  PREPARING: {
    label: "Preparing",
    description: "Your order is being prepared by our baristas",
    icon: Package,
    color: "text-blue-500",
    bg: "bg-blue-900/30",
    border: "border-blue-500",
  },
  READY: {
    label: "Ready for Pickup",
    description: "Your order is ready! Please come pick it up",
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-900/30",
    border: "border-green-500",
  },
  COMPLETED: {
    label: "Completed",
    description: "Order completed",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-900/20",
    border: "border-green-400",
  },
  CANCELLED: {
    label: "Cancelled",
    description: "This order was cancelled",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-900/30",
    border: "border-red-500",
  },
};

export function MyOrdersContent({ user }: MyOrdersContentProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const { settings } = useSettings();

  const { data: orders = [], isLoading: loading } = useQuery({
    queryKey: ["myOrders"],
    queryFn: fetchMyOrders,
  });

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getReadyByTime = (createdAt: string) => {
    const orderTime = new Date(createdAt);
    const prepMinutes = settings?.prepTime ?? 15;
    const readyTime = new Date(orderTime.getTime() + prepMinutes * 60 * 1000);
    return readyTime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const pricingEnabled = settings?.pricingEnabled ?? true;

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="pt-16 sm:pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-mono text-3xl sm:text-4xl tracking-widest text-foreground">
              <span className="text-primary">MY</span> ORDERS
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your order status and history
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="font-mono text-muted-foreground">LOADING ORDERS...</div>
            </div>
          ) : orders.length === 0 ? (
            /* Empty State */
            <div className="border border-border bg-card p-12 text-center">
              <div className="font-mono text-lg text-muted-foreground mb-4">
                NO ORDERS YET
              </div>
              <p className="text-muted-foreground mb-6">
                You haven't placed any orders yet. Start browsing our menu!
              </p>
              <Link href="/menu">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono">
                  VIEW MENU
                </Button>
              </Link>
            </div>
          ) : (
            /* Orders List */
            <div className="space-y-4">
              {orders.map((order) => {
                const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING;
                const StatusIcon = config.icon;
                const isExpanded = expandedOrders.has(order.id);

                return (
                  <div
                    key={order.id}
                    className={`border ${config.border} bg-card overflow-hidden`}
                  >
                    {/* Order Header */}
                    <div
                      className={`${config.bg} p-4 sm:p-6 cursor-pointer`}
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <StatusIcon className={`w-5 h-5 ${config.color}`} />
                            <div className="font-mono text-lg text-primary">
                              {order.orderNumber}
                            </div>
                          </div>
                          <div className={`font-mono text-sm ${config.color} mb-1`}>
                            {config.label}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {config.description}
                          </div>
                          <div className="font-mono text-xs text-muted-foreground mt-2">
                            {formatDate(order.createdAt)}
                          </div>
                          {(order.status === "PENDING" || order.status === "PREPARING") && (
                            <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-1 border border-primary/30 bg-primary/5">
                              <Clock className="w-3 h-3 text-primary" />
                              <span className="font-mono text-xs text-primary tracking-wider">
                                READY BY {getReadyByTime(order.createdAt)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {pricingEnabled && (
                            <div className="font-mono text-xl text-primary mb-2">
                              ${order.total.toFixed(2)}
                            </div>
                          )}
                          <div className="font-mono text-xs text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? "item" : "items"}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 font-mono text-xs"
                          >
                            {isExpanded ? (
                              <>
                                HIDE <ChevronUp className="w-3 h-3 ml-1" />
                              </>
                            ) : (
                              <>
                                DETAILS <ChevronDown className="w-3 h-3 ml-1" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Order Details (Expandable) */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 border-t border-border space-y-4">
                        {/* Items */}
                        <div>
                          <div className="font-mono text-xs text-primary mb-3">ITEMS</div>
                          <div className="space-y-3">
                            {order.items.map((item) => (
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
                                {pricingEnabled && (
                                  <div className="font-mono text-sm text-primary">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Totals */}
                        {pricingEnabled ? (
                          <div className="border-t border-border pt-4 space-y-2">
                            <div className="flex justify-between font-mono text-sm">
                              <span className="text-muted-foreground">SUBTOTAL</span>
                              <span className="text-foreground">${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-mono text-sm">
                              <span className="text-muted-foreground">TAX</span>
                              <span className="text-foreground">${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-mono text-lg pt-2 border-t border-border">
                              <span className="text-primary">TOTAL</span>
                              <span className="text-primary">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="border-t border-border pt-4">
                            <div className="flex justify-between font-mono text-lg">
                              <span className="text-primary">TOTAL</span>
                              <span className="text-primary">FREE</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 text-right">
                              No charge for household orders
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                          <Link href={`/order-confirmation/${order.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full border-border font-mono"
                            >
                              VIEW RECEIPT
                            </Button>
                          </Link>
                          <Link href="/menu" className="flex-1">
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono">
                              ORDER AGAIN
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
