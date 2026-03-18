import { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { GenericEntityForm } from "@/components/admin/generic-entity-form"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Edit Award – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

async function getAwardData(id: string) {
  const award = await prisma.award.findUnique({
    where: { id },
  })

  return award
}

export default async function EditAwardPageWrapper({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const award = await getAwardData(params.id)

  if (!award) {
    notFound()
  }

  return (
    <GenericEntityForm
      entityType="award"
      entityName="Award"
      apiUrl="/admin/api/awards"
      redirectUrl="/admin/awards"
      item={award}
    />
  )
}
