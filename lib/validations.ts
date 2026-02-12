import { z } from "zod";

export const recipeStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  instruction: z.string().min(1, "Instruction is required"),
  duration: z.string().optional().nullable(),
  temperature: z.string().optional().nullable(),
});

export const menuItemIngredientSchema = z.object({
  ingredientId: z.string(),
  quantity: z.string().optional().nullable(),
  isOptional: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.number().positive("Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  imagePath: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  sizeIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
  ingredients: z.array(menuItemIngredientSchema).default([]),
  recipeSteps: z.array(recipeStepSchema).default([]),
});

export const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  allergens: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
});

export const sizeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  abbreviation: z.string().min(1, "Abbreviation is required").max(4, "Max 4 characters"),
  priceModifier: z.number().min(0, "Price modifier must be >= 0"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});
