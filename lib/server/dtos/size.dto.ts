import type { Size } from "@/lib/types/size";

export type SizeDTO = Omit<Size, "createdAt" | "updatedAt">;

// Shape returned by GET /api/sizes (transformed in route)
export interface SizeListDTO {
  id: string;           // abbreviation used as id
  name: string;
  priceModifier: number;
}
