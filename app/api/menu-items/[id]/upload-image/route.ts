import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { checkAdminAuth } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = join(process.cwd(), "data", "uploads", "menu");

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }>; }
) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be less than 10MB" },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Generate unique filename
    const extension = file.name.split(".").pop();
    const filename = `${id}-${Date.now()}.${extension}`;

    // Save file to persistent data directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(UPLOAD_DIR, filename);
    await writeFile(filePath, buffer);

    // Store as API path (served via /api/uploads/menu/[filename])
    const imagePath = `/api/uploads/menu/${filename}`;

    // Update database
    await prisma.menuItem.update({
      where: { id },
      data: { imagePath },
    });

    return NextResponse.json({ imagePath });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
