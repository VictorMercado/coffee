import { prisma } from "@/lib/prisma";
import type { CategoryDTO, CategoryWithCountDTO, CategoryBreakdownDTO } from "@/lib/server/dtos";

export async function findAllCategories(options?: { includeInactive?: boolean; }): Promise<CategoryWithCountDTO[]> {
  const categories = await prisma.category.findMany({
    where: options?.includeInactive ? {} : { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { menuItems: true } },
    },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    isActive: c.isActive,
    sortOrder: c.sortOrder,
    menuItemCount: c._count.menuItems,
  }));
}

export async function findActiveCategories(): Promise<CategoryDTO[]> {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function findCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { menuItems: true } },
    },
  });
}

export async function findCategoryBySlug(slug: string, excludeId?: string) {
  if (excludeId) {
    return prisma.category.findFirst({
      where: { slug, NOT: { id: excludeId } },
    });
  }
  return prisma.category.findUnique({ where: { slug } });
}

export async function createCategory(data: {
  name: string;
  slug: string;
  icon?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}) {
  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      icon: data.icon || null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateCategory(id: string, data: {
  name: string;
  slug: string;
  icon?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}) {
  return prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      icon: data.icon || null,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
    },
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}

export async function findCategoriesWithCounts(): Promise<CategoryWithCountDTO[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { menuItems: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    isActive: c.isActive,
    sortOrder: c.sortOrder,
    menuItemCount: c._count.menuItems,
  }));
}

export async function findCategoriesBreakdown(): Promise<CategoryBreakdownDTO[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      menuItems: { where: { isActive: true } },
    },
  });

  return categories.map((c) => ({
    name: c.name,
    count: c.menuItems.length,
  }));
}
