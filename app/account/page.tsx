import { auth } from "@/lib/server/auth";
import { AccountContent } from "@/components/account-content";

export default async function AccountPage() {
  const session = await auth();

  // If no session, use guest user (client-side guest auto-login will sync this)
  const user = session?.user || {
    id: "guest",
    username: "guest",
    email: null,
    role: "USER",
  };

  return <AccountContent user={user} />;
}
