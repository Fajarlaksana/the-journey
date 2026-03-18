"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  LayoutDashboard,
  Car,
  Calendar,
  Tag,
  Layers,
  Trophy,
  LogOut,
  Menu,
  X,
  Loader2,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Cars", href: "/admin/cars", icon: Car },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Brands", href: "/admin/brands", icon: Tag },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Awards", href: "/admin/awards", icon: Trophy },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Closed by default on mobile

  useEffect(() => {
    if (status === "loading") return
    if (!session && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
    if (session && pathname === "/admin/login") {
      router.push("/admin/dashboard")
    }
  }, [session, status, pathname, router])

  // Skip auth check for login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-red mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 bg-card border-b border-border">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-foreground">
            The<span className="text-brand-red">Journey</span>
          </span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-foreground hover:bg-muted rounded-lg"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile by default, always visible on desktop */}
      <aside
        className={`fixed md:sticky md:top-0 top-0 left-0 h-screen z-50 w-64 bg-card border-r border-border flex-shrink-0 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo - Desktop */}
          <div className="hidden md:flex h-16 items-center px-6 border-b border-border">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <span className="font-display text-xl font-bold text-foreground">
                The<span className="text-brand-red">Journey</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors touch-target ${
                    isActive
                      ? "bg-brand-red text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="hidden md:block">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom section with Theme Toggle and Logout */}
          <div className="p-4 border-t border-border space-y-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors touch-target"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Moon className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="hidden md:block">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors touch-target"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
