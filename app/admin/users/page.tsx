import { UsersList } from "@/components/admin/users-list";
import * as UserRepo from "@/lib/server/repo/user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getUsers() {
  const users = await UserRepo.findAllUsers();

  return users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  }));
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="container mx-auto">
      <UsersList initialUsers={users} />
    </div>
  );
}
