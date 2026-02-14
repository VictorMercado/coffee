import type { Category } from "@/lib/types/category";

export type CategoryDTO = Omit<Category, "createdAt" | "updatedAt">;

export interface CategoryWithCountDTO extends CategoryDTO {
  menuItemCount: number;
}

// Shape returned by GET /api/categories
export interface CategoryListDTO {
  id: string;          // slug used as id for public consumers
  name: string;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  menuItemCount: number;
  dbId: string;        // actual database id
}

export interface CategoryBreakdownDTO {
  name: string;
  count: number;
}
