import type { Size } from "@/lib/types/size";

export type SizeDTO = Omit<Size, "createdAt" | "updatedAt"> & {
  menuItemCount?: number;
};

// Shape returned by GET /api/sizes (transformed in route)
export type SizeListDTO = SizeDTO[];
