import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdminAuth } from "@/lib/auth-helper"
import { menuItemSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const includeInactive = searchParams.get("admin") === "true"

    const menuItems = await prisma.menuItem.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(category && { category: { slug: category } }),
        ...(featured === "true" && { isFeatured: true }),
      },
      include: {
        category: true,
        sizes: {
          include: {
            size: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    })

    // Transform data to match frontend expectations
    const transformedItems = menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      basePrice: item.basePrice,
      category: includeInactive ? { name: item.category.name } : item.category.slug,
      imagePath: item.imagePath,
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      sizes: item.sizes.map((s) => ({
        id: s.size.id,
        name: s.size.name,
        abbreviation: s.size.abbreviation,
        priceModifier: s.size.priceModifier,
      })),
      tags: item.tags.map((t) => t.tag.name),
    }))

    return NextResponse.json(transformedItems)
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
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
    const validatedData = menuItemSchema.parse(body)

    const menuItem = await prisma.menuItem.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        basePrice: validatedData.basePrice,
        categoryId: validatedData.categoryId,
        imagePath: validatedData.imagePath,
        isActive: validatedData.isActive,
        isFeatured: validatedData.isFeatured,
        sortOrder: validatedData.sortOrder,
        sizes: {
          create: validatedData.sizeIds.map((sizeId) => ({
            sizeId,
          })),
        },
        tags: {
          create: validatedData.tagIds.map((tagId) => ({
            tagId,
          })),
        },
        ingredients: {
          create: validatedData.ingredients.map((ing) => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
            isOptional: ing.isOptional,
            sortOrder: ing.sortOrder,
          })),
        },
        recipeSteps: {
          create: validatedData.recipeSteps.map((step) => ({
            stepNumber: step.stepNumber,
            instruction: step.instruction,
            duration: step.duration,
            temperature: step.temperature,
          })),
        },
      },
      include: {
        category: true,
        sizes: { include: { size: true } },
        tags: { include: { tag: true } },
      },
    })

    return NextResponse.json(menuItem, { status: 201 })
  } catch (error: any) {
    console.error("Error creating menu item:", error)
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    )
  }
}
