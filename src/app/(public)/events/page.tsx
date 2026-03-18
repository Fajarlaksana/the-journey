import { Metadata } from "next"
import { EventsPage } from "@/components/events/events-page"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Events – Automotive Event Timeline",
  description: "Explore automotive events from past years. Browse modified cars from each event and discover the best builds.",
  openGraph: {
    title: "Events – Automotive Event Timeline",
    description: "Explore automotive events from past years.",
    type: "website",
  },
}

async function getEventsData() {
  const events = await prisma.event.findMany({
    include: {
      cars: {
        where: { published: true },
        include: {
          brand: true,
          images: {
            where: { order: 0 },
            take: 1,
          },
        },
        take: 4,
      },
    },
    orderBy: { year: 'desc' },
  })

  return { events }
}

export default async function EventsPageWrapper() {
  const { events } = await getEventsData()

  return <EventsPage events={events} />
}
