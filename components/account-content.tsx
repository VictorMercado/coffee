"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import { LogOut, User, Shield } from "lucide-react"

interface AccountContentProps {
  user: {
    id: string
    username: string
    email?: string | null
    role: string
  } | null
}

export function AccountContent({ user }: AccountContentProps) {
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const isGuest = user?.username === "guest"

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="border border-border bg-card">
            {/* Header */}
            <div className="border-b border-border p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 border-2 border-primary flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-mono text-2xl text-foreground tracking-widest">
                      {isGuest ? "GUEST ACCOUNT" : "ACCOUNT"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isGuest ? "Browsing as guest" : `@${user?.username}`}
                    </p>
                  </div>
                </div>
                {!isGuest && (
                  <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    variant="outline"
                    className="border-border font-mono"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    SIGN OUT
                  </Button>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="p-6 sm:p-8 space-y-6">
              {isGuest ? (
                // Guest user - show sign-up prompt
                <div className="space-y-6">
                  {/* Guest Status Banner */}
                  <div className="bg-primary/10 border-2 border-primary p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 border-2 border-primary flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-mono text-lg text-primary">
                          YOU'RE SIGNED IN AS GUEST
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Browsing mode • Limited features
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#2D1810] border border-primary/30 p-6 space-y-4">
                    <h2 className="font-mono text-lg text-primary">
                      UPGRADE TO FULL ACCOUNT
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Create your own account to unlock all features and save your preferences.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">✓</span>
                        <span>Save favorite items</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">✓</span>
                        <span>Track order history</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">✓</span>
                        <span>Earn loyalty rewards</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">✓</span>
                        <span>Faster checkout</span>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Link href="/signup">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono">
                          SIGN UP NOW
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-mono text-sm text-foreground mb-3">
                      ALREADY HAVE AN ACCOUNT?
                    </h3>
                    <Button
                      onClick={() => router.push("/signin")}
                      variant="outline"
                      className="w-full border-border font-mono"
                    >
                      SIGN IN
                    </Button>
                  </div>
                </div>
              ) : (
                // Registered user - show account details
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-muted-foreground tracking-wider">
                      USERNAME
                    </div>
                    <div className="text-foreground font-mono">
                      @{user?.username}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-mono text-muted-foreground tracking-wider">
                      ROLE
                    </div>
                    <div className="flex items-center gap-2">
                      {user?.role === "ADMIN" && (
                        <Shield className="w-4 h-4 text-primary" />
                      )}
                      <span className="text-foreground font-mono">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Access - only for non-guest admins */}
              {!isGuest && user?.role === "ADMIN" && (
                <div className="border-t border-border pt-6 mt-6">
                  <h2 className="font-mono text-lg text-foreground mb-4">
                    ADMIN ACCESS
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    You have administrator privileges. Access the admin dashboard to manage the menu.
                  </p>
                  <Button
                    onClick={() => router.push("/admin")}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    GO TO ADMIN DASHBOARD
                  </Button>
                </div>
              )}

              {/* Order History Placeholder - only for non-guest users */}
              {!isGuest && (
                <div className="border-t border-border pt-6 mt-6">
                  <h2 className="font-mono text-lg text-foreground mb-4">
                    ORDER HISTORY
                  </h2>
                  <div className="text-center py-8 border border-border border-dashed">
                    <p className="text-muted-foreground font-mono text-sm">
                      NO ORDERS YET
                    </p>
                    <p className="text-muted-foreground text-xs mt-2">
                      Order history feature coming soon
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
