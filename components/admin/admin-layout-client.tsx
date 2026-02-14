"use client"

import { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";

interface AdminLayoutClientProps {
  children: ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      {children}
    </div>
  );
}
