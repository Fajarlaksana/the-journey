"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Trophy, Calendar, User, Star } from "lucide-react"
import { Car, Brand, Event, Category, CarImage, Award } from "@prisma/client"
import { useRef } from "react"

interface CarOfTheMonthProps {
  car: Car & {
    brand: Brand
    event: Event
    category: Category
    award?: Award | null
    images: CarImage[]
  }
}

export function CarOfTheMonth({ car }: CarOfTheMonthProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  if (!car) return null

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-black to-brand-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-red rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-brand-red to-red-700 text-white text-sm font-bold uppercase tracking-wider rounded-full mb-6 shadow-lg shadow-red-900/30"
          >
            <Trophy className="w-5 h-5" />
            <span>Car of the Month</span>
            <Star className="w-5 h-5 fill-current" />
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {car.name}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            This month&apos;s most outstanding build showcasing exceptional craftsmanship and creativity.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden group shadow-2xl shadow-black/50"
          >
            {car.images[0] && (
              <Image
                src={car.images[0].url}
                alt={car.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Overlay badges */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-brand-red text-white text-sm font-bold uppercase tracking-wider rounded-full">
                {car.category.name}
              </span>
              {car.award && (
                <span className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black text-sm font-bold uppercase tracking-wider rounded-full">
                  <Trophy className="w-4 h-4" />
                  {car.award.name}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-brand-red" />
                  <span className="text-gray-400 text-sm">Owner</span>
                </div>
                <p className="text-white font-semibold text-lg">{car.ownerName}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-brand-red" />
                  <span className="text-gray-400 text-sm">Event</span>
                </div>
                <p className="text-white font-semibold text-lg">{car.event.name} {car.event.year}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-4">About This Build</h3>
              <p className="text-gray-400 leading-relaxed line-clamp-4">
                {car.description}
              </p>
            </div>

            {/* Specifications Preview */}
            {(car.engine || car.wheels || car.suspension) && (
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-4">Key Specifications</h3>
                <div className="grid grid-cols-2 gap-3">
                  {car.engine && (
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                      <span className="text-gray-500 text-xs uppercase tracking-wider">Engine</span>
                      <p className="text-white font-medium mt-1">{car.engine}</p>
                    </div>
                  )}
                  {car.turbo && (
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                      <span className="text-gray-500 text-xs uppercase tracking-wider">Turbo</span>
                      <p className="text-white font-medium mt-1">{car.turbo}</p>
                    </div>
                  )}
                  {car.suspension && (
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                      <span className="text-gray-500 text-xs uppercase tracking-wider">Suspension</span>
                      <p className="text-white font-medium mt-1">{car.suspension}</p>
                    </div>
                  )}
                  {car.wheels && (
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                      <span className="text-gray-500 text-xs uppercase tracking-wider">Wheels</span>
                      <p className="text-white font-medium mt-1">{car.wheels}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Link
              href={`/builds/${car.slug}`}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-red text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-900/30 hover:shadow-red-900/50"
            >
              View Full Build Story
              <Trophy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
