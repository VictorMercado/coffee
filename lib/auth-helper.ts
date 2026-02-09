import { auth } from "@/lib/auth"

export async function checkAdminAuth() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      authorized: false,
      error: "Unauthorized",
    }
  }

  return {
    authorized: true,
    userId: session.user.id,
  }
}
