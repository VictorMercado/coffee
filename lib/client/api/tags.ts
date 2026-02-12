export interface Tag {
  id: string
  name: string
}

export interface CreateTagInput {
  name: string
  slug: string
}

// Fetch all tags
export async function fetchTags(): Promise<Tag[]> {
  const response = await fetch("/api/tags")
  if (!response.ok) {
    throw new Error("Failed to fetch tags")
  }
  return response.json()
}

// Create tag
export async function createTag(data: CreateTagInput): Promise<Tag> {
  const response = await fetch("/api/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to create tag")
  }

  return response.json()
}

// Delete tag
export async function deleteTag(id: string): Promise<void> {
  const response = await fetch(`/api/tags/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to delete tag")
  }
}
