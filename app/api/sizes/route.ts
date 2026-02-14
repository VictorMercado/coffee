import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import { sizeRequestSchema } from "@/lib/validations";
import * as SizeRepo from "@/lib/server/repo/size";

export async function GET() {
  try {
    const sizes = await SizeRepo.findActiveSizes();

    const transformedSizes = sizes.map((size) => ({
      id: size.abbreviation,
      name: size.name,
      priceModifier: size.priceModifier,
    }));

    return NextResponse.json(transformedSizes);
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return NextResponse.json({ error: "Failed to fetch sizes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = sizeRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const size = await SizeRepo.createSize(validationResult.data);

    return NextResponse.json(size, { status: 201 });
  } catch (error) {
    console.error("Error creating size:", error);
    return NextResponse.json(
      { error: "Failed to create size" },
      { status: 500 }
    );
  }
}
