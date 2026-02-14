import { AdminHeader } from "@/components/admin/admin-header";

export default function IngredientAdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader
        title="Ingredients"
        description="Manage ingredients"
      />
      <div className="p-2 md:p-4 lg:p-6 pb-10">
        {children}
      </div>
    </>
  );
}