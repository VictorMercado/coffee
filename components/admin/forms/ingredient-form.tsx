"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createIngredient, updateIngredient } from "@/lib/client/api";
import type { Ingredient } from "@/lib/types/ingredient";

interface IngredientFormProps {
  ingredientId?: string;
  initialData?: Ingredient;
}

export function IngredientForm({
  ingredientId,
  initialData,
}: IngredientFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [allergens, setAllergens] = useState(initialData?.allergens || "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      ingredientId ? updateIngredient(ingredientId, data) : createIngredient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      router.push("/admin/ingredients");
      router.refresh();
    },
    onError: (error: Error) => {
      alert(`Error: ${error.message || "Failed to save ingredient"}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name,
      description: description || null,
      allergens: allergens || null,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 border border-border bg-card p-6">
        <div>
          <Label htmlFor="name" className="font-mono text-xs text-muted-foreground">
            NAME *
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="description"
            className="font-mono text-xs text-muted-foreground"
          >
            DESCRIPTION
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="allergens"
            className="font-mono text-xs text-muted-foreground"
          >
            ALLERGENS (comma-separated)
          </Label>
          <Input
            id="allergens"
            value={allergens}
            onChange={(e) => setAllergens(e.target.value)}
            placeholder="Dairy, Gluten, Nuts"
            className="mt-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(checked as boolean)}
          />
          <Label htmlFor="isActive" className="font-mono text-xs text-muted-foreground">
            ACTIVE
          </Label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-primary font-mono text-background hover:bg-primary/80"
        >
          {mutation.isPending
            ? "SAVING..."
            : ingredientId
              ? "UPDATE INGREDIENT"
              : "CREATE INGREDIENT"}
        </Button>
        <Button
          type="button"
          onClick={() => router.back()}
          variant="outline"
          className="font-mono"
        >
          CANCEL
        </Button>
      </div>
    </form>
  );
}
