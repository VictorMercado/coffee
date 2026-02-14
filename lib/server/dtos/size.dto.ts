import type { Size } from "@/lib/types/size";

export type SizeDTO = Omit<Size, "createdAt" | "updatedAt">;
