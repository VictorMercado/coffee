"use client"

import { useState } from "react"
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface RecipeStep {
  stepNumber: number
  instruction: string
  duration?: string
  temperature?: string
}

interface RecipeStepsEditorProps {
  steps: RecipeStep[]
  onChange: (steps: RecipeStep[]) => void
}

export function RecipeStepsEditor({ steps, onChange }: RecipeStepsEditorProps) {
  const addStep = () => {
    const newStep: RecipeStep = {
      stepNumber: steps.length + 1,
      instruction: "",
      duration: "",
      temperature: "",
    }
    onChange([...steps, newStep])
  }

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index)
    // Renumber steps
    const renumbered = newSteps.map((step, i) => ({
      ...step,
      stepNumber: i + 1,
    }))
    onChange(renumbered)
  }

  const moveStep = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= steps.length) return

    const newSteps = [...steps]
    ;[newSteps[index], newSteps[newIndex]] = [
      newSteps[newIndex],
      newSteps[index],
    ]

    // Renumber
    const renumbered = newSteps.map((step, i) => ({
      ...step,
      stepNumber: i + 1,
    }))
    onChange(renumbered)
  }

  const updateStep = (
    index: number,
    field: keyof RecipeStep,
    value: string | number
  ) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    onChange(newSteps)
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className="space-y-3 border border-[#FF6B35] bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-[#D4AF37]">
              STEP {step.stepNumber}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => moveStep(index, "up")}
                disabled={index === 0}
                variant="outline"
                size="sm"
                className="h-8 w-8 border-[#D4AF37] p-0 text-[#D4AF37]"
              >
                <MoveUp className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                onClick={() => moveStep(index, "down")}
                disabled={index === steps.length - 1}
                variant="outline"
                size="sm"
                className="h-8 w-8 border-[#D4AF37] p-0 text-[#D4AF37]"
              >
                <MoveDown className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                onClick={() => removeStep(index)}
                variant="outline"
                size="sm"
                className="h-8 w-8 border-red-500 p-0 text-red-500"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="font-mono text-xs text-[#D4AF37]">
              INSTRUCTION
            </Label>
            <Textarea
              value={step.instruction}
              onChange={(e) => updateStep(index, "instruction", e.target.value)}
              className="mt-1 border-[#FF6B35] bg-[#2D1810] font-mono text-[#F5F5DC]"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-mono text-xs text-[#D4AF37]">
                DURATION (optional)
              </Label>
              <Input
                value={step.duration || ""}
                onChange={(e) => updateStep(index, "duration", e.target.value)}
                placeholder="30 seconds"
                className="mt-1 border-[#FF6B35] bg-[#2D1810] font-mono text-[#F5F5DC]"
              />
            </div>
            <div>
              <Label className="font-mono text-xs text-[#D4AF37]">
                TEMPERATURE (optional)
              </Label>
              <Input
                value={step.temperature || ""}
                onChange={(e) =>
                  updateStep(index, "temperature", e.target.value)
                }
                placeholder="195°F"
                className="mt-1 border-[#FF6B35] bg-[#2D1810] font-mono text-[#F5F5DC]"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={addStep}
        variant="outline"
        className="w-full border-[#FF6B35] font-mono text-[#FF6B35] hover:bg-[#FF6B35] hover:text-[#1A0F08]"
      >
        <Plus className="mr-2 h-4 w-4" />
        ADD STEP
      </Button>
    </div>
  )
}
