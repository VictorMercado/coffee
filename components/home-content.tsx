"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { MenuItemCard } from "@/components/menu-item-card";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/lib/client/api/menu-items";
import { fetchMyOrders } from "@/lib/client/api/orders";
import { ArrowRight, UserPlus, X, Coffee } from "lucide-react";

interface HomeContentProps {
  featuredItems: MenuItem[];
}

export function HomeContent({ featuredItems }: HomeContentProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [guestBannerDismissed, setGuestBannerDismissed] = useState(false);
  const { data: session } = useSession();
  const isGuest = session?.user?.username === "guest";
  const isLoggedIn = !!session?.user && !isGuest;

  const { data: orders } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
    enabled: isLoggedIn,
    refetchInterval: 30000, // poll every 30s
  });

  const pendingOrders = orders?.filter(
    (o) => o.status === "PENDING" || o.status === "PREPARING"
  );
  const pendingOrdersReversed = pendingOrders?.reverse();
  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />

      {/* Guest Welcome Banner */}
      {isGuest && !guestBannerDismissed && (
        <div className="fixed top-16 sm:top-20 left-0 right-0 z-40 bg-primary/10 border-b border-primary backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <UserPlus className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="font-mono text-sm text-foreground">
                    <span className="text-primary">BROWSING AS GUEST</span> •{" "}
                    <Link href="/signup" className="underline hover:text-primary">
                      Create an account
                    </Link>{" "}
                    to save favorites and track orders
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGuestBannerDismissed(true)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={`${isGuest && !guestBannerDismissed ? "pt-[120px] sm:pt-[132px]" : "pt-16 sm:pt-20"}`}>
        <HeroSection />

        <div className="overflow-x-auto -mt-12 mb-4 relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 flex-nowrap w-fit mx-auto pb-2">
            {pendingOrdersReversed && pendingOrdersReversed.length > 0 && pendingOrdersReversed.map((order) => (
              <Link
                key={order.id}
                href={`/order-confirmation/${order.id}`}
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary rounded-full px-4 py-2 font-mono text-xs text-primary hover:bg-primary/20 transition-colors whitespace-nowrap shrink-0"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                </span>
                <Coffee className="w-4 h-4" />
                #{order.orderNumber}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Items Preview */}
        <section id="menu" className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-block border border-border px-4 py-1 mb-4">
                <span className="font-mono text-muted-foreground text-xs tracking-[0.3em]">
                  01 / FEATURED
                </span>
              </div>
              <h2 className="font-mono text-foreground text-2xl sm:text-4xl tracking-widest mb-4">
                <span className="text-primary">FEATURED</span> BREWS
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                Explore our handpicked selection of cosmic favorites
              </p>
            </div>

            {/* Featured Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredItems.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="font-mono text-muted-foreground">NO FEATURED ITEMS</div>
                </div>
              ) : (
                featuredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))
              )}
            </div>

            {/* View Full Menu Button */}
            <div className="text-center mt-12">
              <Link href="/menu">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono px-8">
                  VIEW FULL MENU
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

