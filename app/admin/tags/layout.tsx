import { AdminHeader } from "@/components/admin/admin-header";
export default function AdminTagsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader
        title="TAGS"
        description="Manage menu item tags"
      />
      <div className="p-2 md:p-4 lg:p-6 pb-10">
        {children}
      </div>
    </>
  );
}