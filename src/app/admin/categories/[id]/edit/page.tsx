import { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { GenericEntityForm } from "@/components/admin/generic-entity-form"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Edit Category – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

async function getCategoryData(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  })

  return category
}

export default async function EditCategoryPageWrapper({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const category = await getCategoryData(params.id)

  if (!category) {
    notFound()
  }

  return (
    <GenericEntityForm
      entityType="category"
      entityName="Category"
      apiUrl="/admin/api/categories"
      redirectUrl="/admin/categories"
      item={category}
    />
  )
}
