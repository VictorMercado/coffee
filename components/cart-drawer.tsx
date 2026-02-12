"use client";

import { useRouter } from "next/navigation";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/client/cart-store";
import { useSettings } from "@/lib/settings-store";

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const total = useCart((state) => state.total());
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const clearCart = useCart((state) => state.clearCart);
  const { settings } = useSettings();

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  const pricingEnabled = settings?.pricingEnabled ?? true;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
            <div>
              <h2 className="font-mono text-primary text-lg tracking-[0.2em]">YOUR ORDER</h2>
              <p className="text-muted-foreground text-xs font-mono">
                {items.length} {items.length === 1 ? "ITEM" : "ITEMS"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-foreground hover:text-primary hover:bg-muted"
            >
              <X className="w-5 h-5" />
              <span className="sr-only">Close cart</span>
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 border-2 border-border flex items-center justify-center mb-4">
                  <span className="font-mono text-4xl text-muted-foreground">◎</span>
                </div>
                <p className="font-mono text-muted-foreground tracking-wider text-sm">
                  YOUR CART IS EMPTY
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  Add some cosmic brews to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="bg-muted border border-border p-4"
                  >
                    <div className="flex gap-4">
                      {/* Image placeholder */}
                      <div className="w-16 h-16 bg-background border border-border flex items-center justify-center shrink-0">
                        <span className="font-mono text-2xl text-muted-foreground">☕</span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-mono text-foreground text-sm tracking-wider uppercase truncate">
                              {item.name}
                            </h4>
                            <p className="font-mono text-muted-foreground text-xs">
                              SIZE: {item.size}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id, item.size)}
                            className="text-muted-foreground hover:text-destructive hover:bg-transparent h-6 w-6"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity controls */}
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center font-mono text-sm text-foreground border-x border-border">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          {pricingEnabled && (
                            <span className="font-mono text-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear cart button */}
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="w-full text-muted-foreground hover:text-destructive font-mono text-xs tracking-wider"
                >
                  CLEAR ALL ITEMS
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-border bg-background">
              {pricingEnabled && (
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-muted-foreground tracking-wider text-sm">
                    SUBTOTAL
                  </span>
                  <span className="font-mono text-foreground text-xl">
                    ${total.toFixed(2)}
                  </span>
                </div>
              )}
              <Button
                onClick={handleCheckout}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono tracking-[0.2em] py-6 text-sm"
              >
                CHECKOUT
              </Button>
              {pricingEnabled && (
                <p className="text-center text-muted-foreground text-xs mt-3">
                  Taxes calculated at checkout
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
