"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface AdminHeaderProps {
  title: string
  description?: string
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <div className="border-b border-border bg-[#1A0F08] px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl text-primary">{title}</h1>
          {description && (
            <p className="mt-1 font-mono text-sm text-[#F5F5DC]/60">
              {description}
            </p>
          )}
        </div>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="outline"
          size="sm"
        >
          <LogOut className="mr-2 h-4 w-4" />
          LOGOUT
        </Button>
      </div>
    </div>
  )
}
