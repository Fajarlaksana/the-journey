import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { LoginPage } from "@/components/admin/login-page"

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/admin/dashboard")
  }

  return <LoginPage />
}
