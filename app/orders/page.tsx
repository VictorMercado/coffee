import { auth } from "@/lib/server/auth";
import { MyOrdersContent } from "@/components/my-orders-content";
import { GUEST_SESSION } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MyOrdersPage() {
  const session = await auth();

  const user = session?.user || GUEST_SESSION;

  return <MyOrdersContent user={user} />;
}
