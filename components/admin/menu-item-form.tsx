"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "./image-upload";
import { RecipeStepsEditor, RecipeStep } from "./recipe-steps-editor";
import { IngredientSelector, SelectedIngredient } from "./ingredient-selector";
import { TagSelector } from "./tag-selector";
import { createMenuItem, updateMenuItem, uploadMenuItemImage } from "@/lib/client/api/menu-items";
import type { CreateMenuItemInput } from "@/lib/client/api/menu-items";
import { toast } from "sonner";
import Link from "next/link";
import { Eye } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Size {
  id: string;
  name: string;
  abbreviation: string;
  priceModifier?: number;
}

interface Tag {
  id: string;
  name: string;
}

interface Ingredient {
  id: string;
  name: string;
  description?: string | null;
}

interface MenuItemFormProps {
  menuItemId?: string;
  initialData?: any;
  categories: Category[];
  sizes: Size[];
  tags: Tag[];
  ingredients: Ingredient[];
}

export function MenuItemForm({
  menuItemId,
  initialData,
  categories,
  sizes,
  tags,
  ingredients: availableIngredients,
}: MenuItemFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form state
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [basePrice, setBasePrice] = useState(
    initialData?.basePrice?.toString() || ""
  );
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [sortOrder, setSortOrder] = useState(
    initialData?.sortOrder?.toString() || "0"
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedSizeIds, setSelectedSizeIds] = useState<string[]>(
    initialData?.sizes?.map((s: any) => s.sizeId || s.id).filter(Boolean) || []
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags?.map((t: any) => t.tagId || t.id).filter(Boolean) || []
  );
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>(
    initialData?.ingredients?.map((ing: any) => ({
      ingredientId: ing.ingredientId || ing.id,
      quantity: ing.quantity,
      isOptional: ing.isOptional,
      sortOrder: ing.sortOrder || 0,
    })).filter((ing: any) => ing.ingredientId) || []
  );
  const [recipeSteps, setRecipeSteps] = useState<RecipeStep[]>(
    initialData?.recipeSteps || []
  );

  // Set default category if not set
  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  // const menu

  // Mutation for save
  const saveMutation = useMutation({
    mutationFn: async ({
      data,
      imageFile,
    }: {
      data: CreateMenuItemInput;
      imageFile: File | null;
    }) => {
      const savedItem = menuItemId
        ? await updateMenuItem(menuItemId, data)
        : await createMenuItem(data);

      if (imageFile) {
        await uploadMenuItemImage(savedItem.id, imageFile);
      }

      return savedItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Menu item saved successfully");
    },
    onError: (error: Error) => {
      toast.error(`Error:\n${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name,
      description,
      basePrice: parseFloat(basePrice),
      categoryId,
      isActive,
      isFeatured,
      sortOrder: parseInt(sortOrder),
      sizeIds: selectedSizeIds,
      tagIds: selectedTagIds,
      ingredients: selectedIngredients,
      recipeSteps,
    };

    saveMutation.mutate({ data: formData as any, imageFile });
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const isPastry = selectedCategory?.slug === "pastry";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Form Actions */}
      <div className="flex justify-between border border-border bg-card p-6">
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={saveMutation.isPending}
            className="bg-primary font-mono text-background hover:bg-primary/80"
          >
            {saveMutation.isPending ? "SAVING..." : menuItemId ? "UPDATE ITEM" : "CREATE ITEM"}
          </Button>
          <Button
            type="button"
            onClick={() => router.back()}
            variant="outline"
            className="border-border font-mono text-primary"
          >
            CANCEL
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-border font-mono text-primary"
        >
          <Link href={`/menu/${menuItemId}`}>
            <Eye />
          </Link>
        </Button>
      </div>
      {/* Basic Information */}
      <div className="space-y-4 border border-border bg-card p-6">
        <h3 className="font-mono text-lg text-primary">BASIC INFORMATION</h3>

        <div>
          <Label htmlFor="name" className="font-mono text-xs text-primary">
            NAME *
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 border-border font-mono text-foreground"
          />
        </div>

        <div>
          <Label
            htmlFor="description"
            className="font-mono text-xs text-primary"
          >
            DESCRIPTION *
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="mt-1 border-border font-mono text-foreground"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="basePrice"
              className="font-mono text-xs text-primary"
            >
              BASE PRICE *
            </Label>
            <Input
              id="basePrice"
              type="number"
              step="0.01"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
              className="mt-1 border-border font-mono text-foreground"
            />
          </div>

          <div>
            <Label
              htmlFor="category"
              className="font-mono text-xs text-primary"
            >
              CATEGORY *
            </Label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="mt-1 h-10 w-full border border-border font-mono text-sm text-foreground"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label
              htmlFor="sortOrder"
              className="font-mono text-xs text-primary"
            >
              SORT ORDER
            </Label>
            <Input
              id="sortOrder"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="mt-1 border-border font-mono text-foreground"
            />
          </div>

          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked as boolean)}
                className="border-[#FF6B35]"
              />
              <Label htmlFor="isActive" className="font-mono text-xs text-primary">
                ACTIVE
              </Label>
            </div>
          </div>

          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isFeatured"
                checked={isFeatured}
                onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                className="border-[#FF6B35]"
              />
              <Label
                htmlFor="isFeatured"
                className="font-mono text-xs text-primary"
              >
                FEATURED
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-4 border border-border bg-card p-6">
        <h3 className="font-mono text-lg text-primary">IMAGE</h3>
        <ImageUpload
          currentImage={initialData?.imagePath}
          onImageChange={setImageFile}
        />
      </div>

      {/* Sizes - Hide for pastries */}
      {!isPastry && (
        <div className="space-y-4 border border-border bg-card p-6">
          <h3 className="font-mono text-lg text-primary">SIZES</h3>
          <div className="space-y-2">
            {sizes.map((size) => (
              <div key={size.id} className="flex items-center gap-2">
                <Checkbox
                  id={`size-${size.id}`}
                  checked={selectedSizeIds.includes(size.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedSizeIds([...selectedSizeIds, size.id]);
                    } else {
                      setSelectedSizeIds(
                        selectedSizeIds.filter((id) => id !== size.id)
                      );
                    }
                  }}
                  className="border-border"
                />
                <Label
                  htmlFor={`size-${size.id}`}
                  className="font-mono text-sm text-foreground"
                >
                  {size.name} ({size.abbreviation})
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="space-y-4 border border-border bg-card p-6">
        <h3 className="font-mono text-lg text-primary">TAGS</h3>
        <TagSelector
          selectedTagIds={selectedTagIds}
          onChange={setSelectedTagIds}
          availableTags={tags}
        />
      </div>

      {/* Ingredients */}
      <div className="space-y-4 border border-border bg-card p-6">
        <h3 className="font-mono text-lg text-primary">INGREDIENTS</h3>
        <IngredientSelector
          selectedIngredients={selectedIngredients}
          onChange={setSelectedIngredients}
          availableIngredients={availableIngredients}
        />
      </div>

      {/* Recipe Steps */}
      <div className="space-y-4 border border-border bg-card p-6">
        <h3 className="font-mono text-lg text-primary">RECIPE STEPS</h3>
        <RecipeStepsEditor steps={recipeSteps} onChange={setRecipeSteps} />
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          className="bg-primary font-mono text-background hover:bg-primary/80"
        >
          {saveMutation.isPending ? "SAVING..." : menuItemId ? "UPDATE ITEM" : "CREATE ITEM"}
        </Button>
        <Button
          type="button"
          onClick={() => router.back()}
          variant="outline"
          className="border-border font-mono text-primary"
        >
          CANCEL
        </Button>
      </div>
    </form>
  );
}
