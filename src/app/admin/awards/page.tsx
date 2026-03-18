import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { AdminAwardsPage } from "@/components/admin/awards-page"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Manage Awards – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

async function getAwardsData() {
  const awards = await prisma.award.findMany({
    include: {
      _count: {
        select: { cars: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return { awards }
}

export default async function AdminAwardsPageWrapper() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const { awards } = await getAwardsData()

  return <AdminAwardsPage awards={awards} />
}
