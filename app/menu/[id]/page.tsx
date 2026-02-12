import { notFound } from "next/navigation";
import { DrinkDetail } from "@/components/drink-detail";
import * as MenuItemRepo from "@/lib/server/repo/menu-item";

export const dynamic = "force-dynamic";

async function getDrink(id: string) {
  const menuItem = await MenuItemRepo.findActiveMenuItemById(id);

  if (!menuItem) return null;

  return {
    id: menuItem.id,
    name: menuItem.name,
    description: menuItem.description,
    basePrice: menuItem.basePrice,
    imagePath: menuItem.imagePath,
    isFeatured: menuItem.isFeatured,
    category: {
      id: menuItem.category.id,
      name: menuItem.category.name,
      slug: menuItem.category.slug,
    },
    sizes: menuItem.sizes.map((s) => ({
      id: s.size.id,
      name: s.size.name,
      abbreviation: s.size.abbreviation,
      priceModifier: s.size.priceModifier,
      isDefault: s.isDefault,
    })),
    ingredients: menuItem.ingredients.map((i) => ({
      id: i.ingredient.id,
      name: i.ingredient.name,
      description: i.ingredient.description,
      allergens: i.ingredient.allergens,
      quantity: i.quantity,
      isOptional: i.isOptional,
    })),
    tags: menuItem.tags.map((t) => t.tag.name),
    recipeSteps: menuItem.recipeSteps.map((s) => ({
      stepNumber: s.stepNumber,
      instruction: s.instruction,
      duration: s.duration,
      temperature: s.temperature,
    })),
  };
}

export default async function DrinkPage({
  params,
}: {
  params: Promise<{ id: string; }>;
}) {
  const { id } = await params;
  const drink = await getDrink(id);

  if (!drink) {
    notFound();
  }

  return <DrinkDetail drink={drink} />;
}
