"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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
      } else {
        router.push("/admin")
        router.refresh()
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 border border-border bg-card p-8">
        <div className="text-center">
          <h1 className="font-mono text-3xl font-bold text-primary">
            ORBIT COFFEE
          </h1>
          <p className="mt-2 font-mono text-sm text-muted-foreground">ADMIN ACCESS</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="font-mono text-primary">
                USERNAME
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 border-primary bg-[#2D1810] text-[#F5F5DC] focus:border-[#D4AF37]"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password" className="font-mono text-primary">
                PASSWORD
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 border-primary bg-[#2D1810] text-[#F5F5DC] focus:border-[#D4AF37]"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="border border-red-500 bg-red-900/20 p-3 font-mono text-sm text-red-400">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary font-mono text-[#1A0F08] hover:bg-accent"
            disabled={isLoading}
          >
            {isLoading ? "AUTHENTICATING..." : "LOGIN"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="font-mono text-sm text-primary hover:text-accent"
          >
            ← BACK TO SITE
          </a>
        </div>
      </div>
    </div>
  )
}
