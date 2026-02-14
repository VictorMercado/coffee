import type { z } from "zod";
import type { categoryRequestSchema } from "@/lib/validations";
import type { CategoryDTO, CategoryListDTO } from "@/lib/server/dtos";

// ── Re-export server DTOs as client-friendly names ─────────────

export type Category = CategoryDTO;
export type CategoryWithCount = CategoryListDTO;

// ── Input type derived from Zod schema ─────────────────────────

export type CreateCategoryInput = z.infer<typeof categoryRequestSchema>;
export type UpdateCategoryInput = CreateCategoryInput & { id: string; };

// ── Fetchers ───────────────────────────────────────────────────

// Fetch all categories (public)
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

// Create category (admin)
export async function createCategory(
  data: CreateCategoryInput
): Promise<Category> {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create category");
  }

  return response.json();
}

// Update category (admin)
export async function updateCategory(
  id: string,
  data: Partial<CreateCategoryInput>
): Promise<Category> {
  const response = await fetch(`/api/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update category");
  }

  return response.json();
}

// Delete category (admin)
export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete category");
  }
}
