"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "@/components/theme-provider"

export function Navbar() {
  const { theme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Trigger at lower scroll position for better readability
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/builds", label: "Builds" },
    { href: "/events", label: "Events" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? theme === "dark"
            ? "bg-[rgba(0,0,0,0.85)] backdrop-blur-xl shadow-lg border-b border-white/10"
            : "bg-[rgba(255,255,255,0.9)] backdrop-blur-xl shadow-lg border-b border-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-3xl font-bold tracking-tight drop-shadow-lg"
            >
              <span className={theme === "dark" || isScrolled ? "text-white" : "text-white"}>
                The
              </span>
              <span className="text-brand-red group-hover:text-red-500 transition-colors duration-300 drop-shadow-lg">Journey</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className={`relative px-5 py-2 text-sm font-medium transition-colors duration-300 group drop-shadow-lg ${
                    isScrolled
                      ? theme === "dark"
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-800 hover:text-black"
                      : "text-white hover:text-white"
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-brand-red group-hover:w-full group-hover:left-0 transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`flex items-center gap-2 text-xs uppercase tracking-widest drop-shadow-lg ${
                isScrolled
                  ? theme === "dark"
                    ? "text-gray-500"
                    : "text-gray-600"
                  : "text-gray-300"
              }`}
            >
              <span>Automotive Media</span>
              <ChevronRight className="w-3 h-3" />
            </motion.div>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors drop-shadow-lg ${
              isScrolled
                ? theme === "dark"
                  ? "text-white hover:bg-white/10"
                  : "text-black hover:bg-black/5"
                : "text-white hover:bg-white/10"
            }`}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`md:hidden backdrop-blur-xl border-t overflow-hidden ${
              theme === "dark"
                ? "bg-[rgba(0,0,0,0.95)] border-white/10"
                : "bg-[rgba(255,255,255,0.95)] border-black/5"
            }`}
          >
            <nav className="container mx-auto px-6 py-8 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-4 text-lg font-medium px-4 rounded-lg transition-all duration-300 ${
                      theme === "dark"
                        ? "text-gray-300 hover:text-white hover:bg-white/5"
                        : "text-gray-800 hover:text-black hover:bg-black/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 border-t border-border">
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
