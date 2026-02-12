import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/admin-header";
import { CategoriesList } from "@/components/admin/categories-list";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { menuItems: true },
      },
    },
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    isActive: cat.isActive,
    sortOrder: cat.sortOrder,
    menuItemCount: cat._count.menuItems,
  }));
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <AdminHeader
        title="CATEGORIES"
        description="Manage menu categories"
      />
      <CategoriesList initialCategories={categories} />
    </>
  );
}
