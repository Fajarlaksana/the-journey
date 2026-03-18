import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { AdminCarsPage } from "@/components/admin/cars-page"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Manage Cars – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

async function getCarsData() {
  const cars = await prisma.car.findMany({
    include: {
      brand: true,
      event: true,
      category: true,
      images: {
        where: { order: 0 },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return { cars }
}

export default async function AdminCarsPageWrapper() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const { cars } = await getCarsData()

  return <AdminCarsPage cars={cars} />
}
