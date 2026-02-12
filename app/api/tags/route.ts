import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/server/auth-helper";
import { tagSchema } from "@/lib/validations";
import * as TagRepo from "@/lib/server/repo/tag";

export async function GET() {
  try {
    const tags = await TagRepo.findAllTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = tagSchema.parse(body);

    const tag = await TagRepo.createTag(validatedData);

    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    console.error("Error creating tag:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}
