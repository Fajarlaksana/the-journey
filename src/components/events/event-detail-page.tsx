"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, ArrowLeft } from "lucide-react"
import { Event, Car, Brand, Category, Award, CarImage } from "@prisma/client"
import { CarCard } from "@/components/cars/car-card"
import { Button } from "@/components/ui/button"

interface EventDetailPageProps {
  event: Event & {
    cars: (Car & {
      brand: Brand
      event: Event
      category: Category
      award?: Award | null
      images: CarImage[]
    })[]
  }
}

export function EventDetailPage({ event }: EventDetailPageProps) {
  return (
    <main className="min-h-screen bg-brand-dark">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-red to-brand-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-brand-dark/30" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center gap-1 px-3 py-1 bg-brand-red text-white text-sm font-medium rounded-full">
                <Calendar className="w-4 h-4" />
                {event.year}
              </span>
              {event.location && (
                <span className="flex items-center gap-1 px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </span>
              )}
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-2">
              {event.name}
            </h1>
            
            {event.description && (
              <p className="text-gray-300 text-lg max-w-3xl">
                {event.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="font-display text-3xl font-bold text-white">
              Featured Builds ({event.cars.length})
            </h2>
          </motion.div>

          {event.cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {event.cars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-lg">
                No builds featured for this event yet.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}
