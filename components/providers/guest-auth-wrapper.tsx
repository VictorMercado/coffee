"use client"

import { useEffect, useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { usePathname } from "next/navigation"

export function GuestAuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    // Don't auto-login on admin pages
    if (pathname?.startsWith("/admin")) {
      setIsInitialized(true)
      return
    }

    // Don't auto-login on signin/signup pages
    if (pathname === "/signin" || pathname === "/signup") {
      setIsInitialized(true)
      return
    }

    // Only attempt auto-login once per session
    if (status === "loading" || isLoggingIn) {
      return
    }

    // If user is already authenticated, we're done
    if (session) {
      setIsInitialized(true)
      return
    }

    if (!session && status === "unauthenticated" && !isInitialized) {
      // Check if we've already tried auto-login in this browser session
      const hasAttemptedGuestLogin = sessionStorage.getItem("guestLoginAttempted")

      if (!hasAttemptedGuestLogin) {
        sessionStorage.setItem("guestLoginAttempted", "true")
        setIsLoggingIn(true)

        // Automatically sign in as guest
        signIn("credentials", {
          username: "guest",
          password: "guest123",
          redirect: false,
        })
          .then(() => {
            setIsLoggingIn(false)
            setIsInitialized(true)
          })
          .catch((error) => {
            console.error("Guest auto-login failed:", error)
            setIsLoggingIn(false)
            setIsInitialized(true)
          })
      } else {
        setIsInitialized(true)
      }
    }
  }, [session, status, pathname, isInitialized, isLoggingIn])

  // Show loading state while initializing or logging in as guest
  if ((!isInitialized && (status === "loading" || isLoggingIn)) && !pathname?.startsWith("/admin")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-primary text-2xl tracking-widest animate-pulse mb-2">
            ORBIT COFFEE
          </div>
          {isLoggingIn && (
            <div className="font-mono text-muted-foreground text-xs tracking-wider">
              INITIALIZING...
            </div>
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
