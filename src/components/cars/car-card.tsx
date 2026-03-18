"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Trophy, Calendar, ArrowRight } from "lucide-react"
import { Car, Brand, Event, Category, CarImage, Award } from "@prisma/client"

interface CarCardProps {
  car: Car & {
    brand: Brand
    event: Event
    category: Category
    award?: Award | null
    images: CarImage[]
  }
  variant?: "default" | "compact" | "horizontal"
}

export function CarCard({ car, variant = "default" }: CarCardProps) {
  const isCompact = variant === "compact"
  const isHorizontal = variant === "horizontal"

  if (isHorizontal) {
    return (
      <Link href={`/builds/${car.slug}`} className="group block">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex gap-4 bg-brand-gray rounded-lg overflow-hidden shadow-lg"
        >
          <div className="relative w-48 aspect-video flex-shrink-0 bg-brand-dark overflow-hidden">
            {car.images[0] && (
              <Image
                src={car.images[0].url}
                alt={car.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="200px"
              />
            )}
          </div>
          <div className="flex-1 py-4 pr-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-brand-red text-white text-xs font-medium rounded-full">
                {car.category.name}
              </span>
              {car.award && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Trophy className="w-3 h-3" />
                  <span className="text-xs font-medium">{car.award.name}</span>
                </div>
              )}
            </div>
            <h3 className="font-display font-bold text-white text-lg group-hover:text-brand-red transition-colors">
              {car.name}
            </h3>
            <p className="text-gray-400 text-sm">{car.brand.name} • {car.event.name} {car.event.year}</p>
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link href={`/builds/${car.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`bg-brand-gray rounded-lg overflow-hidden shadow-xl ${isCompact ? '' : 'shadow-2xl'}`}
      >
        {/* Image Container */}
        <div className={`relative bg-brand-dark overflow-hidden ${isCompact ? 'aspect-[4/5]' : 'aspect-video'}`}>
          {car.images[0] && (
            <Image
              src={car.images[0].url}
              alt={car.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1.5 bg-brand-red text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
              {car.category.name}
            </span>
          </div>

          {/* Award Badge */}
          {car.award && (
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                <Trophy className="w-3.5 h-3.5" />
                {car.award.name}
              </div>
            </div>
          )}

          {/* Hover Arrow Indicator */}
          <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className={`p-5 ${isCompact ? 'py-4' : ''}`}>
          <h3 className={`font-display font-bold text-white mb-1.5 group-hover:text-brand-red transition-colors duration-300 ${isCompact ? 'text-lg' : 'text-xl'}`}>
            {car.name}
          </h3>
          <p className="text-gray-400 text-sm mb-3">{car.brand.name}</p>

          {!isCompact && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{car.event.name} {car.event.year}</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
