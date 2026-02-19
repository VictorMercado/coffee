import { z } from "zod";

// --- Auth ---

export const signupRequestSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// --- Users ---

export const createUserRequestSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "ADMIN"]).optional(),
  email: z.string().email().optional().nullable(),
});

export const userUpdateRequestSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
  email: z.string().email().optional().nullable(),
});

// --- Categories ---

export const categoryRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  icon: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

// --- Tags ---

export const tagRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
});

// --- Sizes ---

export const sizeRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  abbreviation: z.string().min(1, "Abbreviation is required").max(4, "Max 4 characters"),
  priceModifier: z.number().min(0, "Price modifier must be >= 0").transform((value) => parseFloat(value.toFixed(2))),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

// --- Ingredients ---

export const ingredientRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  allergens: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

// --- Recipe Steps ---

export const recipeStepRequestSchema = z.object({
  stepNumber: z.number().int().positive(),
  instruction: z.string().min(1, "Instruction is required"),
  duration: z.string().optional().nullable(),
  temperature: z.string().optional().nullable(),
});

// --- Menu Item Ingredients ---

export const menuItemIngredientRequestSchema = z.object({
  ingredientId: z.string(),
  quantity: z.string().optional().nullable(),
  isOptional: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

// --- Menu Items ---

export const menuItemRequestSchema = z.object({
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
  ingredients: z.array(menuItemIngredientRequestSchema).default([]),
  recipeSteps: z.array(recipeStepRequestSchema).default([]),
});

// --- Orders ---

export const orderItemRequestSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().int().positive(),
  size: z.string(),
  price: z.number().positive(),
});

export const orderRequestSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email().optional().nullable(),
  items: z.array(orderItemRequestSchema).min(1, "Order must have at least one item"),
  total: z.number().positive(),
});

export const orderStatusRequestSchema = z.object({
  status: z.enum(["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELLED"]),
});

export const orderUpdateRequestSchema = z.object({
  userId: z.string().nullable().optional(),
  customerName: z.string().min(1).optional(),
  customerEmail: z.string().email().nullable().optional(),
  status: z.enum(["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELLED"]).optional(),
  subtotal: z.number().positive().optional(),
  tax: z.number().min(0).optional(),
  total: z.number().positive().optional(),
});

// --- Settings ---

export const settingsRequestSchema = z.object({
  pricingEnabled: z.boolean(),
  storeName: z.string().min(1),
  storeAddress: z.string().min(1),
  storePhone: z.string().min(1),
  taxRate: z.number().min(0).max(100),
  prepTime: z.number().int().min(1),
});
