import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AiRecipeChat } from "@/components/admin/ai-recipe-chat";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <AiRecipeChat />
    </div>
  );
}
