import type { z } from "zod";
import type { menuItemRequestSchema } from "@/lib/validations";
import type {
  MenuItemListSizeDTO,
  MenuItemSizeDTO,
  MenuItemTagDTO,
  MenuItemIngredientDTO,
  RecipeStepDTO,
  MenuItemListDTO,
  MenuItemDetailDTO,
} from "@/lib/server/dtos";

// ── Re-export server DTOs as client-friendly names ─────────────

export type MenuItemSize = MenuItemListSizeDTO;
export type MenuItemDetailSize = MenuItemSizeDTO;
export type MenuItemTag = MenuItemTagDTO;
export type MenuItemIngredient = MenuItemIngredientDTO;
export type RecipeStep = RecipeStepDTO;
export type MenuItem = MenuItemListDTO;
export type MenuItemDetail = MenuItemDetailDTO;

// ── Input type derived from Zod schema ─────────────────────────

export type CreateMenuItemInput = z.infer<typeof menuItemRequestSchema>;

// ── Fetchers ───────────────────────────────────────────────────

// Fetch all menu items (public)
export async function fetchMenuItems(): Promise<MenuItem[]> {
  const response = await fetch("/api/menu-items", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch menu items");
  }
  return response.json();
}

// Fetch single menu item (detail)
export async function fetchMenuItem(id: string): Promise<MenuItemDetail> {
  const response = await fetch(`/api/menu-items/${id}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch menu item");
  }
  return response.json();
}

// Create menu item
export async function createMenuItem(
  data: CreateMenuItemInput
): Promise<MenuItem> {
  const response = await fetch("/api/menu-items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create menu item");
  }

  return response.json();
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
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update menu item");
  }

  return response.json();
}

// Delete menu item
export async function deleteMenuItem(id: string): Promise<void> {
  const response = await fetch(`/api/menu-items/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete menu item");
  }
}

// Upload menu item image
export async function uploadMenuItemImage(
  menuItemId: string,
  imageFile: File
): Promise<{ imagePath: string; }> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`/api/menu-items/${menuItemId}/upload-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to upload image");
  }

  return response.json();
}
