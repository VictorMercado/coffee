import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "data", "uploads", "menu");

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string; }>; }
) {
  try {
    const { filename } = await params;

    // Sanitize filename to prevent directory traversal
    const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "");
    if (sanitized !== filename) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const filePath = join(UPLOAD_DIR, sanitized);

    // Verify file exists
    try {
      await stat(filePath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    const extension = sanitized.split(".").pop()?.toLowerCase() || "";
    const contentType = MIME_TYPES[extension] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving upload:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 }
    );
  }
}
