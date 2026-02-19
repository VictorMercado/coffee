"use client"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createTag } from "@/lib/client/api"

interface Tag {
  id: string
  name: string
  slug?: string
}

interface TagSelectorProps {
  selectedTagIds: string[]
  onChange: (tagIds: string[]) => void
  availableTags: Tag[]
}

export function TagSelector({ selectedTagIds, onChange, availableTags: allTags }: TagSelectorProps) {
  const queryClient = useQueryClient()
  const [tags, setTags] = useState<Tag[]>(allTags)
  const [newTagName, setNewTagName] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    setTags(allTags)
  }, [allTags])

  const mutation = useMutation({
    mutationFn: createTag,
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      setTags([...tags, newTag])
      onChange([...selectedTagIds, newTag.id])
      setNewTagName("")
      setShowDropdown(false)
    },
    onError: (error: Error) => {
      alert(error.message || "Failed to create tag")
    },
  })

  const handleCreateTag = () => {
    if (!newTagName.trim()) return
    mutation.mutate({ name: newTagName, slug: newTagName.toLowerCase().replace(/\s+/g, "-") })
  }

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId))
    } else {
      onChange([...selectedTagIds, tagId])
    }
  }

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id))
  const unselectedTags = tags.filter((tag) => !selectedTagIds.includes(tag.id))

  return (
    <div className="space-y-4">
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="flex items-center gap-2 border border-[#FF6B35] bg-card px-3 py-1 font-mono text-xs text-[#F5F5DC]"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => toggleTag(tag.id)}
                className="text-red-500 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          variant="outline"
          className="w-full border-[#FF6B35] font-mono text-[#FF6B35] hover:bg-[#FF6B35] hover:text-[#1A0F08]"
        >
          <Plus className="mr-2 h-4 w-4" />
          ADD TAG
        </Button>

        {showDropdown && (
          <div className="absolute z-10 mt-2 w-full border border-[#FF6B35] bg-card">
            <div className="border-b border-[#FF6B35] p-3">
              <div className="flex gap-2">
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
                  placeholder="New tag name..."
                  className="border-[#FF6B35] bg-[#2D1810] font-mono text-[#F5F5DC]"
                />
                <Button
                  type="button"
                  onClick={handleCreateTag}
                  disabled={mutation.isPending}
                  size="sm"
                  className="bg-[#FF6B35] font-mono text-[#1A0F08]"
                >
                  CREATE
                </Button>
              </div>
            </div>

            {unselectedTags.length > 0 && (
              <div className="max-h-40 overflow-y-auto">
                {unselectedTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className="w-full px-4 py-2 text-left font-mono text-sm text-[#F5F5DC] transition-colors hover:bg-[#2D1810]"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
