import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { AdminBrandsPage } from "@/components/admin/brands-page"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Manage Brands – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

async function getBrandsData() {
  const brands = await prisma.brand.findMany({
    include: {
      _count: {
        select: { cars: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return { brands }
}

export default async function AdminBrandsPageWrapper() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const { brands } = await getBrandsData()

  return <AdminBrandsPage brands={brands} />
}
