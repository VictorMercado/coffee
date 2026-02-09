"use client"

import { useState } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  currentImage?: string | null
  onImageChange: (file: File | null) => void
}

export function ImageUpload({ currentImage, onImageChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageChange(file)
    } else {
      setPreview(null)
      onImageChange(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative aspect-square w-full max-w-sm overflow-hidden border border-border bg-card">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
          />
          <Button
            type="button"
            onClick={() => handleFileChange(null)}
            className="absolute right-2 top-2 h-8 w-8 bg-red-500 p-0 hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative flex aspect-square w-full max-w-sm cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-colors ${
            isDragging
              ? "border-border bg-card"
              : "border-border bg-card hover:bg-card"
          }`}
        >
          <Upload className="mb-4 h-12 w-12 text-primary pointer-events-none" />
          <p className="mb-2 font-mono text-sm text-primary pointer-events-none">
            DRAG IMAGE HERE
          </p>
          <p className="mb-4 font-mono text-xs text-primary pointer-events-none">
            or click to browse
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          />
        </label>
      )}
    </div>
  )
}
