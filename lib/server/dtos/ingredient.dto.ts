import type { Ingredient } from "@/lib/types/ingredient";

export type IngredientDTO = Omit<Ingredient, "createdAt" | "updatedAt">;