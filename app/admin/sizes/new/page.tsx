import { AdminHeader } from "@/components/admin/admin-header";
import { SizeForm } from "@/components/admin/forms/size-form";

export default function NewSizePage() {
  return (
    <>
      <AdminHeader
        title="CREATE SIZE"
        description="Add a new size option for menu items"
      />
      <div className="container mx-auto p-8">
        <SizeForm />
      </div>
    </>
  );
}
