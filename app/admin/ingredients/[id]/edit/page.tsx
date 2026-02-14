"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { IngredientForm } from "@/components/admin/forms/ingredient-form";
import { fetchIngredient } from "@/lib/client/api";

export default function EditIngredientPage() {
  const params = useParams();
  const ingredientId = params.id as string;

  const { data: ingredient, isLoading, isError } = useQuery({
    queryKey: ["ingredient", ingredientId],
    queryFn: () => fetchIngredient(ingredientId),
    enabled: !!ingredientId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="font-mono text-primary">LOADING...</div>
      </div>
    );
  }

  if (isError || !ingredient) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="font-mono text-red-500">INGREDIENT NOT FOUND</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <IngredientForm
        ingredientId={ingredientId}
        initialData={ingredient}
      />
    </div>
  );
}
