import { prisma } from "@/lib/prisma";

export async function findActiveIngredients() {
  return prisma.ingredient.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function findAllIngredients() {
  return prisma.ingredient.findMany({
    orderBy: { name: "asc" },
  });
}

export async function findIngredientById(id: string) {
  return prisma.ingredient.findUnique({ where: { id } });
}

export async function findIngredientByName(name: string) {
  return prisma.ingredient.findUnique({ where: { name } });
}

export async function createIngredient(data: {
  name: string;
  description?: string | null;
  allergens?: string | null;
  isActive?: boolean;
}) {
  return prisma.ingredient.create({ data });
}

export async function updateIngredient(id: string, data: Partial<{
  name: string;
  description: string | null;
  allergens: string | null;
  isActive: boolean;
}>) {
  return prisma.ingredient.update({ where: { id }, data });
}

export async function softDeleteIngredient(id: string) {
  return prisma.ingredient.update({
    where: { id },
    data: { isActive: false },
  });
}
