export interface MenuItemSize {
  id: string
  name: string
  abbreviation: string
  priceModifier: number
}

export interface MenuItem {
  id: string
  name: string
  description: string
  basePrice: number
  categoryId: string
  imagePath?: string | null
  isActive: boolean
  isFeatured: boolean
  tags: string[]
  sizes: MenuItemSize[]
}

export interface CreateMenuItemInput {
  name: string
  description: string
  basePrice: number
  categoryId: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  sizeIds: string[]
  ingredientIds: string[]
  tagIds: string[]
  recipeSteps: {
    stepNumber: number
    instruction: string
    duration?: string
    temperature?: string
  }[]
}

// Fetch all menu items (public)
export async function fetchMenuItems(): Promise<MenuItem[]> {
  const response = await fetch("/api/menu-items", { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Failed to fetch menu items")
  }
  return response.json()
}

// Fetch single menu item
export async function fetchMenuItem(id: string): Promise<MenuItem> {
  const response = await fetch(`/api/menu-items/${id}`, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Failed to fetch menu item")
  }
  return response.json()
}

// Create menu item
export async function createMenuItem(
  data: CreateMenuItemInput
): Promise<MenuItem> {
  const response = await fetch("/api/menu-items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to create menu item")
  }

  return response.json()
}

// Update menu item
export async function updateMenuItem(
  id: string,
  data: CreateMenuItemInput
): Promise<MenuItem> {
  const response = await fetch(`/api/menu-items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to update menu item")
  }

  return response.json()
}

// Delete menu item
export async function deleteMenuItem(id: string): Promise<void> {
  const response = await fetch(`/api/menu-items/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to delete menu item")
  }
}

// Upload menu item image
export async function uploadMenuItemImage(
  menuItemId: string,
  imageFile: File
): Promise<{ imagePath: string }> {
  const formData = new FormData()
  formData.append("image", imageFile)

  const response = await fetch(`/api/menu-items/${menuItemId}/upload-image`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to upload image")
  }

  return response.json()
}
