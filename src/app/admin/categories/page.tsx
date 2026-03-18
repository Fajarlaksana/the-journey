import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { AdminCategoriesPage } from "@/components/admin/categories-page"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Manage Categories – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

async function getCategoriesData() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { cars: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return { categories }
}

export default async function AdminCategoriesPageWrapper() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const { categories } = await getCategoriesData()

  return <AdminCategoriesPage categories={categories} />
}
