import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { NewCarForm } from "@/components/admin/new-car-form"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Add New Car – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

async function getFormData() {
  const [brands, events, categories, awards] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.event.findMany({ orderBy: { year: 'desc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.award.findMany({ orderBy: { name: 'asc' } }),
  ])

  return { brands, events, categories, awards }
}

export default async function NewCarPageWrapper() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const data = await getFormData()

  return <NewCarForm {...data} />
}
