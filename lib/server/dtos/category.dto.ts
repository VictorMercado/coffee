import type { Category } from "@/lib/types/category";

export type CategoryDTO = Omit<Category, "createdAt" | "updatedAt">;

export interface CategoryWithCountDTO extends CategoryDTO {
  menuItemCount: number;
}

export interface CategoryBreakdownDTO {
  name: string;
  count: number;
}
