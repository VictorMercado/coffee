import { prisma } from "@/lib/prisma";

export async function deleteByMenuItemId(menuItemId: string) {
  return prisma.menuItemTag.deleteMany({ where: { menuItemId } });
}

export async function createMany(data: { menuItemId: string; tagId: string; }[]) {
  return prisma.menuItemTag.createMany({ data });
}
