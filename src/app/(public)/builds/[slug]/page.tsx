import { Metadata } from "next"
import { notFound } from "next/navigation"
import { CarDetailPage } from "@/components/cars/car-detail-page"
import { prisma } from "@/lib/prisma"

interface CarDetailProps {
  params: { slug: string }
}

async function getCarData(slug: string) {
  const car = await prisma.car.findUnique({
    where: { slug, published: true },
    include: {
      brand: true,
      event: true,
      category: true,
      award: true,
      images: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!car) return null

  // Increment view count
  await prisma.car.update({
    where: { id: car.id },
    data: { viewCount: { increment: 1 } },
  })

  // Get related cars
  const relatedCars = await prisma.car.findMany({
    where: {
      published: true,
      categoryId: car.categoryId,
      id: { not: car.id },
    },
    include: {
      brand: true,
      event: true,
      category: true,
      images: {
        where: { order: 0 },
        take: 1,
      },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  })

  return { car, relatedCars }
}

export async function generateMetadata({ params }: CarDetailProps): Promise<Metadata> {
  const data = await getCarData(params.slug)
  
  if (!data) {
    return {
      title: "Car Not Found",
    }
  }

  const { car } = data

  return {
    title: `${car.name} – ${car.award?.name || car.category.name} | TheJourney`,
    description: `Explore the ${car.award?.name || ''} ${car.name} build by ${car.ownerName} featured at ${car.event.name} ${car.event.year}. ${car.description.substring(0, 150)}...`,
    openGraph: {
      title: `${car.name} – ${car.award?.name || car.category.name} | TheJourney`,
      description: `Explore this ${car.category.name.toLowerCase()} build featuring ${car.brand.name}.`,
      type: "article",
      images: car.images[0]?.url ? [car.images[0].url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${car.name} – ${car.award?.name || car.category.name} | TheJourney`,
      description: `Explore the ${car.name} build by ${car.ownerName}.`,
      images: car.images[0]?.url ? [car.images[0].url] : [],
    },
  }
}

export default async function CarDetailPageWrapper({ params }: CarDetailProps) {
  const data = await getCarData(params.slug)

  if (!data) {
    notFound()
  }

  return <CarDetailPage car={data.car} relatedCars={data.relatedCars} />
}
