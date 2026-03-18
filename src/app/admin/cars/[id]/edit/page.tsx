import { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { EditCarForm } from "@/components/admin/edit-car-form"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Edit Car – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

async function getEditData(id: string) {
  const [car, brands, events, categories, awards] = await Promise.all([
    prisma.car.findUnique({
      where: { id },
      include: {
        brand: true,
        event: true,
        category: true,
        award: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.event.findMany({ orderBy: { year: 'desc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.award.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!car) return null

  return { car, brands, events, categories, awards }
}

export default async function EditCarPageWrapper({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const data = await getEditData(params.id)

  if (!data) {
    notFound()
  }

  return <EditCarForm {...data} />
}
