import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/server/auth-helper";
import { menuItemSchema } from "@/lib/validations";
import * as MenuItemRepo from "@/lib/server/repo/menu-item";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }>; }
) {
  try {
    const { id } = await params;
    const menuItem = await MenuItemRepo.findMenuItemById(id);

    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
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
    };

    return NextResponse.json(transformedItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu item" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }>; }
) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = menuItemSchema.partial().parse(body);

    const menuItem = await MenuItemRepo.updateMenuItem(id, validatedData);

    return NextResponse.json(menuItem);
  } catch (error: any) {
    console.error("Error updating menu item:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }>; }
) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const { id } = await params;
    await MenuItemRepo.deleteMenuItem(id);

    return NextResponse.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}
