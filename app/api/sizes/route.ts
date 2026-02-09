import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const sizes = await prisma.size.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    })

    const transformedSizes = sizes.map((size) => ({
      id: size.abbreviation,
      name: size.name,
      priceModifier: size.priceModifier,
    }))

    return NextResponse.json(transformedSizes)
  } catch (error) {
    console.error("Error fetching sizes:", error)
    return NextResponse.json({ error: "Failed to fetch sizes" }, { status: 500 })
  }
}
