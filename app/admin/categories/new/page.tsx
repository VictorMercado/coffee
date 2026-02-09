"use client"

import { AdminHeader } from "@/components/admin/admin-header"
import { CategoryForm } from "@/components/admin/category-form"

export default function NewCategoryPage() {
  return (
    <>
      <AdminHeader
        title="CREATE CATEGORY"
        description="Add a new menu category"
      />
      <div className="p-8">
        <CategoryForm />
      </div>
    </>
  )
}
