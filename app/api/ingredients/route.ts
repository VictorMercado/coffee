import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdminAuth } from "@/lib/auth-helper"
import { ingredientSchema } from "@/lib/validations"

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(ingredients)
  } catch (error) {
    console.error("Error fetching ingredients:", error)
    return NextResponse.json(
      { error: "Failed to fetch ingredients" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authResult = await checkAdminAuth()
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = ingredientSchema.parse(body)

    const ingredient = await prisma.ingredient.create({
      data: validatedData,
    })

    return NextResponse.json(ingredient, { status: 201 })
  } catch (error: any) {
    console.error("Error creating ingredient:", error)
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Failed to create ingredient" },
      { status: 500 }
    )
  }
}
