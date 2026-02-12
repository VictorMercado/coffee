import { prisma } from "@/lib/prisma";

export async function deleteByMenuItemId(menuItemId: string) {
  return prisma.menuItemSize.deleteMany({ where: { menuItemId } });
}

export async function createMany(data: { menuItemId: string; sizeId: string; }[]) {
  return prisma.menuItemSize.createMany({ data });
}

export async function createOne(data: { menuItemId: string; sizeId: string; }) {
  return prisma.menuItemSize.create({ data });
}
