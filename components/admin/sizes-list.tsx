"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { fetchSizes, updateSizeStatus } from "@/lib/client/api";
import { Pencil, Plus } from "lucide-react";
import { Button } from "../ui/button";

interface Size {
  id: string;
  name: string;
  abbreviation: string;
  priceModifier: number;
  isActive: boolean;
  sortOrder: number;
  menuItemCount: number;
}

interface SizesListProps {
  sizes: Size[];
}

export function SizesList({ sizes: initialSizes }: SizesListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const { data: sizes = initialSizes } = useQuery({
    queryKey: ["sizes", { admin: true }],
    queryFn: () => fetchSizes(true),
    initialData: initialSizes,
  });

  const mutation = useMutation({
    mutationFn: ({ sizeId, isActive }: { sizeId: string; isActive: boolean; }) =>
      updateSizeStatus(sizeId, isActive),
    onMutate: async ({ sizeId, isActive }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["sizes", { admin: true }] });

      // Snapshot the previous value
      const previousSizes = queryClient.getQueryData<Size[]>(["sizes", { admin: true }]);

      // Optimistically update to the new value
      queryClient.setQueryData<Size[]>(["sizes", { admin: true }], (old) =>
        old?.map((size) =>
          size.id === sizeId ? { ...size, isActive } : size
        )
      );

      // Return a context object with the snapshotted value
      return { previousSizes };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
      router.refresh();
    },
    onError: (error: Error, __variables, context) => {
      // Revert optimistic update on error
      if (context?.previousSizes) {
        queryClient.setQueryData(["sizes", { admin: true }], context.previousSizes);
      }
      setError(error.message || "Failed to update size");
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ["sizes", { admin: true }] });
    },
  });

  const handleToggle = (sizeId: string, currentValue: boolean) => {
    setError("");
    mutation.mutate({ sizeId, isActive: !currentValue });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button
          onClick={() => router.push("/admin/sizes/new")}
          className="bg-primary font-mono text-background hover:bg-primary/80"
        >
          <Plus className="mr-2 h-4 w-4" />
          NEW SIZE
        </Button>
      </div>
      {error && (
        <div className="border border-red-500 bg-red-900/20 p-4">
          <p className="font-mono text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="border border-border bg-card overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left font-mono text-xs text-primary tracking-wider">
                NAME
              </th>
              <th className="px-6 py-4 text-left font-mono text-xs text-primary tracking-wider">
                ABBREVIATION
              </th>
              <th className="px-6 py-4 text-left font-mono text-xs text-primary tracking-wider">
                PRICE MODIFIER
              </th>
              <th className="px-6 py-4 text-left font-mono text-xs text-primary tracking-wider">
                MENU ITEMS
              </th>
              <th className="px-6 py-4 text-center font-mono text-xs text-primary tracking-wider">
                ACTIVE
              </th>
              <th className="px-6 py-4 text-center font-mono text-xs text-primary tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sizes.map((size) => (
              <tr
                key={size.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-mono text-sm text-foreground">
                    {size.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono text-sm text-muted-foreground">
                    {size.abbreviation}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono text-sm text-muted-foreground">
                    {size.priceModifier > 0 && "+"}${size.priceModifier.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono text-sm text-muted-foreground">
                    {size.menuItemCount}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center">
                    <Switch
                      checked={size.isActive}
                      onCheckedChange={() => handleToggle(size.id, size.isActive)}
                      disabled={mutation.isPending}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/sizes/${size.id}/edit`)}
                      className="border-primary text-primary hover:bg-primary hover:text-[#1A0F08]"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border border-border bg-card p-4">
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-primary">NOTE:</span> Disabling a size will hide it from customers but won't affect existing menu item configurations. You can re-enable sizes at any time.
        </p>
      </div>
    </div>
  );
}
