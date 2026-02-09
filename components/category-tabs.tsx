"use client"
import { Category } from "@/lib/client/api/categories"

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: {
  categories: Category[]
  activeCategory: Category | "all"
  onCategoryChange: (category: Category | "all") => void
}) {
  return (
    <div className="border-b border-border">
      <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide">
        {/* All Items Tab */}
        <button
          onClick={() => onCategoryChange("all")}
          className={`
            flex items-center gap-2 px-6 py-4 font-mono text-sm tracking-[0.15em] whitespace-nowrap transition-colors border-b-2 -mb-[2px]
            ${
              activeCategory === "all"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }
          `}
        >
          <span>◉</span>
          <span>ALL</span>
        </button>

        {/* Category Tabs */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category)}
            className={`
              flex items-center gap-2 px-6 py-4 font-mono text-sm tracking-[0.15em] whitespace-nowrap transition-colors border-b-2 -mb-[2px]
              ${
                activeCategory !== "all" && activeCategory.id === category.id
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }
            `}
          >
            {category.icon && <span>{category.icon}</span>}
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
