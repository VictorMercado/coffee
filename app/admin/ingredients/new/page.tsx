"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { IngredientForm } from "@/components/admin/forms/ingredient-form";

export default function NewIngredientPage() {
  return (
    <>
      <AdminHeader
        title="CREATE INGREDIENT"
        description="Add a new ingredient to the database"
      />
      <div className="p-8">
        <IngredientForm />
      </div>
    </>
  );
}
