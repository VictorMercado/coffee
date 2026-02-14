"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createSize, updateSize } from "@/lib/client/api";
import { sizeRequestSchema } from "@/lib/validations";
import { toast } from "sonner";

type SizeFormValues = z.infer<typeof sizeRequestSchema>;

interface SizeFormProps {
  sizeId?: string;
  initialData?: SizeFormValues;
}

export function SizeForm({ sizeId, initialData }: SizeFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!sizeId;

  const mutation = useMutation({
    mutationFn: (data: SizeFormValues) =>
      isEditing ? updateSize(sizeId, data) : createSize(data),
    onSuccess: () => {
      toast.success(isEditing ? "Size updated successfully" : "Size created successfully");
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
      router.push("/admin/sizes");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || `Failed to ${isEditing ? "update" : "create"} size`);
    },
  });

  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
      abbreviation: initialData?.abbreviation ?? "",
      priceModifier: initialData?.priceModifier ?? 0,
      isActive: initialData?.isActive ?? true,
      sortOrder: initialData?.sortOrder ?? 0,
    } as SizeFormValues,
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Basic Information */}
      <div className="space-y-4 border border-border bg-card p-6">
        <h3 className="font-mono text-lg text-primary">SIZE DETAILS</h3>

        {/* Name */}
        <form.Field
          name="name"
          validators={{ onChange: sizeRequestSchema.shape.name }}
        >
          {(field) => (
            <div>
              <Label htmlFor="name" className="font-mono text-xs text-primary">
                NAME *
              </Label>
              <Input
                id="name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="e.g., Large"
                className="mt-1 border-border font-mono text-foreground"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="mt-1 font-mono text-xs text-red-400">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Abbreviation */}
        <form.Field
          name="abbreviation"
          validators={{ onChange: sizeRequestSchema.shape.abbreviation }}
        >
          {(field) => (
            <div>
              <Label htmlFor="abbreviation" className="font-mono text-xs text-primary">
                ABBREVIATION *
              </Label>
              <Input
                id="abbreviation"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value.toUpperCase())}
                onBlur={field.handleBlur}
                placeholder="e.g., LG"
                maxLength={4}
                className="mt-1 border-border font-mono text-foreground uppercase"
              />
              <p className="mt-1 font-mono text-xs text-[#F5F5DC]/60">
                Short code used in orders (max 4 characters)
              </p>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="mt-1 font-mono text-xs text-red-400">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Price Modifier */}
        <form.Field
          name="priceModifier"
          validators={{ onBlur: sizeRequestSchema.shape.priceModifier }}
        >
          {(field) => (
            <div>
              <Label htmlFor="priceModifier" className="font-mono text-xs text-primary">
                PRICE MODIFIER ($)
              </Label>
              <Input
                id="priceModifier"
                type="number"
                step="0.25"
                min="0"
                defaultValue={field.state.value}
                onBlur={(e) => field.handleBlur}
                className="mt-1 border-border font-mono text-foreground"
              />
              <p className="mt-1 font-mono text-xs text-[#F5F5DC]/60">
                Amount added to the base price (e.g., 0.50 for +$0.50)
              </p>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="mt-1 font-mono text-xs text-red-400">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Sort Order */}
        <form.Field
          name="sortOrder"
          validators={{ onChange: sizeRequestSchema.shape.sortOrder._def.innerType }}
        >
          {(field) => (
            <div>
              <Label htmlFor="sortOrder" className="font-mono text-xs text-primary">
                SORT ORDER
              </Label>
              <Input
                id="sortOrder"
                type="number"
                min="0"
                value={field.state.value}
                onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                onBlur={field.handleBlur}
                className="mt-1 border-border font-mono text-foreground"
              />
              <p className="mt-1 font-mono text-xs text-[#F5F5DC]/60">
                Lower numbers appear first
              </p>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="mt-1 font-mono text-xs text-red-400">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Is Active */}
        <form.Field name="isActive">
          {(field) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked as boolean)}
              />
              <Label htmlFor="isActive" className="font-mono text-xs text-primary cursor-pointer">
                ACTIVE
              </Label>
            </div>
          )}
        </form.Field>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-primary font-mono text-background hover:bg-primary/80"
        >
          {mutation.isPending
            ? isEditing ? "UPDATING..." : "CREATING..."
            : isEditing ? "UPDATE SIZE" : "CREATE SIZE"}
        </Button>
        <Button
          type="button"
          onClick={() => router.push("/admin/sizes")}
          disabled={mutation.isPending}
          variant="outline"
          className="border-border font-mono text-primary"
        >
          CANCEL
        </Button>
      </div>
    </form>
  );
}
