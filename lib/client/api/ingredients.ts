import type { z } from "zod";
import type { ingredientRequestSchema } from "@/lib/validations";
import type { Ingredient } from "@/lib/types/ingredient";

// ── Input type derived from Zod schema ─────────────────────────

export type CreateIngredientInput = z.infer<typeof ingredientRequestSchema>;

// Fetch all ingredients
export async function fetchIngredients(): Promise<Ingredient[]> {
  const response = await fetch("/api/ingredients");
  if (!response.ok) {
    throw new Error("Failed to fetch ingredients");
  }
  return response.json();
}

// Fetch single ingredient
export async function fetchIngredient(id: string): Promise<Ingredient> {
  const response = await fetch(`/api/ingredients/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch ingredient");
  }
  return response.json();
}

// Create ingredient
export async function createIngredient(
  data: CreateIngredientInput
): Promise<Ingredient> {
  const response = await fetch("/api/ingredients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create ingredient");
  }

  return response.json();
}

// Update ingredient
export async function updateIngredient(
  id: string,
  data: CreateIngredientInput
): Promise<Ingredient> {
  const response = await fetch(`/api/ingredients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update ingredient");
  }

  return response.json();
}

// Delete ingredient
export async function deleteIngredient(id: string): Promise<void> {
  const response = await fetch(`/api/ingredients/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete ingredient");
  }
}
