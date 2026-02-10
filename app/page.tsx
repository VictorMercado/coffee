import { prisma } from "@/lib/prisma";
import { HomeContent } from "@/components/home-content";
import { MenuItem } from "@/lib/client/api/menu-items";

export const dynamic = "force-dynamic";

async function getFeaturedItems(): Promise<MenuItem[]> {
  const menuItems = await prisma.menuItem.findMany({
    where: {
      isActive: true,
      isFeatured: true,
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
    take: 4, // Show max 4 featured items
  });

  // Transform to match MenuItem interface
  return menuItems.map((item) => ({
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
  }));
}

export default async function Home() {
  const featuredItems = await getFeaturedItems();

  return <HomeContent featuredItems={featuredItems} />;
}
