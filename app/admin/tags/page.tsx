import { AdminHeader } from "@/components/admin/admin-header";
import { TagsList } from "@/components/admin/tags-list";
import * as TagRepo from "@/lib/server/repo/tag";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TagsPage() {
  const tags = await TagRepo.findAllTagsWithCounts();

  return (
    <>
      <AdminHeader
        title="TAGS"
        description="Manage menu item tags"
      />
      <TagsList initialTags={tags} />
    </>
  );
}
