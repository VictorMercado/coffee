"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MenuItemForm } from "./menu-item-form"
import { SelectedIngredient } from "./ingredient-selector"
import { RecipeStep } from "./recipe-steps-editor"
import { createMenuItem, updateMenuItem, uploadMenuItemImage } from "@/lib/client/api/menu-items"
import type { CreateMenuItemInput } from "@/lib/client/api/menu-items"

interface MenuItemFormWrapperProps {
  menuItemId?: string
  initialData?: any
  categories: Array<{ id: string; name: string; slug: string }>
  sizes: Array<{ id: string; name: string; abbreviation: string; priceModifier?: number }>
  tags: Array<{ id: string; name: string }>
  ingredients: Array<{ id: string; name: string; description?: string | null }>
}

interface FormData {
  name: string
  description: string
  basePrice: number
  categoryId: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  sizeIds: string[]
  tagIds: string[]
  ingredients: SelectedIngredient[]
  recipeSteps: RecipeStep[]
}

export function MenuItemFormWrapper({
  menuItemId,
  initialData,
  categories,
  sizes,
  tags,
  ingredients,
}: MenuItemFormWrapperProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const saveMutation = useMutation({
    mutationFn: async ({
      data,
      imageFile,
    }: {
      data: CreateMenuItemInput
      imageFile: File | null
    }) => {
      const savedItem = menuItemId
        ? await updateMenuItem(menuItemId, data)
        : await createMenuItem(data)

      if (imageFile) {
        await uploadMenuItemImage(savedItem.id, imageFile)
      }

      return savedItem
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] })
      router.push("/admin/menu-items")
      router.refresh()
    },
    onError: (error: Error) => {
      alert(`Error:\n${error.message}`)
    },
  })

  return (
    <MenuItemForm
      menuItemId={menuItemId}
      initialData={initialData}
      categories={categories}
      sizes={sizes}
      tags={tags}
      ingredients={ingredients}
      onSubmit={(data, imageFile) =>
        saveMutation.mutate({ data, imageFile })
      }
      isSubmitting={saveMutation.isPending}
    />
  )
}
