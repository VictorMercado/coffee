import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const settingsSchema = z.object({
  pricingEnabled: z.boolean(),
  storeName: z.string().min(1),
  storeAddress: z.string().min(1),
  storePhone: z.string().min(1),
  taxRate: z.number().min(0).max(100),
  prepTime: z.number().int().min(1),
})

async function getOrCreateSettings() {
  let settings = await prisma.settings.findFirst()

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        pricingEnabled: true,
        storeName: "Orbit Coffee",
        storeAddress: "123 Space Station Blvd\nLunar Colony, Moon 90210",
        storePhone: "(555) 123-4567",
        taxRate: 8.0,
        prepTime: 15,
      },
    })
  }

  return settings
}

export async function GET(request: NextRequest) {
  try {
    const settings = await getOrCreateSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = settingsSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Get or create settings
    let settings = await prisma.settings.findFirst()

    if (!settings) {
      settings = await prisma.settings.create({ data })
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data,
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
