"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Car as CarIcon, Calendar, Tag, Layers, Plus, ArrowRight } from "lucide-react"
import { Car, Brand, Event, CarImage } from "@prisma/client"

interface AdminDashboardPageProps {
  stats: {
    cars: number
    events: number
    brands: number
    categories: number
  }
  recentCars: (Car & {
    brand: Brand
    event: Event
    images: CarImage[]
  })[]
}

export function AdminDashboardPage({ stats, recentCars }: AdminDashboardPageProps) {
  const statCards = [
    { label: "Total Builds", value: stats.cars, icon: CarIcon, href: "/admin/cars", color: "text-blue-500" },
    { label: "Events", value: stats.events, icon: Calendar, href: "/admin/events", color: "text-green-500" },
    { label: "Brands", value: stats.brands, icon: Tag, href: "/admin/brands", color: "text-purple-500" },
    { label: "Categories", value: stats.categories, icon: Layers, href: "/admin/categories", color: "text-orange-500" },
  ]

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome to TheJourney Admin Panel
            </p>
          </div>
          <Link href="/admin/cars/new">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red text-white font-medium rounded-md hover:bg-red-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add New Build
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={stat.href} className="block">
                <div className="bg-brand-gray rounded-lg p-6 hover:bg-brand-gray/80 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <ArrowRight className="w-5 h-5 text-gray-500" />
                  </div>
                  <p className="text-3xl font-display font-bold text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Builds */}
        <div className="bg-brand-gray rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-white">
              Recent Builds
            </h2>
            <Link
              href="/admin/cars"
              className="text-brand-red hover:text-red-400 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-gray">
                  <th className="text-left text-gray-400 font-medium pb-4">Build</th>
                  <th className="text-left text-gray-400 font-medium pb-4">Brand</th>
                  <th className="text-left text-gray-400 font-medium pb-4">Event</th>
                  <th className="text-left text-gray-400 font-medium pb-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCars.map((car) => (
                  <tr key={car.id} className="border-b border-brand-gray last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {car.images[0] && (
                          <div className="w-12 h-8 rounded overflow-hidden">
                            <img
                              src={car.images[0].url}
                              alt={car.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <span className="text-white font-medium">{car.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-400">{car.brand.name}</td>
                    <td className="py-4 text-gray-400">
                      {car.event.name} {car.event.year}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          car.published
                            ? "bg-green-500/20 text-green-500"
                            : "bg-gray-500/20 text-gray-500"
                        }`}
                      >
                        {car.published ? "Published" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
