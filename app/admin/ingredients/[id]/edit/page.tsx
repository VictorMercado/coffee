"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AdminHeader } from "@/components/admin/admin-header";
import { IngredientForm } from "@/components/admin/forms/ingredient-form";
import { fetchIngredient } from "@/lib/client/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      <>
        <AdminHeader title="EDIT INGREDIENT" description="Loading..." />
        <div className="flex items-center justify-center p-12">
          <div className="font-mono text-primary">LOADING...</div>
        </div>
      </>
    );
  }

  if (isError || !ingredient) {
    return (
      <>
        <AdminHeader title="EDIT INGREDIENT" description="Item not found" />
        <div className="flex items-center justify-center p-12">
          <div className="font-mono text-red-500">INGREDIENT NOT FOUND</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title="EDIT INGREDIENT"
        description={`Editing: ${ingredient.name}`}
      />
      <div className="p-8">
        <IngredientForm
          ingredientId={ingredientId}
          initialData={ingredient}
        />
      </div>
    </>
  );
}
