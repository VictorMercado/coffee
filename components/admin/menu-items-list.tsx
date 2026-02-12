"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { deleteMenuItem } from "@/lib/client/api"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  basePrice: number
  category: { name: string }
  isActive: boolean
  isFeatured: boolean
}

interface MenuItemsListProps {
  initialItems: MenuItem[]
}

export function MenuItemsList({ initialItems }: MenuItemsListProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] })
      router.refresh()
    },
    onError: (error) => {
      console.error("Error deleting item:", error)
      alert("Failed to delete item")
    },
  })

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return
    deleteMutation.mutate(id)
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-end">
        <Button
          onClick={() => router.push("/admin/menu-items/new")}
          className="bg-primary font-mono text-background hover:bg-primary/80"
        >
          <Plus className="mr-2 h-4 w-4" />
          NEW ITEM
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border bg-[#1A0F08] overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                NAME
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                CATEGORY
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                PRICE
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
            {initialItems.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border hover:bg-[#2D1810]"
              >
                <td className="px-4 py-3">
                  <div className="font-mono text-sm text-[#F5F5DC]">
                    {item.name}
                  </div>
                  {item.isFeatured && (
                    <span className="mt-1 inline-block bg-primary px-2 py-0.5 font-mono text-[10px] text-[#1A0F08]">
                      FEATURED
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-sm text-[#F5F5DC]/80">
                  {item.category?.name || "N/A"}
                </td>
                <td className="px-4 py-3 font-mono text-sm text-[#FF6B35]">
                  ${item.basePrice.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 font-mono text-xs ${
                      item.isActive
                        ? "bg-green-900/30 text-green-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {item.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-[#1A0F08]"
                    >
                      <Link href={`/menu/${item.id}`}>
                        <Eye className="h-3 w-3" />
                      </Link>
                    </Button>
                    <Button
                      onClick={() =>
                        router.push(`/admin/menu-items/${item.id}/edit`)
                      }
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-[#1A0F08]"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
