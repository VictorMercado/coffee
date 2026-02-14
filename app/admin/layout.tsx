import { AdminLayoutClient } from "@/components/admin/admin-layout-client";
import { AiRecipeChat } from "@/components/admin/ai-recipe-chat";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminLayoutClient>
        <main>{children}</main>
      </AdminLayoutClient>
      <AiRecipeChat />
    </>
  );
}
