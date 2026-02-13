import { auth } from "@/lib/server/auth";
import { CheckoutContent } from "@/components/checkout-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CheckoutPage() {
  const session = await auth();

  const user = session?.user || {
    id: "guest",
    username: "guest",
    email: null,
    role: "USER",
  };

  return <CheckoutContent user={user} />;
}
