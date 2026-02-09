"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Coffee, Package, Tag, Settings, LayoutDashboard, FolderOpen, ShoppingBag, Ruler } from "lucide-react"

const navigation = [
  { name: "ADMIN", href: "/admin", icon: LayoutDashboard },
  { name: "ORDERS", href: "/admin/orders", icon: ShoppingBag },
  { name: "MENU ITEMS", href: "/admin/menu-items", icon: Coffee },
  { name: "CATEGORIES", href: "/admin/categories", icon: FolderOpen },
  { name: "SIZES", href: "/admin/sizes", icon: Ruler },
  { name: "INGREDIENTS", href: "/admin/ingredients", icon: Package },
  { name: "TAGS", href: "/admin/tags", icon: Tag },
  { name: "SETTINGS", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-[#1A0F08]">
      <div className="border-b border-border p-6">
        <h1 className="font-mono text-xl font-bold text-primary">
          <Link href="/">ORBIT COFFEE</Link>
        </h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 font-mono text-sm transition-colors ${
                isActive
                  ? "bg-primary text-background"
                  : "text-primary hover:bg-[#2D1810]"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
