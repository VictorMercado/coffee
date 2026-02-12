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
    <div className="border-b border-border bg-[#1A0F08] px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-mono text-xl sm:text-2xl text-primary">{title}</h1>
          {description && (
            <p className="mt-1 font-mono text-xs sm:text-sm text-[#F5F5DC]/60">
              {description}
            </p>
          )}
        </div>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
        >
          <LogOut className="mr-2 h-4 w-4" />
          LOGOUT
        </Button>
      </div>
    </div>
  )
}
