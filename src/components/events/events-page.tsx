"use client"

import { motion } from "framer-motion"
import { Event, Car, Brand, CarImage } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"

interface EventsPageProps {
  events: (Event & {
    cars: (Car & {
      brand: Brand
      images: CarImage[]
    })[]
  })[]
}

export function EventsPage({ events }: EventsPageProps) {
  const years = Array.from(new Set(events.map((e) => e.year))).sort((a, b) => b - a)

  return (
    <main className="min-h-screen bg-brand-dark">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-black to-brand-dark">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
              Event Timeline
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Journey through years of automotive excellence. Explore modified cars from each event.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-brand-red/30" />

            {years.map((year, yearIndex) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: yearIndex * 0.1 }}
                className="relative mb-16 last:mb-0"
              >
                {/* Year Marker */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative z-10 w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <h2 className="font-display text-4xl font-bold text-white">
                    {year}
                  </h2>
                </div>

                {/* Events Grid */}
                <div className="space-y-12">
                  {events
                    .filter((e) => e.year === year)
                    .map((event, eventIndex) => (
                      <div
                        key={event.id}
                        className={`ml-12 ${
                          eventIndex % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                        }`}
                      >
                        <Link href={`/events/${event.slug}`} className="group block">
                          <div className="bg-brand-gray rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                            {event.imageUrl && (
                              <div className="relative aspect-video">
                                <Image
                                  src={event.imageUrl}
                                  alt={event.name}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                              </div>
                            )}
                            <div className="p-6">
                              <div className="flex items-center gap-2 text-brand-red text-sm mb-2">
                                <Calendar className="w-4 h-4" />
                                <span>{event.year}</span>
                              </div>
                              <h3 className="font-display text-2xl font-bold text-white mb-2 group-hover:text-brand-red transition-colors">
                                {event.name}
                              </h3>
                              {event.location && (
                                <p className="text-gray-400 text-sm mb-4">
                                  {event.location}
                                </p>
                              )}
                              {event.cars.length > 0 && (
                                <div className="flex items-center justify-between">
                                  <p className="text-gray-500 text-sm">
                                    {event.cars.length} featured builds
                                  </p>
                                  <span className="flex items-center gap-1 text-brand-red text-sm font-medium">
                                    View Event
                                    <ArrowRight className="w-4 h-4" />
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
