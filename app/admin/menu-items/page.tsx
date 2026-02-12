import { AdminHeader } from "@/components/admin/admin-header";
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
    <>
      <AdminHeader
        title="MENU ITEMS"
        description="Manage coffee menu and pastries"
      />
      <MenuItemsList initialItems={menuItems} />
    </>
  );
}
