export interface SignupInput {
  username: string
  email?: string
  password: string
}

// Signup
export async function signup(data: SignupInput): Promise<{ success: boolean }> {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to sign up")
  }

  return response.json()
}
