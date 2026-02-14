import type { User } from "@/lib/types/user";

export type UserDTO = Omit<User, "password" | "createdAt" | "updatedAt">;
