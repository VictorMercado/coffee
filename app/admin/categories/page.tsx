import { AdminHeader } from "@/components/admin/admin-header";
import { CategoriesList } from "@/components/admin/categories-list";
import * as CategoryRepo from "@/lib/server/repo/category";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCategories() {
  return CategoryRepo.findAllCategories({ includeInactive: true });
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
