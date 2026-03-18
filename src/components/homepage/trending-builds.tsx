"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"
import { Car, Brand, Event, Category, CarImage } from "@prisma/client"
import { CarCard } from "@/components/cars/car-card"

interface TrendingBuildsProps {
  builds: (Car & {
    brand: Brand
    event: Event
    category: Category
    images: CarImage[]
  })[]
}

export function TrendingBuilds({ builds }: TrendingBuildsProps) {
  if (builds.length === 0) return null

  return (
    <section className="py-20 bg-brand-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-12"
        >
          <TrendingUp className="w-8 h-8 text-brand-red" />
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Trending Builds
            </h2>
            <p className="text-gray-400">
              The most viewed builds this week
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {builds.map((build, index) => (
            <motion.div
              key={build.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CarCard car={build} variant="compact" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
