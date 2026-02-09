import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminHeader } from "@/components/admin/admin-header"
import { MenuItemFormWrapper } from "@/components/admin/menu-item-form-wrapper"

async function getMenuItemData(id: string) {
  const [menuItem, categories, sizes, tags, ingredients] = await Promise.all([
    prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        sizes: {
          include: { size: true },
        },
        tags: {
          include: { tag: true },
        },
        ingredients: {
          include: { ingredient: true },
          orderBy: { sortOrder: "asc" },
        },
        recipeSteps: {
          orderBy: { stepNumber: "asc" },
        },
      },
    }),
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
  ])

  if (!menuItem) {
    return null
  }

  // Transform data
  const transformedMenuItem = {
    id: menuItem.id,
    name: menuItem.name,
    description: menuItem.description,
    basePrice: menuItem.basePrice,
    categoryId: menuItem.category.id,
    imagePath: menuItem.imagePath,
    isActive: menuItem.isActive,
    isFeatured: menuItem.isFeatured,
    sortOrder: menuItem.sortOrder,
    sizes: menuItem.sizes.map((s) => ({
      id: s.size.id,
      sizeId: s.size.id,
      name: s.size.name,
      abbreviation: s.size.abbreviation,
      priceModifier: s.size.priceModifier,
    })),
    tags: menuItem.tags.map((t) => ({
      id: t.tag.id,
      tagId: t.tag.id,
      name: t.tag.name,
    })),
    ingredients: menuItem.ingredients.map((i) => ({
      id: i.ingredient.id,
      ingredientId: i.ingredient.id,
      name: i.ingredient.name,
      quantity: i.quantity,
      isOptional: i.isOptional,
      sortOrder: i.sortOrder,
    })),
    recipeSteps: menuItem.recipeSteps.map((step) => ({
      stepNumber: step.stepNumber,
      instruction: step.instruction,
      duration: step.duration,
      temperature: step.temperature,
    })),
  }

  return {
    menuItem: transformedMenuItem,
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
  }
}

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getMenuItemData(id)

  if (!data) {
    notFound()
  }

  return (
    <>
      <AdminHeader
        title="EDIT MENU ITEM"
        description={`Editing: ${data.menuItem.name}`}
      />
      <div className="container mx-auto p-8">
        <MenuItemFormWrapper
          menuItemId={id}
          initialData={data.menuItem}
          categories={data.categories}
          sizes={data.sizes}
          tags={data.tags}
          ingredients={data.ingredients}
        />
      </div>
    </>
  )
}
