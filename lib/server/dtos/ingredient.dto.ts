export interface IngredientDTO {
  id: string;
  name: string;
  description: string | null;
  allergens: string | null;
  isActive: boolean;
}
