"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { GuestAuthWrapper } from "./guest-auth-wrapper"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <GuestAuthWrapper>{children}</GuestAuthWrapper>
    </SessionProvider>
  )
}
