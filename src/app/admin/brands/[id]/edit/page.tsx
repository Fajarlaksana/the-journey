import { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { GenericEntityForm } from "@/components/admin/generic-entity-form"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Edit Brand – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

async function getBrandData(id: string) {
  const brand = await prisma.brand.findUnique({
    where: { id },
  })

  return brand
}

export default async function EditBrandPageWrapper({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  const brand = await getBrandData(params.id)

  if (!brand) {
    notFound()
  }

  return (
    <GenericEntityForm
      entityType="brand"
      entityName="Brand"
      apiUrl="/admin/api/brands"
      redirectUrl="/admin/brands"
      item={brand}
      extraFields={[
        { name: "country", label: "Country" }
      ]}
    />
  )
}
