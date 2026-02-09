import { prisma } from "@/lib/prisma"
import { MenuContent } from "@/components/menu-content"
import { MenuItem } from "@/lib/client/api/menu-items"

async function getMenuData() {
  const [menuItems, categories] = await Promise.all([
    prisma.menuItem.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
        sizes: {
          include: {
            size: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    }),
    prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    }),
  ])

  return {
    menuItems: menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      basePrice: item.basePrice,
      categoryId: item.category.id,
      category: item.category.slug,
      imagePath: item.imagePath,
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      sizes: item.sizes.map((s) => ({
        id: s.size.id,
        name: s.size.name,
        abbreviation: s.size.abbreviation,
        priceModifier: s.size.priceModifier,
      })),
      tags: item.tags.map((t) => t.tag.name),
    })),
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      isActive: c.isActive,
      sortOrder: c.sortOrder,
      slug: c.slug,
      icon: c.icon,
    })),
  }
}

export default async function MenuPage() {
  const { menuItems, categories } = await getMenuData()

  return <MenuContent menuItems={menuItems} categories={categories} />
}
