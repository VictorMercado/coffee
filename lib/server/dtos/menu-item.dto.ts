export interface MenuItemDTO {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  imagePath: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

export interface MenuItemSizeDTO {
  id: string;
  sizeId: string;
  name: string;
  abbreviation: string;
  priceModifier: number;
  isDefault?: boolean;
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

export interface MenuItemListDTO extends MenuItemDTO {
  category: string | { name: string; };
  sizes: MenuItemSizeDTO[];
  tags: string[] | MenuItemTagDTO[];
}

export interface MenuItemDetailDTO extends MenuItemDTO {
  category: { id: string; name: string; slug: string; };
  sizes: MenuItemSizeDTO[];
  tags: string[] | MenuItemTagDTO[];
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
