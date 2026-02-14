import { SizesList } from "@/components/admin/sizes-list";
import * as SizeRepo from "@/lib/server/repo/size";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SizesPage() {
  const sizes = await SizeRepo.findAllSizesWithCounts();

  return (
    <div className="container mx-auto">
      <SizesList sizes={sizes} />
    </div>
  );
}
