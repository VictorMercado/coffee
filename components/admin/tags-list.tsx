"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTag, deleteTag } from "@/lib/client/api"
import { Trash2, Plus, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface Tag {
  id: string
  name: string
  slug: string
  menuItemCount: number
}

interface TagsListProps {
  initialTags: Tag[]
}

export function TagsList({ initialTags }: TagsListProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [tags, setTags] = useState<Tag[]>(initialTags)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null)
  const [newTagName, setNewTagName] = useState("")
  const [error, setError] = useState("")

  const createMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      router.refresh()
      setCreateDialogOpen(false)
      setNewTagName("")
      setError("")
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      router.refresh()
      setDeleteDialogOpen(false)
      setTagToDelete(null)
    },
    onError: (error: Error) => {
      alert(error.message)
    },
  })

  const handleCreate = () => {
    setError("")
    const slug = newTagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    createMutation.mutate({ name: newTagName, slug })
  }

  const handleDeleteClick = (tag: Tag) => {
    setTagToDelete(tag)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (tagToDelete) {
      deleteMutation.mutate(tagToDelete.id)
    }
  }

  return (
    <>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-end">
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-primary font-mono text-background hover:bg-primary/80"
          >
            <Plus className="mr-2 h-4 w-4" />
            NEW TAG
          </Button>
        </div>

        {/* Tags Table */}
        <div className="border border-border bg-[#1A0F08]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                  NAME
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                  SLUG
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs text-primary">
                  ITEMS
                </th>
                <th className="px-4 py-3 text-right font-mono text-xs text-primary">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {tags.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <div className="font-mono text-sm text-[#F5F5DC]/60">
                      NO TAGS FOUND
                    </div>
                  </td>
                </tr>
              ) : (
                tags.map((tag) => (
                  <tr
                    key={tag.id}
                    className="border-b border-border hover:bg-[#2D1810]"
                  >
                    <td className="px-4 py-3">
                      <div className="font-mono text-sm text-[#F5F5DC]">
                        {tag.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-[#F5F5DC]/80">
                      {tag.slug}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-[#F5F5DC]/80">
                      {tag.menuItemCount}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        onClick={() => handleDeleteClick(tag)}
                        disabled={deleteMutation.isPending || tag.menuItemCount > 0}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
                        title={
                          tag.menuItemCount > 0
                            ? "Cannot delete tag with menu items"
                            : "Delete tag"
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-mono text-primary">CREATE TAG</DialogTitle>
            <DialogDescription className="font-mono text-xs text-muted-foreground">
              Add a new tag for menu items
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="tagName" className="font-mono text-xs text-primary">
                TAG NAME *
              </Label>
              <Input
                id="tagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="e.g., Popular, Strong, Sweet"
                className="mt-1 border-border font-mono text-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTagName.trim()) {
                    handleCreate()
                  }
                }}
              />
              <p className="mt-1 font-mono text-xs text-[#F5F5DC]/60">
                Slug will be auto-generated
              </p>
            </div>

            {error && (
              <div className="border border-red-500 bg-red-900/20 p-3">
                <p className="font-mono text-xs text-red-400">{error}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false)
                setNewTagName("")
                setError("")
              }}
              disabled={createMutation.isPending}
              className="border-border font-mono text-primary"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newTagName.trim() || createMutation.isPending}
              className="bg-primary font-mono text-background hover:bg-primary/80"
            >
              {createMutation.isPending ? "CREATING..." : "CREATE TAG"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-mono text-primary">DELETE TAG</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{tagToDelete?.name}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
              className="border-border font-mono text-primary"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-mono"
            >
              {deleteMutation.isPending ? "DELETING..." : "DELETE"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
