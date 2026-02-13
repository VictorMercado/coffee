import { HomeContent } from "@/components/home-content";
import { MenuItem } from "@/lib/client/api/menu-items";
import * as MenuItemRepo from "@/lib/server/repo/menu-item";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getFeaturedItems(): Promise<MenuItem[]> {
  const menuItems = await MenuItemRepo.findFeaturedMenuItems(4);

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
