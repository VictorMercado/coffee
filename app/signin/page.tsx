"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, ArrowRight } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid username or password")
        setIsLoading(false)
        return
      }

      // Check if user is admin and redirect them
      if (username === "admin") {
        router.push("/admin")
        return
      }

      // Successful sign in - redirect to callback or home
      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      console.error("Sign in error:", error)
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="pt-16 sm:pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 border-2 border-primary mx-auto flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-mono text-3xl text-foreground tracking-widest mb-2">
              SIGN IN
            </h1>
            <p className="text-muted-foreground">
              Access your Orbit Coffee account
            </p>
          </div>

          {/* Sign In Form */}
          <div className="border border-border bg-card p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="border border-red-500 bg-red-900/20 p-4">
                  <p className="font-mono text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="font-mono text-xs text-primary">
                  USERNAME
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_username"
                  required
                  className="border-border bg-background font-mono text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-mono text-xs text-primary">
                  PASSWORD
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="border-border bg-background font-mono text-foreground"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
              >
                {isLoading ? "SIGNING IN..." : "SIGN IN"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 font-mono text-muted-foreground">
                  OR
                </span>
              </div>
            </div>

            {/* Sign Up CTA */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Don't have an account yet?
                </p>
                <Link href="/signup">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-border font-mono"
                  >
                    CREATE ACCOUNT
                  </Button>
                </Link>
              </div>
            </div>

            {/* Continue as Guest */}
            <div className="mt-6 pt-6 border-t border-border">
              <Link href="/">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full font-mono text-muted-foreground hover:text-foreground"
                >
                  CONTINUE AS GUEST
                </Button>
              </Link>
            </div>

            {/* Admin Link */}
            <div className="mt-6 text-center">
              <Link
                href="/admin/login"
                className="text-xs font-mono text-muted-foreground hover:text-primary underline underline-offset-4"
              >
                Admin? Sign in here
              </Link>
            </div>
          </div>
        </div>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
