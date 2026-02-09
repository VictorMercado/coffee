import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminHeader } from "@/components/admin/admin-header"
import { CategoryForm } from "@/components/admin/category-form"

async function getCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { menuItems: true },
      },
    },
  })

  if (!category) {
    return null
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    isActive: category.isActive,
    sortOrder: category.sortOrder,
    menuItemCount: category._count.menuItems,
  }
}

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const category = await getCategory(id)

  if (!category) {
    notFound()
  }

  return (
    <>
      <AdminHeader
        title="EDIT CATEGORY"
        description="Update category details"
      />
      <div className="p-8">
        <CategoryForm category={category} />
      </div>
    </>
  )
}
