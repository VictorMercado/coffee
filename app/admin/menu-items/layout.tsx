import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminMenuItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader
        title="MENU ITEMS"
        description="Manage menu items"
      />
      <div className="p-2 md:p-4 lg:p-6 pb-10">
        {children}
      </div>
    </>
  );
}