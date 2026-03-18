"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Car, Brand, Event, Category, CarImage } from "@prisma/client"
import { CarCard } from "@/components/cars/car-card"
import { useRef } from "react"

interface FeaturedBuildsProps {
  builds: (Car & {
    brand: Brand
    event: Event
    category: Category
    images: CarImage[]
  })[]
}

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function FeaturedBuilds({ builds }: FeaturedBuildsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  if (builds.length === 0) return null

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-brand-dark to-black">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6"
        >
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 bg-brand-red/10 text-brand-red text-sm font-bold uppercase tracking-wider rounded-full mb-4 border border-brand-red/20"
            >
              Handpicked Selection
            </motion.span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Featured Builds
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Discover the most exceptional modified cars from automotive events around the world.
            </p>
          </div>
          <Link
            href="/builds"
            className="group inline-flex items-center gap-3 text-white hover:text-brand-red transition-colors font-medium text-lg"
          >
            View All Builds
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {builds.map((build) => (
            <motion.div key={build.id} variants={itemVariants}>
              <CarCard car={build} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
