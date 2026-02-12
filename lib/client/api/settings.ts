import type { Settings } from "@/lib/settings-store";

export interface Size {
  id: string;
  name: string;
  abbreviation: string;
  priceModifier: number;
  isActive: boolean;
  sortOrder: number;
}

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
export async function createSize(data: {
  name: string;
  abbreviation: string;
  priceModifier: number;
  isActive?: boolean;
  sortOrder?: number;
}) {
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
export async function fetchSize(id: string): Promise<Size> {
  const response = await fetch(`/api/sizes/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch size");
  }
  return response.json();
}

// Update a size
export async function updateSize(
  id: string,
  data: {
    name?: string;
    abbreviation?: string;
    priceModifier?: number;
    isActive?: boolean;
    sortOrder?: number;
  }
): Promise<Size> {
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
