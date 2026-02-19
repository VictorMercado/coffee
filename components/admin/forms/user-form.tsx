"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/client/api";
import { ArrowLeft, Save } from "lucide-react";

interface UserFormProps {
  user: {
    id: string;
    username: string;
    email: string | null;
    role: string;
  };
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [role, setRole] = useState(user.role);
  const [email, setEmail] = useState(user.email || "");

  const updateMutation = useMutation({
    mutationFn: () =>
      updateUser(user.id, {
        role: role as "USER" | "ADMIN",
        email: email || null,
      }),
    onSuccess: () => {
      router.push("/admin/users");
      router.refresh();
    },
    onError: (error) => {
      alert(error.message || "Failed to update user");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      {/* Username (read-only) */}
      <div>
        <label className="block font-mono text-xs text-primary mb-2">
          USERNAME
        </label>
        <div className="border border-border bg-[#2D1810] px-4 py-3 font-mono text-sm text-[#F5F5DC]/60">
          {user.username}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block font-mono text-xs text-primary mb-2">
          EMAIL
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          className="w-full border border-border bg-[#2D1810] px-4 py-3 font-mono text-sm text-[#F5F5DC] placeholder:text-[#F5F5DC]/30 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block font-mono text-xs text-primary mb-2">
          ROLE
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setRole("USER")}
            className={`flex-1 border px-4 py-3 font-mono text-sm transition-colors ${role === "USER"
                ? "border-primary bg-primary text-[#1A0F08]"
                : "border-border bg-[#2D1810] text-[#F5F5DC]/60 hover:bg-[#3D2820]"
              }`}
          >
            USER
          </button>
          <button
            type="button"
            onClick={() => setRole("ADMIN")}
            className={`flex-1 border px-4 py-3 font-mono text-sm transition-colors ${role === "ADMIN"
                ? "border-primary bg-primary text-[#1A0F08]"
                : "border-border bg-[#2D1810] text-[#F5F5DC]/60 hover:bg-[#3D2820]"
              }`}
          >
            ADMIN
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/users")}
          className="border-border text-[#F5F5DC]/60 hover:bg-[#2D1810]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          BACK
        </Button>
        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="bg-primary font-mono text-background hover:bg-primary/80 disabled:opacity-50"
        >
          <Save className="mr-2 h-4 w-4" />
          {updateMutation.isPending ? "SAVING..." : "SAVE CHANGES"}
        </Button>
      </div>
    </form>
  );
}
