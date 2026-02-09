import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdminAuth } from "@/lib/auth-helper"
import { ingredientSchema } from "@/lib/validations"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
    })

    if (!ingredient) {
      return NextResponse.json(
        { error: "Ingredient not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(ingredient)
  } catch (error) {
    console.error("Error fetching ingredient:", error)
    return NextResponse.json(
      { error: "Failed to fetch ingredient" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await checkAdminAuth()
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = ingredientSchema.partial().parse(body)

    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(ingredient)
  } catch (error: any) {
    console.error("Error updating ingredient:", error)
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Failed to update ingredient" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await checkAdminAuth()
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.ingredient.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: "Ingredient deleted successfully" })
  } catch (error) {
    console.error("Error deleting ingredient:", error)
    return NextResponse.json(
      { error: "Failed to delete ingredient" },
      { status: 500 }
    )
  }
}
