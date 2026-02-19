"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function DebugSessionPage() {
  const { data: session, status } = useSession()

  const clearGuestLogin = () => {
    sessionStorage.removeItem("guestLoginAttempted")
    alert("Cleared guest login flag. Refresh the page.")
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-mono text-2xl text-primary">DEBUG SESSION</h1>

        <div className="border border-border p-6 space-y-4">
          <div>
            <strong className="font-mono text-primary">Status:</strong>{" "}
            <span className="font-mono">{status}</span>
          </div>

          <div>
            <strong className="font-mono text-primary">Session:</strong>
            <pre className="mt-2 bg-card p-4 overflow-auto text-xs">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          <div>
            <strong className="font-mono text-primary">Guest Login Attempted:</strong>{" "}
            <span className="font-mono">
              {typeof window !== "undefined" ? sessionStorage.getItem("guestLoginAttempted") || "false" : "N/A"}
            </span>
          </div>

          <Button onClick={clearGuestLogin} className="bg-primary text-primary-foreground font-mono">
            Clear Guest Login Flag
          </Button>
        </div>
      </div>
    </div>
  )
}
