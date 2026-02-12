import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/server/auth-helper";
import * as TagRepo from "@/lib/server/repo/tag";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }>; }
) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    await TagRepo.deleteTag(id);

    return NextResponse.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}
