"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Header } from "@/components/header"
import { CategoryTabs } from "@/components/category-tabs"
import { MenuItemCard } from "@/components/menu-item-card"
import { CartDrawer } from "@/components/cart-drawer"
import { Footer } from "@/components/footer"
import { MenuItem } from "@/lib/client/api/menu-items"
import { Category } from "@/lib/client/api/categories"
import { UserPlus, X } from "lucide-react"

interface MenuContentProps {
  menuItems: MenuItem[]
  categories: Category[]
}

export function MenuContent({ menuItems, categories }: MenuContentProps) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all")
  const [guestBannerDismissed, setGuestBannerDismissed] = useState(false)
  const { data: session } = useSession()
  const isGuest = session?.user?.username === "guest"

  const filteredItems = activeCategory === "all"
    ? menuItems
    : menuItems.filter((item) => item.categoryId === activeCategory.id)

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
        {/* Page Header */}
        <section className="border-b border-border py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block border border-border px-4 py-1 mb-4">
                <span className="font-mono text-muted-foreground text-xs tracking-[0.3em]">
                  FULL MENU
                </span>
              </div>
              <h1 className="font-mono text-foreground text-3xl sm:text-5xl tracking-widest mb-4">
                <span className="text-primary">COSMIC</span> BREWS
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Each cup is precision-crafted with beans sourced from the finest orbital farms.
                Select your category to explore our full range of offerings.
              </p>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Tabs */}
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
              {filteredItems.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="font-mono text-muted-foreground">NO ITEMS FOUND</div>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
