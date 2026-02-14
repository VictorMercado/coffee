import { MenuItemsList } from "@/components/admin/menu-items-list";
import * as MenuItemRepo from "@/lib/server/repo/menu-item";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getMenuItems() {
  const menuItems = await MenuItemRepo.findAllMenuItems({ includeInactive: true });

  return menuItems.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    basePrice: item.basePrice,
    category: { name: item.category.name },
    isActive: item.isActive,
    isFeatured: item.isFeatured,
  }));
}

export default async function AdminMenuItemsPage() {
  const menuItems = await getMenuItems();

  return (
    <div className="container mx-auto">
      <MenuItemsList initialItems={menuItems} />
    </div>
  );
}
