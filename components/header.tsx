"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";

export function Header({ onCartClick }: { onCartClick: () => void; }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = useCart((state) => state.itemCount());
  const pathname = usePathname();
  const { data: session } = useSession();
  const isGuest = session?.user?.username === "guest";
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-primary flex items-center justify-center">
              <span className="font-mono text-primary text-lg sm:text-xl">◉</span>
            </div>
            <div>
              <h1 className="font-mono text-primary text-lg sm:text-xl tracking-[0.2em]">ORBIT</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground tracking-[0.3em]">COFFEE CO.</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/" active={pathname === "/"}>HOME</NavLink>
            <NavLink href="/menu" active={pathname === "/menu"}>MENU</NavLink>
            {session && !isGuest && (
              <NavLink href="/orders" active={pathname === "/orders"}>ORDERS</NavLink>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isAdmin && (
              <Link href="/admin">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:text-primary hover:bg-muted"
                >
                  <Shield className="w-5 h-5" />
                  <span className="sr-only">Admin Portal</span>
                </Button>
              </Link>
            )}
            <Link href="/account">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:text-primary hover:bg-muted"
                >
                  <User className="w-5 h-5" />
                  <span className="sr-only">Account</span>
                </Button>
                {isGuest && session && (
                  <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[8px] font-mono px-1 py-0.5">
                    GUEST
                  </span>
                )}
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-primary hover:bg-muted relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-mono flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground hover:text-primary hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border flex flex-col gap-4">
            <NavLink href="/" active={pathname === "/"} mobile>HOME</NavLink>
            <NavLink href="/menu" active={pathname === "/menu"} mobile>MENU</NavLink>
            {session && !isGuest && (
              <NavLink href="/orders" active={pathname === "/orders"} mobile>ORDERS</NavLink>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  active,
  mobile
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        font-mono text-sm tracking-[0.15em] transition-colors
        ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}
        ${mobile ? "px-2 py-1" : ""}
      `}
    >
      {children}
    </Link>
  );
}
