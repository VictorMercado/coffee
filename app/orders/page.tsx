import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MyOrdersContent } from "@/components/my-orders-content"

export default async function MyOrdersPage() {
  const session = await auth()

  // Redirect guests to sign-up
  if (!session || session.user.username === "guest") {
    redirect("/signup")
  }

  return <MyOrdersContent user={session.user} />
}
