import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminSizesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader
        title="SIZES"
        description="Manage sizes"
      />
      <div className="p-2 md:p-4 lg:p-6 pb-10">
        {children}
      </div>
    </>
  );
}