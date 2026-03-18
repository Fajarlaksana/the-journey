import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { GenericEntityForm } from "@/components/admin/generic-entity-form"

export const metadata: Metadata = {
  title: "Add New Award – Admin",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function NewAwardPageWrapper() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <GenericEntityForm
      entityType="award"
      entityName="Award"
      apiUrl="/admin/api/awards"
      redirectUrl="/admin/awards"
    />
  )
}
