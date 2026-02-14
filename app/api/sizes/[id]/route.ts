import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import { sizeRequestSchema } from "@/lib/validations";
import * as SizeRepo from "@/lib/server/repo/size";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }>; }
) {
  try {
    const { id } = await params;
    const size = await SizeRepo.findSizeById(id);

    if (!size) {
      return NextResponse.json(
        { error: "Size not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(size);
  } catch (error) {
    console.error("Error fetching size:", error);
    return NextResponse.json(
      { error: "Failed to fetch size" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }>; }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = sizeRequestSchema.partial().parse(body);

    const size = await SizeRepo.updateSize(id, validatedData);

    return NextResponse.json(size);
  } catch (error: any) {
    console.error("Error updating size:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update size" },
      { status: 500 }
    );
  }
}
