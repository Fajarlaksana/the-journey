import { Metadata } from "next"
import { notFound } from "next/navigation"
import { EventDetailPage } from "@/components/events/event-detail-page"
import { prisma } from "@/lib/prisma"

interface EventDetailProps {
  params: { slug: string }
}

async function getEventData(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      cars: {
        where: { published: true },
        include: {
          brand: true,
          event: true,
          category: true,
          award: true,
          images: {
            where: { order: 0 },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!event) return null

  return { event }
}

export async function generateMetadata({ params }: EventDetailProps): Promise<Metadata> {
  const data = await getEventData(params.slug)
  
  if (!data) {
    return {
      title: "Event Not Found",
    }
  }

  const { event } = data

  return {
    title: `${event.name} ${event.year} – Event Builds | TheJourney`,
    description: `Explore all modified cars from ${event.name} ${event.year}. ${event.cars.length} featured builds.`,
    openGraph: {
      title: `${event.name} ${event.year} – Event Builds | TheJourney`,
      description: `Explore all modified cars from ${event.name} ${event.year}.`,
      type: "website",
      images: event.imageUrl ? [event.imageUrl] : [],
    },
  }
}

export default async function EventDetailPageWrapper({ params }: EventDetailProps) {
  const data = await getEventData(params.slug)

  if (!data) {
    notFound()
  }

  return <EventDetailPage event={data.event} />
}
