import { prisma } from "@/lib/prisma";

export async function deleteByMenuItemId(menuItemId: string) {
  return prisma.recipeStep.deleteMany({ where: { menuItemId } });
}

export async function createMany(data: {
  menuItemId: string;
  stepNumber: number;
  instruction: string;
  duration?: string | null;
  temperature?: string | null;
}[]) {
  return prisma.recipeStep.createMany({ data });
}
