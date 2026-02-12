import { prisma } from "@/lib/prisma";

export async function findActiveSizes() {
  return prisma.size.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function findAllSizes() {
  return prisma.size.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function updateSizeStatus(id: string, isActive: boolean) {
  return prisma.size.update({
    where: { id },
    data: { isActive },
  });
}

export async function createSize(data: {
  name: string;
  abbreviation: string;
  priceModifier: number;
  isActive?: boolean;
  sortOrder?: number;
}) {
  return prisma.size.create({
    data: {
      name: data.name,
      abbreviation: data.abbreviation,
      priceModifier: data.priceModifier,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function findSizeById(id: string) {
  return prisma.size.findUnique({
    where: { id },
  });
}

export async function updateSize(
  id: string,
  data: {
    name?: string;
    abbreviation?: string;
    priceModifier?: number;
    isActive?: boolean;
    sortOrder?: number;
  }
) {
  return prisma.size.update({
    where: { id },
    data,
  });
}

export async function findAllSizesWithCounts() {
  const sizes = await prisma.size.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { menuItems: true } },
    },
  });

  return sizes.map((size) => ({
    id: size.id,
    name: size.name,
    abbreviation: size.abbreviation,
    priceModifier: size.priceModifier,
    isActive: size.isActive,
    sortOrder: size.sortOrder,
    menuItemCount: size._count.menuItems,
  }));
}
