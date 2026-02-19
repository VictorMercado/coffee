import { CreateUserForm } from "@/components/admin/forms/create-user-form";

export const dynamic = "force-dynamic";

export default function CreateUserPage() {
  return (
    <div className="container mx-auto">
      <CreateUserForm />
    </div>
  );
}
