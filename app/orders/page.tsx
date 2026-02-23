import { auth } from "@/lib/server/auth";
import { MyOrdersContent } from "@/components/my-orders-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MyOrdersPage() {
  const session = await auth();

  const user = session?.user || {
    id: "guest",
    username: "guest",
    role: "USER",
  };

  return <MyOrdersContent user={user} />;
}
