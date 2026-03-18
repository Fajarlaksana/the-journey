import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { AdminEventsPage } from "@/components/admin/events-page"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Manage Events – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

async function getEventsData() {
  const events = await prisma.event.findMany({
    include: {
      _count: {
        select: { cars: true },
      },
    },
    orderBy: { year: 'desc' },
  })

  return { events }
}

export default async function AdminEventsPageWrapper() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const { events } = await getEventsData()

  return <AdminEventsPage events={events} />
}
