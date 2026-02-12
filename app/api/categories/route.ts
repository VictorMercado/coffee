import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import { z } from "zod";
import * as CategoryRepo from "@/lib/server/repo/category";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  icon: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const categories = await CategoryRepo.findAllCategories({ includeInactive });

    const transformedCategories = categories.map((cat) => ({
      id: cat.slug,
      name: cat.name,
      icon: cat.icon,
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
      menuItemCount: cat.menuItemCount,
      dbId: cat.id,
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = categorySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, slug, icon, isActive, sortOrder } = validationResult.data;

    // Check if slug already exists
    const existingCategory = await CategoryRepo.findCategoryBySlug(slug);

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 400 }
      );
    }

    const category = await CategoryRepo.createCategory({ name, slug, icon, isActive, sortOrder });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
