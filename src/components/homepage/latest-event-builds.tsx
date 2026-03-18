"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar } from "lucide-react"
import { Event, Car, Brand, CarImage } from "@prisma/client"

interface LatestEventBuildsProps {
  events: (Event & {
    cars: (Car & {
      brand: Brand
      images: CarImage[]
    })[]
  })[]
}

export function LatestEventBuilds({ events }: LatestEventBuildsProps) {
  if (events.length === 0) return null

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Latest Event Builds
            </h2>
            <p className="text-gray-400 max-w-xl">
              Explore modified cars from the most recent automotive events.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden md:inline-flex items-center gap-2 text-brand-red hover:text-red-400 transition-colors font-medium"
          >
            View All Events
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <div className="space-y-16">
          {events.map((event, eventIndex) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: eventIndex * 0.1 }}
            >
              {/* Event Header */}
              <div className="flex items-center gap-4 mb-6">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
                  {event.name}
                </h3>
                <span className="flex items-center gap-1 px-3 py-1 bg-brand-red/20 text-brand-red text-sm font-medium rounded-full">
                  <Calendar className="w-4 h-4" />
                  {event.year}
                </span>
              </div>

              {/* Event Cars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {event.cars.map((car, carIndex) => (
                  <Link
                    key={car.id}
                    href={`/builds/${car.slug}`}
                    className="group relative aspect-[3/4] rounded-lg overflow-hidden"
                  >
                    {car.images[0] && (
                      <Image
                        src={car.images[0].url}
                        alt={car.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-display font-bold text-lg mb-1 line-clamp-1">
                        {car.name}
                      </p>
                      <p className="text-gray-400 text-sm line-clamp-1">
                        {car.brand.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {event.cars.length > 0 && (
                <div className="mt-6">
                  <Link
                    href={`/events/${event.slug}`}
                    className="inline-flex items-center gap-2 text-brand-red hover:text-red-400 transition-colors font-medium"
                  >
                    View All Cars from {event.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center md:hidden"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-brand-red hover:text-red-400 transition-colors font-medium"
          >
            View All Events
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
