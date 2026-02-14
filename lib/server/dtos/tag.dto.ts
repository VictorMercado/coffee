import type { Tag } from "@/lib/types/tag";

export type TagDTO = Omit<Tag, "createdAt" | "updatedAt">;
