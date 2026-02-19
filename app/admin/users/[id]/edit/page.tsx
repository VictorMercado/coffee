import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { UserForm } from "@/components/admin/forms/user-form";
import * as UserRepo from "@/lib/server/repo/user";

export const dynamic = "force-dynamic";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string; }>;
}) {
  const { id } = await params;
  const user = await UserRepo.findUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <>
      <AdminHeader
        title="EDIT USER"
        description={`Editing ${user.username}`}
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <UserForm
          user={{
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          }}
        />
      </div>
    </>
  );
}
