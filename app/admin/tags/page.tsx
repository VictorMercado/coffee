import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/admin-header";
import { TagsList } from "@/components/admin/tags-list";

export const dynamic = "force-dynamic";

async function getTags() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { menuItems: true },
      },
    },
  });

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    menuItemCount: tag._count.menuItems,
  }));
}

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <>
      <AdminHeader
        title="TAGS"
        description="Manage menu item tags"
      />
      <TagsList initialTags={tags} />
    </>
  );
}
