import { AdminHeader } from "@/components/admin/admin-header";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader
        title="ORDERS"
        description="Manage customer orders"
      />
      <div className="p-2 md:p-4 lg:p-6 pb-10">
        {children}
      </div>
    </>
  );
}