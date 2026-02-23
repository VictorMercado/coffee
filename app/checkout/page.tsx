import { auth } from "@/lib/server/auth";
import { CheckoutContent } from "@/components/checkout-content";
import { GUEST_SESSION } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CheckoutPage() {
  const session = await auth();

  const user = session?.user || GUEST_SESSION;

  return <CheckoutContent user={user} />;
}
