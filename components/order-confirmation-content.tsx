"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/settings-store";
import { CheckCircle2, MapPin, Mail } from "lucide-react";

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
  items: OrderItem[];
}

interface OrderConfirmationContentProps {
  order: Order;
}

export function OrderConfirmationContent({ order }: OrderConfirmationContentProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { settings } = useSettings();

  const pricingEnabled = settings?.pricingEnabled ?? true;
  const prepTime = settings?.prepTime ?? 15;

  const estimatedReadyTime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + prepTime);
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }, [prepTime]);

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

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="pt-16 sm:pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-primary mb-4">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-mono text-3xl sm:text-4xl tracking-widest text-foreground mb-2">
              <span className="text-primary">ORDER</span> CONFIRMED
            </h1>
            <p className="text-muted-foreground">
              Your order has been received and is being prepared
            </p>
          </div>

          {/* Order Number */}
          <div className="border border-primary bg-primary/10 p-6 mb-8">
            <div className="text-center">
              <div className="font-mono text-sm text-muted-foreground mb-2">
                ORDER NUMBER
              </div>
              <div className="font-mono text-3xl text-primary tracking-widest">
                {order.orderNumber}
              </div>
              <div className="font-mono text-xs text-muted-foreground mt-2">
                {formatDate(order.createdAt)}
              </div>
              <div className="mt-3 font-mono text-sm text-muted-foreground">
                Estimated ready by{" "}
                <span className="text-primary font-bold">{estimatedReadyTime}</span>
                <span className="text-xs text-muted-foreground ml-1">({prepTime} min)</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="border border-border bg-card p-6 mb-6 space-y-4">
            <h2 className="font-mono text-lg text-primary mb-4">
              CUSTOMER INFORMATION
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-muted-foreground">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-xs text-muted-foreground">NAME</div>
                  <div className="font-mono text-sm text-foreground">{order.customerName}</div>
                </div>
              </div>

              {order.customerEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">EMAIL</div>
                    <div className="font-mono text-sm text-foreground">{order.customerEmail}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-border bg-card p-6 mb-6">
            <h2 className="font-mono text-lg text-primary mb-4">ORDER ITEMS</h2>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start pb-3 border-b border-border last:border-0"
                >
                  <div className="flex-1">
                    <div className="font-mono text-sm text-foreground">{item.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.size}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </span>
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

            {pricingEnabled ? (
              <div className="space-y-2 pt-4 mt-4 border-t border-border">
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
              <div className="pt-4 mt-4 border-t border-border">
                <div className="flex justify-between font-mono text-lg">
                  <span className="text-primary">TOTAL</span>
                  <span className="text-primary">FREE</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  Wow you must be special!!
                </p>
              </div>
            )}
          </div>

          {/* Pickup Information */}
          <div className="border border-border bg-primary/5 p-6 mb-8">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div>
                <div className="font-mono text-sm text-primary mb-2">PICKUP LOCATION</div>
                <div className="text-sm text-foreground">
                  Orbit Coffee<br />
                  123 Space Station Blvd<br />
                  Lunar Colony, Moon 90210
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/menu" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-border font-mono"
              >
                ORDER AGAIN
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
              >
                BACK TO HOME
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
