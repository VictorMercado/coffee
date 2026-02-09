import { prisma } from "@/lib/prisma"
import { SizesList } from "@/components/admin/sizes-list"

async function getSizes() {
  const sizes = await prisma.size.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { menuItems: true },
      },
    },
  })

  return sizes.map((size) => ({
    id: size.id,
    name: size.name,
    abbreviation: size.abbreviation,
    priceModifier: size.priceModifier,
    isActive: size.isActive,
    sortOrder: size.sortOrder,
    menuItemCount: size._count.menuItems,
  }))
}

export default async function SizesPage() {
  const sizes = await getSizes()

  return <SizesList sizes={sizes} />
}
