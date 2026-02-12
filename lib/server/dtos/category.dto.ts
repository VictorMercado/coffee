export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface CategoryWithCountDTO extends CategoryDTO {
  menuItemCount: number;
}

export interface CategoryBreakdownDTO {
  name: string;
  count: number;
}
