import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/admin-header";
import { MenuItemForm } from "@/components/admin/menu-item-form";

export const dynamic = "force-dynamic";

async function getFormData() {
  const [categories, sizes, tags, ingredients] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.size.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.ingredient.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })),
    sizes: sizes.map((s) => ({
      id: s.id,
      name: s.name,
      abbreviation: s.abbreviation,
      priceModifier: s.priceModifier,
    })),
    tags: tags.map((t) => ({
      id: t.id,
      name: t.name,
    })),
    ingredients: ingredients.map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
    })),
  };
}

export default async function NewMenuItemPage() {
  const data = await getFormData();

  return (
    <>
      <AdminHeader
        title="CREATE MENU ITEM"
        description="Add a new item to the menu"
      />
      <div className="container mx-auto p-8">
        <MenuItemForm
          categories={data.categories}
          sizes={data.sizes}
          tags={data.tags}
          ingredients={data.ingredients}
        />
      </div>
    </>
  );
}
