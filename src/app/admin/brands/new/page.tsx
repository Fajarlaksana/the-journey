import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { GenericEntityForm } from "@/components/admin/generic-entity-form"

export const metadata: Metadata = {
  title: "Add New Brand – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function NewBrandPageWrapper() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <GenericEntityForm
      entityType="brand"
      entityName="Brand"
      apiUrl="/admin/api/brands"
      redirectUrl="/admin/brands"
      extraFields={[
        { name: "country", label: "Country" }
      ]}
    />
  )
}
