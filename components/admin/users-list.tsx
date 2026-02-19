"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/lib/client/api";
import { Pencil, Trash2, Shield, User as UserIcon, Plus } from "lucide-react";

interface UserItem {
  id: string;
  username: string;
  email: string | null;
  role: string;
  createdAt: string;
}

interface UsersListProps {
  initialUsers: UserItem[];
}

export function UsersList({ initialUsers }: UsersListProps) {
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      alert(error.message || "Failed to delete user");
    },
  });

  const handleDelete = (id: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4 ">
      <div className="flex justify-end">
        <Button
          onClick={() => router.push("/admin/users/new")}
          className="bg-primary font-mono text-background hover:bg-primary/80"
        >
          <Plus className="mr-2 h-4 w-4" />
          CREATE USER
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border bg-card overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                USERNAME
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                EMAIL
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                ROLE
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                JOINED
              </th>
              <th className="px-4 py-3 text-right font-mono text-xs text-primary">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {initialUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center font-mono text-[#F5F5DC]/60">
                  NO USERS FOUND
                </td>
              </tr>
            ) : (
              initialUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border hover:bg-[#2D1810]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.role === "ADMIN" ? (
                        <Shield className="h-4 w-4 text-primary" />
                      ) : (
                        <UserIcon className="h-4 w-4 text-[#F5F5DC]/40" />
                      )}
                      <span className="font-mono text-sm text-[#F5F5DC]">
                        {user.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-[#F5F5DC]/80">
                    {user.email || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 font-mono text-xs ${user.role === "ADMIN"
                        ? "bg-primary/20 text-primary"
                        : "bg-[#2D1810] text-[#F5F5DC]/60 border border-border/30"
                        }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#F5F5DC]/40">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() =>
                          router.push(`/admin/users/${user.id}/edit`)
                        }
                        variant="outline"
                        size="sm"
                        className="border-primary text-primary hover:bg-primary hover:text-[#1A0F08]"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(user.id, user.username)}
                        disabled={deleteMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
