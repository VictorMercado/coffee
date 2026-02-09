import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdminAuth } from "@/lib/auth-helper"
import { menuItemSchema } from "@/lib/validations"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const menuItem = await prisma.menuItem.findUnique({
      where: {
        id,
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
        ingredients: {
          include: {
            ingredient: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
        recipeSteps: {
          orderBy: {
            stepNumber: "asc",
          },
        },
      },
    })

    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    // Transform data
    const transformedItem = {
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description,
      basePrice: menuItem.basePrice,
      category: {
        id: menuItem.category.id,
        slug: menuItem.category.slug,
        name: menuItem.category.name,
      },
      imagePath: menuItem.imagePath,
      isFeatured: menuItem.isFeatured,
      isActive: menuItem.isActive,
      sortOrder: menuItem.sortOrder,
      sizes: menuItem.sizes.map((s) => ({
        id: s.size.id,
        sizeId: s.size.id,
        name: s.size.name,
        abbreviation: s.size.abbreviation,
        priceModifier: s.size.priceModifier,
      })),
      tags: menuItem.tags.map((t) => ({
        id: t.tag.id,
        tagId: t.tag.id,
        name: t.tag.name,
      })),
      ingredients: menuItem.ingredients.map((i) => ({
        id: i.ingredient.id,
        ingredientId: i.ingredient.id,
        name: i.ingredient.name,
        quantity: i.quantity,
        isOptional: i.isOptional,
        sortOrder: i.sortOrder,
      })),
      recipeSteps: menuItem.recipeSteps.map((step) => ({
        stepNumber: step.stepNumber,
        instruction: step.instruction,
        duration: step.duration,
        temperature: step.temperature,
      })),
    }

    return NextResponse.json(transformedItem)
  } catch (error) {
    console.error("Error fetching menu item:", error)
    return NextResponse.json(
      { error: "Failed to fetch menu item" },
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
    const validatedData = menuItemSchema.partial().parse(body)

    // Delete existing relations
    await prisma.menuItemSize.deleteMany({ where: { menuItemId: id } })
    await prisma.menuItemTag.deleteMany({ where: { menuItemId: id } })
    await prisma.menuItemIngredient.deleteMany({
      where: { menuItemId: id },
    })
    await prisma.recipeStep.deleteMany({ where: { menuItemId: id } })

    // Update menu item with new relations
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.description && {
          description: validatedData.description,
        }),
        ...(validatedData.basePrice !== undefined && {
          basePrice: validatedData.basePrice,
        }),
        ...(validatedData.categoryId && { categoryId: validatedData.categoryId }),
        ...(validatedData.imagePath !== undefined && {
          imagePath: validatedData.imagePath,
        }),
        ...(validatedData.isActive !== undefined && {
          isActive: validatedData.isActive,
        }),
        ...(validatedData.isFeatured !== undefined && {
          isFeatured: validatedData.isFeatured,
        }),
        ...(validatedData.sortOrder !== undefined && {
          sortOrder: validatedData.sortOrder,
        }),
        ...(validatedData.sizeIds && {
          sizes: {
            create: validatedData.sizeIds.map((sizeId) => ({ sizeId })),
          },
        }),
        ...(validatedData.tagIds && {
          tags: {
            create: validatedData.tagIds.map((tagId) => ({ tagId })),
          },
        }),
        ...(validatedData.ingredients && {
          ingredients: {
            create: validatedData.ingredients.map((ing) => ({
              ingredientId: ing.ingredientId,
              quantity: ing.quantity,
              isOptional: ing.isOptional,
              sortOrder: ing.sortOrder,
            })),
          },
        }),
        ...(validatedData.recipeSteps && {
          recipeSteps: {
            create: validatedData.recipeSteps.map((step) => ({
              stepNumber: step.stepNumber,
              instruction: step.instruction,
              duration: step.duration,
              temperature: step.temperature,
            })),
          },
        }),
      },
      include: {
        category: true,
        sizes: { include: { size: true } },
        tags: { include: { tag: true } },
      },
    })

    return NextResponse.json(menuItem)
  } catch (error: any) {
    console.error("Error updating menu item:", error)
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Failed to update menu item" },
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
    // Soft delete by setting isActive to false
    await prisma.menuItem.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: "Menu item deleted successfully" })
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 }
    )
  }
}
