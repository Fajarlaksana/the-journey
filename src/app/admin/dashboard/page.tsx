import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { AdminDashboardPage } from "@/components/admin/dashboard-page"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Dashboard – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

async function getDashboardData() {
  const [carsCount, eventsCount, brandsCount, categoriesCount] = await Promise.all([
    prisma.car.count(),
    prisma.event.count(),
    prisma.brand.count(),
    prisma.category.count(),
  ])

  const recentCars = await prisma.car.findMany({
    include: {
      brand: true,
      event: true,
      images: {
        where: { order: 0 },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return {
    stats: {
      cars: carsCount,
      events: eventsCount,
      brands: brandsCount,
      categories: categoriesCount,
    },
    recentCars,
  }
}

export default async function AdminDashboardPageWrapper() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const data = await getDashboardData()

  return <AdminDashboardPage stats={data.stats} recentCars={data.recentCars} />
}
