import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { EventForm } from "@/components/admin/event-form"

export const metadata: Metadata = {
  title: "Add New Event – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function NewEventPageWrapper() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  return <EventForm />
}
