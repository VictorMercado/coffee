"use client"

import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { fetchIngredients, deleteIngredient } from "@/lib/client/api"

export default function IngredientsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: ingredients = [], isLoading } = useQuery({
    queryKey: ["ingredients"],
    queryFn: fetchIngredients,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] })
    },
    onError: (error: Error) => {
      alert(error.message || "Failed to delete ingredient")
    },
  })

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this ingredient?")) return
    deleteMutation.mutate(id)
  }

  return (
    <>
      <AdminHeader
        title="INGREDIENTS"
        description="Manage ingredient database"
      />
      <div className="p-8">
        <div className="mb-6 flex items-center justify-end">
          <Button
            onClick={() => router.push("/admin/ingredients/new")}
            className="bg-primary font-mono text-background hover:bg-primary/80"
          >
            <Plus className="mr-2 h-4 w-4" />
            NEW INGREDIENT
          </Button>
        </div>

        <div className="border border-border bg-[#1A0F08]">
          {isLoading ? (
            <div className="p-12 text-center font-mono text-primary">
              LOADING...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left font-mono text-xs text-primary tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-4 text-left font-mono text-xs text-primary tracking-wider">
                    DESCRIPTION
                  </th>
                  <th className="px-6 py-4 text-left font-mono text-xs text-primary tracking-wider">
                    ALLERGENS
                  </th>
                  <th className="px-6 py-4 text-right font-mono text-xs text-primary tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ingredients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <p className="font-mono text-sm text-muted-foreground">
                        NO INGREDIENTS YET
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Create your first ingredient to get started
                      </p>
                    </td>
                  </tr>
                ) : (
                  ingredients.map((ingredient) => (
                    <tr
                      key={ingredient.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-sm text-foreground">
                        {ingredient.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                        {ingredient.description || "-"}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                        {ingredient.allergens || "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() =>
                              router.push(`/admin/ingredients/${ingredient.id}/edit`)
                            }
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-foreground hover:text-primary hover:bg-muted"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(ingredient.id)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-foreground hover:text-destructive hover:bg-muted"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
