import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { CategoryForm } from "@/components/admin/forms/category-form";
import * as CategoryRepo from "@/lib/server/repo/category";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCategory(id: string) {
  const category = await CategoryRepo.findCategoryById(id);

  if (!category) {
    return null;
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    isActive: category.isActive,
    sortOrder: category.sortOrder,
    menuItemCount: category._count.menuItems,
  };
}

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string; }>;
}) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title="EDIT CATEGORY"
        description="Update category details"
      />
      <div className="p-8">
        <CategoryForm category={category} />
      </div>
    </>
  );
}
