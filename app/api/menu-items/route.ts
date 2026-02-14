import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/server/auth-helper";
import { menuItemRequestSchema } from "@/lib/validations";
import * as MenuItemRepo from "@/lib/server/repo/menu-item";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const includeInactive = searchParams.get("admin") === "true";

    const menuItems = await MenuItemRepo.findAllMenuItems({
      category: category || undefined,
      featured: featured === "true" || undefined,
      includeInactive,
    });

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
    }));

    return NextResponse.json(transformedItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = menuItemRequestSchema.parse(body);

    const menuItem = await MenuItemRepo.createMenuItem(validatedData);

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error: any) {
    console.error("Error creating menu item:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}
