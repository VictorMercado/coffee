"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUser } from "@/lib/client/api/users";
import { ArrowLeft, Save } from "lucide-react";

export function CreateUserForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");

  const createMutation = useMutation({
    mutationFn: () =>
      createUser({
        username,
        password,
        email: email || null,
        role,
      }),
    onSuccess: () => {
      router.push("/admin/users");
      router.refresh();
    },
    onError: (error) => {
      alert(error.message || "Failed to create user");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 border border-border bg-card p-6">
        {/* Username */}
        <div>
          <label className="block font-mono text-xs text-primary mb-2">
            USERNAME
          </label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
            minLength={3}
            maxLength={20}
            className="border-border px-4 py-3 font-mono text-sm text-[#F5F5DC] placeholder:text-[#F5F5DC]/30 focus-visible:ring-0 focus-visible:border-primary h-auto"
          />
        </div>
        {/* Password */}
        <div>
          <label className="block font-mono text-xs text-primary mb-2">
            PASSWORD
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            required
            minLength={6}
            className="border-border px-4 py-3 font-mono text-sm text-[#F5F5DC] placeholder:text-[#F5F5DC]/30 focus-visible:ring-0 focus-visible:border-primary h-auto"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block font-mono text-xs text-primary mb-2">
            EMAIL
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="border-border px-4 py-3 font-mono text-sm text-[#F5F5DC] placeholder:text-[#F5F5DC]/30 focus-visible:ring-0 focus-visible:border-primary h-auto"
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
                : "border-border text-[#F5F5DC]/60"
                }`}
            >
              USER
            </button>
            <button
              type="button"
              onClick={() => setRole("ADMIN")}
              className={`flex-1 border px-4 py-3 font-mono text-sm transition-colors ${role === "ADMIN"
                ? "border-primary bg-primary text-[#1A0F08]"
                : "border-border text-[#F5F5DC]/60"
                }`}
            >
              ADMIN
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-primary font-mono text-background hover:bg-primary/80"
        >
          {createMutation.isPending ? "CREATING..." : "CREATE USER"}
        </Button>
        <Button
          type="button"
          onClick={() => router.push("/admin/users")}
          disabled={createMutation.isPending}
          variant="outline"
          className="border-border font-mono text-primary"
        >
          CANCEL
        </Button>
      </div>
    </form>
  );
}
