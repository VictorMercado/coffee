"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { Header } from "@/components/header"
import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "@/lib/client/api"
import { UserPlus, ArrowRight, Check } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: async () => {
      // Automatically sign in after successful signup
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Account created but failed to sign in. Please sign in manually.")
        return
      }

      // Redirect to home
      router.push("/")
      router.refresh()
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to create account")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    mutation.mutate({ username, password })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="pt-16 sm:pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 border-2 border-primary mx-auto flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-mono text-3xl text-foreground tracking-widest mb-2">
              CREATE ACCOUNT
            </h1>
            <p className="text-muted-foreground">
              Join Orbit Coffee and start your cosmic journey
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mb-8 bg-[#2D1810] border border-primary/30 p-6">
            <h2 className="font-mono text-sm text-primary mb-4">MEMBER BENEFITS</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Save favorite items</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Track order history</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Earn loyalty rewards</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Faster checkout</span>
              </div>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="border border-border bg-card p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="border border-red-500 bg-red-900/20 p-4">
                  <p className="font-mono text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="font-mono text-xs text-primary">
                  USERNAME *
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="cosmic_traveler"
                  required
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9_]+"
                  title="Username can only contain letters, numbers, and underscores"
                  className="border-border bg-background font-mono text-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  3-20 characters, letters, numbers, and underscores only
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-mono text-xs text-primary">
                  PASSWORD *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="border-border bg-background font-mono text-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  At least 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-mono text-xs text-primary">
                  CONFIRM PASSWORD *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="border-border bg-background font-mono text-foreground"
                />
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
              >
                {mutation.isPending ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
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
                  ALREADY HAVE AN ACCOUNT?
                </span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link href="/signin">
              <Button
                type="button"
                variant="outline"
                className="w-full border-border font-mono"
              >
                SIGN IN
              </Button>
            </Link>

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
          </div>
        </div>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
