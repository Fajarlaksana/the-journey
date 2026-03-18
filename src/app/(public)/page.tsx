import { HomepageHero } from "@/components/homepage/hero";
import { FeaturedBuilds } from "@/components/homepage/featured-builds";
import { CarOfTheMonth } from "@/components/homepage/car-of-the-month";
import { LatestEventBuilds } from "@/components/homepage/latest-event-builds";
import { TrendingBuilds } from "@/components/homepage/trending-builds";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // Revalidate every hour

async function getHomePageData() {
  try {
    const [featuredBuilds, carOfTheMonth, latestBuilds, trendingBuilds, events] = await Promise.all([
      prisma.car.findMany({
        where: { featured: true, published: true },
        include: {
          brand: true,
          event: true,
          category: true,
          images: {
            where: { order: 0 },
            take: 1,
          },
        },
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.car.findFirst({
        where: { carOfTheMonth: true, published: true },
        include: {
          brand: true,
          event: true,
          category: true,
          images: {
            take: 1,
          },
        },
      }),
      prisma.car.findMany({
        where: { published: true },
        include: {
          brand: true,
          event: true,
          category: true,
          images: {
            where: { order: 0 },
            take: 1,
          },
        },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.car.findMany({
        where: { trending: true, published: true },
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
      }),
      prisma.event.findMany({
        where: { featured: true },
        include: {
          cars: {
            where: { published: true },
            take: 4,
            include: {
              brand: true,
              images: {
                where: { order: 0 },
                take: 1,
              },
            },
          },
        },
        orderBy: { year: 'desc' },
        take: 3,
      }),
    ]);

    return {
      featuredBuilds,
      carOfTheMonth,
      latestBuilds,
      trendingBuilds,
      events,
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      featuredBuilds: [],
      carOfTheMonth: null,
      latestBuilds: [],
      trendingBuilds: [],
      events: [],
    };
  }
}

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <main className="min-h-screen">
      <HomepageHero featuredCar={data.carOfTheMonth || data.featuredBuilds[0]} />
      <FeaturedBuilds builds={data.featuredBuilds} />
      {data.carOfTheMonth && <CarOfTheMonth car={data.carOfTheMonth} />}
      <LatestEventBuilds events={data.events} />
      {data.trendingBuilds.length > 0 && <TrendingBuilds builds={data.trendingBuilds} />}
    </main>
  );
}
