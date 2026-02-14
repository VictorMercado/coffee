import { MenuItemForm } from "@/components/admin/forms/menu-item-form";
import * as CategoryRepo from "@/lib/server/repo/category";
import * as SizeRepo from "@/lib/server/repo/size";
import * as TagRepo from "@/lib/server/repo/tag";
import * as IngredientRepo from "@/lib/server/repo/ingredient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getFormData() {
  const [categories, sizes, tags, ingredients] = await Promise.all([
    CategoryRepo.findActiveCategories(),
    SizeRepo.findActiveSizes(),
    TagRepo.findAllTags(),
    IngredientRepo.findActiveIngredients(),
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
    <div className="container mx-auto">
      <MenuItemForm
        categories={data.categories}
        sizes={data.sizes}
        tags={data.tags}
        ingredients={data.ingredients}
      />
    </div>
  );
}
