import { prisma } from "@/lib/prisma";

export async function deleteByMenuItemId(menuItemId: string) {
  return prisma.menuItemIngredient.deleteMany({ where: { menuItemId } });
}

export async function createMany(data: {
  menuItemId: string;
  ingredientId: string;
  quantity?: string | null;
  isOptional?: boolean;
  sortOrder?: number;
}[]) {
  return prisma.menuItemIngredient.createMany({ data });
}
