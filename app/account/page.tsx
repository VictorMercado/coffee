import { auth } from "@/lib/server/auth";
import { AccountContent } from "@/components/account-content";
import { GUEST_SESSION } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AccountPage() {
  const session = await auth();

  const user = session?.user || GUEST_SESSION;

  return <AccountContent user={user} />;
}
