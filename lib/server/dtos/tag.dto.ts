import type { Tag } from "@/lib/types/tag";

export type TagDTO = Omit<Tag, "createdAt" | "updatedAt">;

// Shape returned by GET /api/tags (raw Prisma, JSON-serialized)
export interface TagListDTO {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
