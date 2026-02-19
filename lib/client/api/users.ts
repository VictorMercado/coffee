import type { z } from "zod";
import type { userUpdateRequestSchema } from "@/lib/validations";

export type UpdateUserInput = z.infer<typeof userUpdateRequestSchema>;

export interface UserListItem {
  id: string;
  username: string;
  email: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Fetch all users
export async function fetchUsers(): Promise<UserListItem[]> {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

// Fetch single user
export async function fetchUser(id: string): Promise<UserListItem> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

// Update user
export async function createUser(data: {
  username: string;
  password: string;
  role?: "USER" | "ADMIN";
  email?: string | null;
}): Promise<UserListItem> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create user");
  }

  return response.json();
}

export async function updateUser(
  id: string,
  data: UpdateUserInput
): Promise<UserListItem> {
  const response = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update user");
  }

  return response.json();
}

// Delete user
export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete user");
  }
}
