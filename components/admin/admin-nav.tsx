"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, Package, Tag, Settings, LayoutDashboard, FolderOpen, ShoppingBag, Ruler, Users } from "lucide-react";

const navigation = [
  { name: "DASHBOARD", href: "/admin", icon: LayoutDashboard },
  { name: "ORDERS", href: "/admin/orders", icon: ShoppingBag },
  { name: "USERS", href: "/admin/users", icon: Users },
  { name: "MENU ITEMS", href: "/admin/menu-items", icon: Coffee },
  { name: "CATEGORIES", href: "/admin/categories", icon: FolderOpen },
  { name: "SIZES", href: "/admin/sizes", icon: Ruler },
  { name: "INGREDIENTS", href: "/admin/ingredients", icon: Package },
  { name: "TAGS", href: "/admin/tags", icon: Tag },
  { name: "SETTINGS", href: "/admin/settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-lg font-bold text-primary whitespace-nowrap"
        >
          ORBIT COFFEE
        </Link>

        {/* Scrollable Nav Pills */}
        <nav className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 min-w-max">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs transition-all whitespace-nowrap
                    ${isActive
                      ? "bg-primary text-background shadow-lg"
                      : "bg-[#2D1810] text-primary hover:bg-[#3D2820] border border-border/30"
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
