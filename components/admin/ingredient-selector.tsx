"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export interface SelectedIngredient {
  ingredientId: string;
  quantity?: string;
  isOptional: boolean;
  sortOrder: number;
}

interface Ingredient {
  id: string;
  name: string;
  description?: string | null;
}

interface IngredientSelectorProps {
  selectedIngredients: SelectedIngredient[];
  onChange: (ingredients: SelectedIngredient[]) => void;
  availableIngredients: Ingredient[];
}

export function IngredientSelector({
  selectedIngredients,
  onChange,
  availableIngredients: allIngredients,
}: IngredientSelectorProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(allIngredients);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setIngredients(allIngredients);
  }, [allIngredients]);

  const addIngredient = (ingredient: Ingredient) => {
    const newIngredient: SelectedIngredient = {
      ingredientId: ingredient.id,
      quantity: "",
      isOptional: false,
      sortOrder: selectedIngredients.length,
    };
    onChange([...selectedIngredients, newIngredient]);
    setShowDropdown(false);
  };

  const removeIngredient = (ingredientId: string) => {
    onChange(
      selectedIngredients.filter((i) => i.ingredientId !== ingredientId)
    );
  };

  const updateIngredient = (
    ingredientId: string,
    updates: Partial<SelectedIngredient>
  ) => {
    onChange(
      selectedIngredients.map((i) =>
        i.ingredientId === ingredientId ? { ...i, ...updates } : i
      )
    );
  };

  const availableToAdd = ingredients.filter(
    (ing) =>
      !selectedIngredients.some((sel) => sel.ingredientId === ing.id)
  );

  return (
    <div className="space-y-4">
      {selectedIngredients.map((selectedIng) => {
        const ingredient = ingredients.find(
          (i) => i.id === selectedIng.ingredientId
        );
        if (!ingredient) return null;

        return (
          <div
            key={selectedIng.ingredientId}
            className="flex items-start gap-4 border border-[#FF6B35] bg-card p-4"
          >
            <div className="flex-1 space-y-3">
              <div className="font-mono text-sm text-[#D4AF37]">
                {ingredient.name}
              </div>
              <div>
                <Label className="font-mono text-xs text-[#D4AF37]">
                  QUANTITY (optional)
                </Label>
                <Input
                  value={selectedIng.quantity || ""}
                  onChange={(e) =>
                    updateIngredient(selectedIng.ingredientId, {
                      quantity: e.target.value,
                    })
                  }
                  placeholder="2 shots, 8 oz, etc."
                  className="mt-1 border-[#FF6B35] bg-[#2D1810] font-mono text-[#F5F5DC]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`optional-${selectedIng.ingredientId}`}
                  checked={selectedIng.isOptional}
                  onCheckedChange={(checked) =>
                    updateIngredient(selectedIng.ingredientId, {
                      isOptional: checked as boolean,
                    })
                  }
                  className="border-[#FF6B35]"
                />
                <Label
                  htmlFor={`optional-${selectedIng.ingredientId}`}
                  className="font-mono text-xs text-[#D4AF37]"
                >
                  OPTIONAL
                </Label>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => removeIngredient(selectedIng.ingredientId)}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      })}

      <div className="relative">
        <Button
          type="button"
          onClick={() => setShowDropdown(true)}
          variant="outline"
          className="w-full border-[#FF6B35] font-mono text-[#FF6B35] hover:bg-[#FF6B35] hover:text-[#1A0F08]"
        >
          <Plus className="mr-2 h-4 w-4" />
          ADD INGREDIENT
        </Button>

        {showDropdown && availableToAdd.length > 0 && (
          <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto border border-[#FF6B35] bg-card">
            {availableToAdd.map((ingredient) => (
              <button
                key={ingredient.id}
                type="button"
                onClick={() => addIngredient(ingredient)}
                className="w-full px-4 py-2 text-left font-mono text-sm text-[#F5F5DC] transition-colors hover:bg-[#2D1810]"
              >
                {ingredient.name}
              </button>
            ))}
          </div>
        )}
        {showDropdown && availableToAdd.length === 0 && (
          <div className="absolute z-10 mt-2 w-full border border-[#FF6B35] bg-card px-4 py-3 font-mono text-sm text-[#F5F5DC]/60">
            {ingredients.length === 0
              ? "No ingredients found. Add ingredients in the Ingredients section first."
              : "All ingredients have been added."}
          </div>
        )}
      </div>
    </div>
  );
}
