"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { deleteCategory } from "@/lib/client/api"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  isActive: boolean
  sortOrder: number
  menuItemCount: number
}

interface CategoriesListProps {
  initialCategories: Category[]
}

export function CategoriesList({ initialCategories }: CategoriesListProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      router.refresh()
    },
    onError: (error: Error) => {
      console.error("Error deleting category:", error)
      alert(error.message)
    },
  })

  const handleDelete = (category: Category) => {
    if (category.menuItemCount > 0) {
      alert("Cannot delete category with menu items. Remove or reassign menu items first.")
      return
    }
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return
    deleteMutation.mutate(category.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button
          onClick={() => router.push("/admin/categories/new")}
          className="bg-primary font-mono text-background hover:bg-primary/80"
        >
          <Plus className="mr-2 h-4 w-4" />
          NEW CATEGORY
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border bg-card overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                ICON
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                NAME
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                SLUG
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                ITEMS
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                ORDER
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                STATUS
              </th>
              <th className="px-4 py-3 text-right font-mono text-xs text-primary">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {initialCategories.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <div className="font-mono text-sm text-[#F5F5DC]/60">
                    NO CATEGORIES FOUND
                  </div>
                </td>
              </tr>
            ) : (
              initialCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-border hover:bg-[#2D1810]"
                >
                  <td className="px-4 py-3">
                    <div className="text-2xl">{category.icon || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-sm text-[#F5F5DC]">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-[#F5F5DC]/80">
                    {category.slug}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-[#F5F5DC]/80">
                    {category.menuItemCount}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-[#F5F5DC]/80">
                    {category.sortOrder}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 font-mono text-xs ${category.isActive
                          ? "bg-green-900/30 text-green-400"
                          : "bg-red-900/30 text-red-400"
                        }`}
                    >
                      {category.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() =>
                          router.push(`/admin/categories/${category.id}/edit`)
                        }
                        variant="outline"
                        size="sm"
                        className="border-primary text-primary hover:bg-primary hover:text-[#1A0F08]"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(category)}
                        disabled={deleteMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
