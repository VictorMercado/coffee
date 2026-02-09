import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { isActive } = body

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive must be a boolean" },
        { status: 400 }
      )
    }

    const size = await prisma.size.update({
      where: { id },
      data: { isActive },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.error("Error updating size:", error)
    return NextResponse.json(
      { error: "Failed to update size" },
      { status: 500 }
    )
  }
}
