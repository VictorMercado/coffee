"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createCategory, updateCategory } from "@/lib/client/api"

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  isActive: boolean
  sortOrder: number
  menuItemCount?: number
}

interface CategoryFormProps {
  category?: Category
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isEditing = !!category

  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    icon: category?.icon || "",
    isActive: category?.isActive ?? true,
    sortOrder: category?.sortOrder || 0,
  })

  const [error, setError] = useState("")

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }))
  }

  const mutation = useMutation({
    mutationFn: (data: any) =>
      isEditing ? updateCategory(category.id, data) : createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      router.push("/admin/categories")
      router.refresh()
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to save category"
      // Handle array errors from validation
      try {
        const parsed = JSON.parse(errorMessage)
        if (Array.isArray(parsed)) {
          const errorMessages = parsed
            .map((e: any) => `${e.path?.join(".")} - ${e.message}`)
            .join("\n")
          setError(errorMessages)
          return
        }
      } catch {}
      setError(errorMessage)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    mutation.mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4 border border-border bg-card p-6">
        <h3 className="font-mono text-lg text-primary">BASIC INFORMATION</h3>

        <div>
          <Label htmlFor="name" className="font-mono text-xs text-primary">
            NAME *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g., Signature Brews"
            required
            className="mt-1 border-border font-mono text-foreground"
          />
        </div>

        <div>
          <Label htmlFor="slug" className="font-mono text-xs text-primary">
            SLUG *
          </Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="e.g., signature"
            pattern="^[a-z0-9-]+$"
            title="Lowercase letters, numbers, and hyphens only"
            required
            className="mt-1 border-border font-mono text-foreground"
          />
          <p className="mt-1 font-mono text-xs text-[#F5F5DC]/60">
            Used in URLs. Only lowercase letters, numbers, and hyphens.
          </p>
        </div>

        <div>
          <Label htmlFor="icon" className="font-mono text-xs text-primary">
            ICON (EMOJI)
          </Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="e.g., ☕"
            maxLength={2}
            className="mt-1 border-border font-mono text-foreground"
          />
          <p className="mt-1 font-mono text-xs text-[#F5F5DC]/60">
            Optional emoji icon for the category
          </p>
        </div>

        <div>
          <Label htmlFor="sortOrder" className="font-mono text-xs text-primary">
            SORT ORDER
          </Label>
          <Input
            id="sortOrder"
            type="number"
            value={formData.sortOrder}
            onChange={(e) =>
              setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
            }
            min="0"
            className="mt-1 border-border font-mono text-foreground"
          />
          <p className="mt-1 font-mono text-xs text-[#F5F5DC]/60">
            Lower numbers appear first
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked as boolean })
            }
          />
          <Label htmlFor="isActive" className="font-mono text-xs text-primary cursor-pointer">
            ACTIVE
          </Label>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="border border-red-500 bg-red-900/20 p-4">
          <pre className="whitespace-pre-wrap font-mono text-xs text-red-400">{error}</pre>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-primary font-mono text-background hover:bg-primary/80"
        >
          {mutation.isPending ? "SAVING..." : isEditing ? "UPDATE CATEGORY" : "CREATE CATEGORY"}
        </Button>
        <Button
          type="button"
          onClick={() => router.push("/admin/categories")}
          disabled={mutation.isPending}
          variant="outline"
          className="border-border font-mono text-primary"
        >
          CANCEL
        </Button>
      </div>
    </form>
  )
}
