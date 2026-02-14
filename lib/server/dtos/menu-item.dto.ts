import type { MenuItem } from "@/lib/types/menu-item";

export type MenuItemDTO = Omit<MenuItem, "createdAt" | "updatedAt">;

// Size shape in list responses (GET /api/menu-items, server pages)
export interface MenuItemListSizeDTO {
  id: string;
  name: string;
  abbreviation: string;
  priceModifier: number;
  sortOrder?: number;
}

// Size shape in detail responses (GET /api/menu-items/[id])
export interface MenuItemSizeDTO extends MenuItemListSizeDTO {
  sizeId: string;
  isDefault?: boolean;
  sortOrder: number;
}

export interface MenuItemTagDTO {
  id: string;
  tagId: string;
  name: string;
}

export interface MenuItemIngredientDTO {
  id: string;
  ingredientId: string;
  name: string;
  description?: string | null;
  allergens?: string | null;
  quantity: string | null;
  isOptional: boolean;
  sortOrder: number;
}

export interface RecipeStepDTO {
  stepNumber: number;
  instruction: string;
  duration: string | null;
  temperature: string | null;
}

// Shape returned by GET /api/menu-items and server page transforms
export interface MenuItemListDTO {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  category: string;
  imagePath: string | null;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  sizes: MenuItemListSizeDTO[];
}

// Shape returned by GET /api/menu-items/[id]
export interface MenuItemDetailDTO {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imagePath: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  category: { id: string; name: string; slug: string; };
  sizes: MenuItemSizeDTO[];
  tags: MenuItemTagDTO[];
  ingredients: MenuItemIngredientDTO[];
  recipeSteps: RecipeStepDTO[];
}

export interface MenuItemRecentDTO {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

export interface MenuItemStatsDTO {
  total: number;
  active: number;
  inactive: number;
  featured: number;
}
