import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee, Star, Eye, EyeOff } from "lucide-react";
import * as MenuItemRepo from "@/lib/server/repo/menu-item";
import * as CategoryRepo from "@/lib/server/repo/category";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getDashboardData() {
  const [
    totalItems,
    activeItems,
    inactiveItems,
    featuredItems,
    categories,
    recentItems,
    categoryBreakdown,
  ] = await Promise.all([
    MenuItemRepo.countMenuItems(),
    MenuItemRepo.countMenuItems({ isActive: true }),
    MenuItemRepo.countMenuItems({ isActive: false }),
    MenuItemRepo.countMenuItems({ isFeatured: true, isActive: true }),
    CategoryRepo.findCategoriesWithCounts(),
    MenuItemRepo.findRecentMenuItems(5),
    CategoryRepo.findCategoriesBreakdown(),
  ]);

  return {
    stats: {
      total: totalItems,
      active: activeItems,
      inactive: inactiveItems,
      featured: featuredItems,
    },
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      itemCount: c.menuItemCount,
    })),
    recentItems: recentItems.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category.name,
      basePrice: item.basePrice,
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      createdAt: item.createdAt,
    })),
    categoryBreakdown,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <>
      <AdminHeader
        title="DASHBOARD"
        description="Overview of your menu items and statistics"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Items */}
          <div className="border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-primary tracking-wider">
                TOTAL ITEMS
              </span>
              <Coffee className="h-5 w-5 text-[#FF6B35]" />
            </div>
            <div className="font-mono text-3xl text-[#F5F5DC]">
              {data.stats.total}
            </div>
            <div className="mt-2 font-mono text-xs text-[#F5F5DC]/60">
              All menu items
            </div>
          </div>

          {/* Active Items */}
          <div className="border border-border bg-[#1A0F08] p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-primary tracking-wider">
                ACTIVE
              </span>
              <Eye className="h-5 w-5 text-green-400" />
            </div>
            <div className="font-mono text-3xl text-[#F5F5DC]">
              {data.stats.active}
            </div>
            <div className="mt-2 font-mono text-xs text-[#F5F5DC]/60">
              Visible to customers
            </div>
          </div>

          {/* Inactive Items */}
          <div className="border border-border bg-[#1A0F08] p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-primary tracking-wider">
                INACTIVE
              </span>
              <EyeOff className="h-5 w-5 text-red-400" />
            </div>
            <div className="font-mono text-3xl text-[#F5F5DC]">
              {data.stats.inactive}
            </div>
            <div className="mt-2 font-mono text-xs text-[#F5F5DC]/60">
              Hidden items
            </div>
          </div>

          {/* Featured Items */}
          <div className="border border-border bg-[#1A0F08] p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-primary tracking-wider">
                FEATURED
              </span>
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div className="font-mono text-3xl text-[#F5F5DC]">
              {data.stats.featured}
            </div>
            <div className="mt-2 font-mono text-xs text-[#F5F5DC]/60">
              Homepage items
            </div>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="border border-border bg-[#1A0F08] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-lg text-primary">
              CATEGORIES BREAKDOWN
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.categories.map((category) => (
              <div
                key={category.id}
                className="border border-border/30 bg-[#2D1810] p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  {category.icon && (
                    <span className="text-2xl">{category.icon}</span>
                  )}
                  <div className="font-mono text-sm text-primary">
                    {category.name}
                  </div>
                </div>
                <div className="font-mono text-2xl text-[#F5F5DC]">
                  {category.itemCount}
                </div>
                <div className="font-mono text-xs text-[#F5F5DC]/60 mt-1">
                  {category.itemCount === 1 ? "item" : "items"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Items */}
        <div className="border border-border bg-[#1A0F08] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-lg text-primary">
              RECENTLY ADDED
            </h2>
            <Link href="/admin/menu-items">
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-[#1A0F08]"
              >
                VIEW ALL
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {data.recentItems.length === 0 ? (
              <div className="text-center py-8 font-mono text-[#F5F5DC]/60">
                NO ITEMS YET
              </div>
            ) : (
              data.recentItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/menu-items/${item.id}/edit`}
                  className="block border border-border/20 bg-[#2D1810] p-4 hover:bg-[#3D2820] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-[#F5F5DC]">
                          {item.name}
                        </span>
                        {item.isFeatured && (
                          <Star className="h-3 w-3 text-primary fill-[#D4AF37]" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs flex-wrap">
                        <span className="font-mono text-[#F5F5DC]/60">
                          {item.category}
                        </span>
                        <span className="font-mono text-[#FF6B35]">
                          ${item.basePrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`px-2 py-0.5 font-mono text-xs ${item.isActive
                          ? "bg-green-900/30 text-green-400"
                          : "bg-red-900/30 text-red-400"
                          }`}
                      >
                        {item.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                      <span className="font-mono text-xs text-[#F5F5DC]/40">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
