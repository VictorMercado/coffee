import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminCategoriesLayout({
  children
} : {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminHeader
        title="CATEGORIES"
        description="Manage menu categories"
      />
      <div className="p-2 md:p-4 lg:p-6 pb-10">
        {children}
      </div>
    </>
  );
}