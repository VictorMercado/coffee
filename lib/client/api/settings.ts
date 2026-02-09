import type { Settings } from "@/lib/settings-store"

export interface Size {
  id: string
  name: string
  priceModifier: number
}

// Fetch settings
export async function fetchSettings(): Promise<Settings> {
  const response = await fetch("/api/settings")
  if (!response.ok) {
    throw new Error("Failed to fetch settings")
  }
  return response.json()
}

// Update settings
export async function updateSettings(settings: Settings): Promise<Settings> {
  const response = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to update settings")
  }

  return response.json()
}

// Fetch sizes
export async function fetchSizes(): Promise<Size[]> {
  const response = await fetch("/api/sizes")
  if (!response.ok) {
    throw new Error("Failed to fetch sizes")
  }
  return response.json()
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
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to update size")
  }
}
