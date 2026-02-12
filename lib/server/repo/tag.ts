import { prisma } from "@/lib/prisma";

export async function findAllTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createTag(data: { name: string; slug: string; }) {
  return prisma.tag.create({ data });
}

export async function deleteTag(id: string) {
  return prisma.tag.delete({ where: { id } });
}

export async function findAllTagsWithCounts() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { menuItems: true } },
    },
  });

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    menuItemCount: tag._count.menuItems,
  }));
}
