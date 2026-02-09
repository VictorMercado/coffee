"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart-store";
import { useSettings } from "@/lib/settings-store";
import { createOrder } from "@/lib/client/api";
import { ArrowLeft, Loader2 } from "lucide-react";

interface User {
  id: string;
  username: string;
  email?: string | null;
  role: string;
}

interface CheckoutContentProps {
  user: User;
}

export function CheckoutContent({ user }: CheckoutContentProps) {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { settings } = useSettings();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: user.username !== "guest" ? user.username : "",
    email: user.email ?? "",
  });

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      clearCart();
      router.push(`/order-confirmation/${order.id}`);
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to place order. Please try again.");
    },
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !mutation.isPending) {
      router.push("/menu");
    }
  }, [items, router, mutation.isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    mutation.mutate({
      customerName: formData.name,
      customerEmail: formData.email || null,
      items: items.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      })),
      total: total(),
    });
  };

  const pricingEnabled = settings?.pricingEnabled ?? true;
  const taxRate = settings?.taxRate ?? 8.0;
  const subtotal = pricingEnabled ? total() : 0;
  const tax = pricingEnabled ? subtotal * (taxRate / 100) : 0;
  const totalWithTax = pricingEnabled ? subtotal + tax : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="pt-16 sm:pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/menu">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK TO MENU
              </Button>
            </Link>
            <h1 className="font-mono text-3xl sm:text-4xl tracking-widest text-foreground">
              <span className="text-primary">CHECKOUT</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Review your order and complete checkout
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="border border-border bg-card p-6 space-y-4">
                  <h2 className="font-mono text-lg text-primary">
                    CUSTOMER INFORMATION
                  </h2>

                  <div>
                    <Label htmlFor="name" className="font-mono text-xs text-muted-foreground">
                      NAME *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="mt-1"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="font-mono text-xs text-muted-foreground">
                      EMAIL
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="mt-1"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {error && (
                  <div className="border border-red-500 bg-red-900/20 p-4">
                    <p className="font-mono text-sm text-red-400">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono py-6 text-lg"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      PLACING ORDER...
                    </>
                  ) : pricingEnabled ? (
                    `PLACE ORDER • $${totalWithTax.toFixed(2)}`
                  ) : (
                    "PLACE FREE ORDER"
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="border border-border bg-card p-6 space-y-4 lg:sticky lg:top-24">
                <h2 className="font-mono text-lg text-primary">ORDER SUMMARY</h2>

                {/* Cart Items */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex gap-4 pb-4 border-b border-border last:border-0"
                    >
                      <div className="flex-1">
                        <div className="font-mono text-sm text-foreground">
                          {item.name}
                        </div>
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

                {/* Totals */}
                {pricingEnabled ? (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex justify-between font-mono text-sm">
                      <span className="text-muted-foreground">SUBTOTAL</span>
                      <span className="text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-mono text-sm">
                      <span className="text-muted-foreground">TAX ({taxRate.toFixed(1)}%)</span>
                      <span className="text-foreground">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-mono text-lg pt-3 border-t border-border">
                      <span className="text-primary">TOTAL</span>
                      <span className="text-primary">${totalWithTax.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between font-mono text-lg">
                      <span className="text-primary">TOTAL</span>
                      <span className="text-primary">FREE</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-right">
                      No charge for household orders
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
