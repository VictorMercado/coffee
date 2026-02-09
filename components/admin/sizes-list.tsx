"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AdminHeader } from "@/components/admin/admin-header"
import { Switch } from "@/components/ui/switch"
import { updateSizeStatus } from "@/lib/client/api"
import { Loader2 } from "lucide-react"

interface Size {
  id: string
  name: string
  abbreviation: string
  priceModifier: number
  isActive: boolean
  sortOrder: number
  menuItemCount: number
}

interface SizesListProps {
  sizes: Size[]
}

export function SizesList({ sizes: initialSizes }: SizesListProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [sizes, setSizes] = useState(initialSizes)
  const [error, setError] = useState("")

  const mutation = useMutation({
    mutationFn: ({ sizeId, isActive }: { sizeId: string; isActive: boolean }) =>
      updateSizeStatus(sizeId, isActive),
    onMutate: async ({ sizeId, isActive }) => {
      // Optimistic update
      setSizes((prev) =>
        prev.map((size) =>
          size.id === sizeId ? { ...size, isActive } : size
        )
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] })
      router.refresh()
    },
    onError: (error: Error, variables) => {
      // Revert optimistic update on error
      setSizes((prev) =>
        prev.map((size) =>
          size.id === variables.sizeId ? { ...size, isActive: !variables.isActive } : size
        )
      )
      setError(error.message || "Failed to update size")
    },
  })

  const handleToggle = (sizeId: string, currentValue: boolean) => {
    setError("")
    mutation.mutate({ sizeId, isActive: !currentValue })
  }

  return (
    <>
      <AdminHeader
        title="SIZES"
        description="Manage available sizes for menu items"
      />
      <div className="p-8 space-y-6">
        {error && (
          <div className="border border-red-500 bg-red-900/20 p-4">
            <p className="font-mono text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="border border-border bg-[#1A0F08]">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left font-mono text-xs text-primary tracking-wider">
                  NAME
                </th>
                <th className="px-6 py-4 text-left font-mono text-xs text-primary tracking-wider">
                  ABBREVIATION
                </th>
                <th className="px-6 py-4 text-left font-mono text-xs text-primary tracking-wider">
                  PRICE MODIFIER
                </th>
                <th className="px-6 py-4 text-left font-mono text-xs text-primary tracking-wider">
                  MENU ITEMS
                </th>
                <th className="px-6 py-4 text-center font-mono text-xs text-primary tracking-wider">
                  ACTIVE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sizes.map((size) => (
                <tr
                  key={size.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-foreground">
                      {size.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-muted-foreground">
                      {size.abbreviation}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-muted-foreground">
                      {size.priceModifier > 0 && "+"}${size.priceModifier.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-muted-foreground">
                      {size.menuItemCount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center">
                      <Switch
                        checked={size.isActive}
                        onCheckedChange={() => handleToggle(size.id, size.isActive)}
                        disabled={mutation.isPending}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-border bg-card p-4">
          <p className="font-mono text-xs text-muted-foreground">
            <span className="text-primary">NOTE:</span> Disabling a size will hide it from customers but won't affect existing menu item configurations. You can re-enable sizes at any time.
          </p>
        </div>
      </div>
    </>
  )
}
