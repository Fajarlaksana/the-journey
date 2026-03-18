import { Metadata } from "next"
import { BuildsPage } from "@/components/builds/builds-page"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Car Builds – Modified Cars Gallery",
  description: "Explore hundreds of modified cars from automotive events. Filter by brand, category, and find inspiration for your next build.",
  openGraph: {
    title: "Car Builds – Modified Cars Gallery",
    description: "Explore hundreds of modified cars from automotive events.",
    type: "website",
  },
}

async function getBuildsData() {
  const [cars, brands, categories, events] = await Promise.all([
    prisma.car.findMany({
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
    }),
    prisma.brand.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.event.findMany({
      orderBy: { year: 'desc' },
    }),
  ])

  return { cars, brands, categories, events }
}

export default async function BuildsPageWrapper() {
  const data = await getBuildsData()

  return <BuildsPage {...data} />
}
