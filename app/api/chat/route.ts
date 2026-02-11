import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-3-flash-preview"),
    system: `You are a creative coffee recipe expert working for Orbit Coffee, a specialty coffee shop. 
              Help create recipes, suggest ingredient combinations, and provide preparation instructions.
              Keep responses concise and practical. Format recipes with clear sections:
              - Name
              - Ingredients (with quantities)
              - Steps (numbered)
              - Tips (optional)
              When suggesting menu items, consider both hot and iced variations.
              
              You have access to tools to look up existing menu items, available ingredients, 
              menu categories, and to create new menu items with recipe steps.
              IMPORTANT: Always check existing menu items first before creating a new drink 
              to avoid duplicates. Also check available ingredients and categories.
              If an ingredient is missing, offer to add it first.
              When creating a menu item, always include the relevant ingredients with quantities.
              After creating a menu item, add recipe/preparation steps.`,
    messages: await convertToModelMessages(messages),
    tools: {
      getMenuItems: {
        description:
          "Get all current menu items. ALWAYS call this first before creating a new drink to check what already exists and avoid duplicates.",
        inputSchema: z.object({}),
        execute: async () => {
          const items = await prisma.menuItem.findMany({
            include: { category: true },
            orderBy: { name: "asc" },
          });
          return items.map((i) => ({
            id: i.id,
            name: i.name,
            description: i.description,
            category: i.category.name,
            basePrice: i.basePrice,
            isActive: i.isActive,
          }));
        },
      },
      getIngredients: {
        description:
          "Get all available ingredients in the shop. Use this to see what ingredients are available before suggesting recipes.",
        inputSchema: z.object({}),
        execute: async () => {
          const ingredients = await prisma.ingredient.findMany({
            where: { isActive: true },
            orderBy: { name: "asc" },
          });
          return ingredients.map((i) => ({
            id: i.id,
            name: i.name,
            description: i.description,
            allergens: i.allergens,
          }));
        },
      },
      addIngredient: {
        description:
          "Add a new ingredient to the shop inventory. Use this when the user wants to add an ingredient that doesn't exist yet.",
        inputSchema: z.object({
          name: z.string().describe("Name of the ingredient"),
          description: z
            .string()
            .optional()
            .describe("Brief description of the ingredient"),
          allergens: z
            .string()
            .optional()
            .describe("Comma-separated allergen info, e.g. 'dairy, nuts'"),
        }),
        execute: async ({ name, description, allergens }: { name: string; description?: string; allergens?: string; }) => {
          const existing = await prisma.ingredient.findUnique({
            where: { name },
          });
          if (existing) {
            return {
              success: false,
              message: `Ingredient "${name}" already exists.`,
            };
          }
          const ingredient = await prisma.ingredient.create({
            data: { name, description, allergens },
          });
          return {
            success: true,
            message: `Added "${name}" to ingredients.`,
            ingredientId: ingredient.id,
          };
        },
      },
      getCategories: {
        description:
          "Get all available menu categories. Use this before creating a menu item to find the correct categoryId.",
        inputSchema: z.object({}),
        execute: async () => {
          const categories = await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
          });
          return categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
          }));
        },
      },
      createMenuItem: {
        description:
          "Create a new menu item with ingredients. Always call getIngredients and getCategories first to get valid IDs.",
        inputSchema: z.object({
          name: z.string().describe("Name of the menu item, e.g. 'Vanilla Oat Latte'"),
          description: z.string().describe("Appetizing description of the drink"),
          basePrice: z.number().describe("Price in dollars, e.g. 5.50"),
          categoryId: z.string().describe("Category ID from getCategories"),
          isFeatured: z.boolean().optional().describe("Whether to feature this item on the homepage"),
          ingredients: z
            .array(
              z.object({
                ingredientId: z.string().describe("Ingredient ID from getIngredients"),
                quantity: z.string().optional().describe("Amount, e.g. '2 shots', '8 oz'"),
                isOptional: z.boolean().optional().describe("Whether this ingredient is optional"),
              })
            )
            .describe("List of ingredients with quantities"),
        }),
        execute: async ({
          name,
          description,
          basePrice,
          categoryId,
          isFeatured,
          ingredients,
        }: {
          name: string;
          description: string;
          basePrice: number;
          categoryId: string;
          isFeatured?: boolean;
          ingredients: { ingredientId: string; quantity?: string; isOptional?: boolean; }[];
        }) => {
          try {
            const menuItem = await prisma.menuItem.create({
              data: {
                name,
                description,
                basePrice,
                categoryId,
                isFeatured: isFeatured ?? false,
                ingredients: {
                  create: ingredients.map((ing, idx) => ({
                    ingredientId: ing.ingredientId,
                    quantity: ing.quantity,
                    isOptional: ing.isOptional ?? false,
                    sortOrder: idx,
                  })),
                },
              },
              include: {
                category: true,
                ingredients: { include: { ingredient: true } },
              },
            });
            revalidatePath("/admin/menu-items");
            revalidatePath("/menu");
            return {
              success: true,
              message: `Created menu item "${menuItem.name}" in ${menuItem.category.name} at $${menuItem.basePrice}`,
              menuItemId: menuItem.id,
              ingredientCount: menuItem.ingredients.length,
            };
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            return {
              success: false,
              message: `Failed to create menu item: ${message}`,
            };
          }
        },
      },
      addRecipeSteps: {
        description:
          "Add recipe/preparation steps to a menu item. This replaces any existing steps. Use after creating a menu item.",
        inputSchema: z.object({
          menuItemId: z.string().describe("The menu item ID to add steps to"),
          steps: z
            .array(
              z.object({
                stepNumber: z.number().describe("Step order, starting from 1"),
                instruction: z.string().describe("What to do in this step"),
                duration: z.string().optional().describe("How long, e.g. '30 seconds', '2 minutes'"),
                temperature: z.string().optional().describe("Temperature if relevant, e.g. '195°F'"),
              })
            )
            .describe("Ordered list of preparation steps"),
        }),
        execute: async ({
          menuItemId,
          steps,
        }: {
          menuItemId: string;
          steps: { stepNumber: number; instruction: string; duration?: string; temperature?: string; }[];
        }) => {
          try {
            // Delete existing steps and create new ones
            await prisma.recipeStep.deleteMany({ where: { menuItemId } });
            await prisma.recipeStep.createMany({
              data: steps.map((s) => ({
                menuItemId,
                stepNumber: s.stepNumber,
                instruction: s.instruction,
                duration: s.duration,
                temperature: s.temperature,
              })),
            });
            revalidatePath("/admin/menu-items");
            revalidatePath("/menu");
            return {
              success: true,
              message: `Added ${steps.length} recipe steps.`,
              stepCount: steps.length,
            };
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            return {
              success: false,
              message: `Failed to add recipe steps: ${message}`,
            };
          }
        },
      },
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
