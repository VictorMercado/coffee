import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { checkAdminAuth } from "@/lib/auth-helper"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await checkAdminAuth()
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const { id } = await params
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Generate unique filename
    const extension = file.name.split(".").pop()
    const filename = `${id}-${Date.now()}.${extension}`
    const imagePath = `/images/menu/${filename}`

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filePath = join(process.cwd(), "public", "images", "menu", filename)
    await writeFile(filePath, buffer)

    // Update database
    await prisma.menuItem.update({
      where: { id },
      data: { imagePath },
    })

    return NextResponse.json({ imagePath })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}
