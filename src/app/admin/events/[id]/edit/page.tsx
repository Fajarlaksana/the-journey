import { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { EventForm } from "@/components/admin/event-form"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Edit Event – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

async function getEventData(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
  })

  return event
}

export default async function EditEventPageWrapper({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const event = await getEventData(params.id)

  if (!event) {
    notFound()
  }

  return <EventForm event={event} />
}
