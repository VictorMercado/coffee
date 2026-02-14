import type { z } from "zod";
import type { sizeRequestSchema } from "@/lib/validations";
import type { Settings } from "@/lib/settings-store";
import type { SizeListDTO, SizeDTO } from "@/lib/server/dtos";

// ── Re-export server DTOs as client-friendly names ─────────────

export type Size = SizeListDTO;         // public API shape (simplified)
export type SizeDetail = SizeDTO;       // admin/full shape

// ── Input type derived from Zod schema ─────────────────────────

export type CreateSizeInput = z.infer<typeof sizeRequestSchema>;

// ── Fetchers ───────────────────────────────────────────────────

// Fetch settings
export async function fetchSettings(): Promise<Settings> {
  const response = await fetch("/api/settings");
  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }
  return response.json();
}

// Update settings
export async function updateSettings(settings: Settings): Promise<Settings> {
  const response = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update settings");
  }

  return response.json();
}

// Fetch sizes
export async function fetchSizes(): Promise<Size[]> {
  const response = await fetch("/api/sizes");
  if (!response.ok) {
    throw new Error("Failed to fetch sizes");
  }
  return response.json();
}

// Update size active status
export async function updateSizeStatus(
  sizeId: string,
  isActive: boolean
): Promise<void> {
  const response = await fetch(`/api/sizes/${sizeId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update size");
  }
}

// Create a new size
export async function createSize(data: CreateSizeInput) {
  const response = await fetch("/api/sizes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create size");
  }

  return response.json();
}

// Fetch a single size
export async function fetchSize(id: string): Promise<SizeDetail> {
  const response = await fetch(`/api/sizes/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch size");
  }
  return response.json();
}

// Update a size
export async function updateSize(
  id: string,
  data: Partial<CreateSizeInput>
): Promise<SizeDetail> {
  const response = await fetch(`/api/sizes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update size");
  }

  return response.json();
}
