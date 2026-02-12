import { prisma } from "@/lib/prisma";

// Shared include for menu items with relations
const menuItemListInclude = {
  category: true,
  sizes: { include: { size: true } },
  tags: { include: { tag: true } },
} as const;

const menuItemDetailInclude = {
  category: true,
  sizes: { include: { size: true } },
  tags: { include: { tag: true } },
  ingredients: {
    include: { ingredient: true },
    orderBy: { sortOrder: "asc" as const },
  },
  recipeSteps: {
    orderBy: { stepNumber: "asc" as const },
  },
} as const;

// --- Queries ---

export async function findAllMenuItems(options?: {
  category?: string;
  featured?: boolean;
  includeInactive?: boolean;
}) {
  return prisma.menuItem.findMany({
    where: {
      ...(options?.includeInactive ? {} : { isActive: true }),
      ...(options?.category && { category: { slug: options.category } }),
      ...(options?.featured && { isFeatured: true }),
    },
    include: menuItemListInclude,
    orderBy: { sortOrder: "asc" },
  });
}

export async function findMenuItemById(id: string) {
  return prisma.menuItem.findUnique({
    where: { id },
    include: menuItemDetailInclude,
  });
}

export async function findActiveMenuItemById(id: string) {
  return prisma.menuItem.findUnique({
    where: { id, isActive: true },
    include: menuItemDetailInclude,
  });
}

export async function findMenuItemsByIds(ids: string[]) {
  return prisma.menuItem.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true },
  });
}

export async function findFeaturedMenuItems(take: number = 4) {
  return prisma.menuItem.findMany({
    where: { isActive: true, isFeatured: true },
    include: menuItemListInclude,
    orderBy: { sortOrder: "asc" },
    take,
  });
}

export async function findRecentMenuItems(take: number = 5) {
  return prisma.menuItem.findMany({
    take,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function countMenuItems(where?: {
  isActive?: boolean;
  isFeatured?: boolean;
}) {
  return prisma.menuItem.count({ where });
}

// --- Mutations ---

export interface CreateMenuItemData {
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  imagePath?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  sizeIds?: string[];
  tagIds?: string[];
  ingredients?: {
    ingredientId: string;
    quantity?: string | null;
    isOptional?: boolean;
    sortOrder?: number;
  }[];
  recipeSteps?: {
    stepNumber: number;
    instruction: string;
    duration?: string | null;
    temperature?: string | null;
  }[];
}

export async function createMenuItem(data: CreateMenuItemData) {
  return prisma.menuItem.create({
    data: {
      name: data.name,
      description: data.description,
      basePrice: data.basePrice,
      categoryId: data.categoryId,
      imagePath: data.imagePath,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      sortOrder: data.sortOrder,
      sizes: {
        create: (data.sizeIds || []).map((sizeId) => ({ sizeId })),
      },
      tags: {
        create: (data.tagIds || []).map((tagId) => ({ tagId })),
      },
      ingredients: {
        create: (data.ingredients || []).map((ing) => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          isOptional: ing.isOptional,
          sortOrder: ing.sortOrder,
        })),
      },
      recipeSteps: {
        create: (data.recipeSteps || []).map((step) => ({
          stepNumber: step.stepNumber,
          instruction: step.instruction,
          duration: step.duration,
          temperature: step.temperature,
        })),
      },
    },
    include: {
      category: true,
      sizes: { include: { size: true } },
      tags: { include: { tag: true } },
      ingredients: { include: { ingredient: true } },
    },
  });
}

export async function updateMenuItem(id: string, data: Partial<CreateMenuItemData>) {
  // Delete existing relations before recreating
  await prisma.menuItemSize.deleteMany({ where: { menuItemId: id } });
  await prisma.menuItemTag.deleteMany({ where: { menuItemId: id } });
  await prisma.menuItemIngredient.deleteMany({ where: { menuItemId: id } });
  await prisma.recipeStep.deleteMany({ where: { menuItemId: id } });

  return prisma.menuItem.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.imagePath !== undefined && { imagePath: data.imagePath }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(data.sizeIds && {
        sizes: { create: data.sizeIds.map((sizeId) => ({ sizeId })) },
      }),
      ...(data.tagIds && {
        tags: { create: data.tagIds.map((tagId) => ({ tagId })) },
      }),
      ...(data.ingredients && {
        ingredients: {
          create: data.ingredients.map((ing) => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
            isOptional: ing.isOptional,
            sortOrder: ing.sortOrder,
          })),
        },
      }),
      ...(data.recipeSteps && {
        recipeSteps: {
          create: data.recipeSteps.map((step) => ({
            stepNumber: step.stepNumber,
            instruction: step.instruction,
            duration: step.duration,
            temperature: step.temperature,
          })),
        },
      }),
    },
    include: {
      category: true,
      sizes: { include: { size: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function deleteMenuItem(id: string) {
  return prisma.menuItem.delete({ where: { id } });
}

export async function updateMenuItemImage(id: string, imagePath: string) {
  return prisma.menuItem.update({
    where: { id },
    data: { imagePath },
  });
}
