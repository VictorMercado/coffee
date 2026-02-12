import { auth } from "@/lib/server/auth";
import { redirect } from "next/navigation";
import { MyOrdersContent } from "@/components/my-orders-content";

export default async function MyOrdersPage() {
  const session = await auth();

  if (!session) {
    redirect("/signup");
  }

  return <MyOrdersContent user={session.user} />;
}
