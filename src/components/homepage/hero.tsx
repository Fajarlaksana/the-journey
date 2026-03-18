"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { useRef } from "react"

interface HomepageHeroProps {
  featuredCar: {
    id: string
    name: string
    slug: string
    description: string
    brand: { name: string; slug: string }
    event: { name: string; year: number }
    category: { name: string; slug: string }
    images: { url: string }[]
  } | null
}

export function HomepageHero({ featuredCar }: HomepageHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  if (!featuredCar) return null

  return (
    <section ref={containerRef} className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div 
        className="absolute inset-0"
        style={{ y }}
      >
        {featuredCar.images[0] && (
          <Image
            src={featuredCar.images[0].url}
            alt={featuredCar.name}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={90}
          />
        )}
        {/* Enhanced gradient overlays for navbar readability */}
        {/* Top gradient - strong dark overlay for navbar visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent" />
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent" />
        {/* Side gradients for cinematic effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          {/* Category & Brand badges */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <span className="px-4 py-1.5 bg-brand-red text-white text-xs font-bold uppercase tracking-wider rounded-full">
              {featuredCar.category.name}
            </span>
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/10">
              {featuredCar.brand.name}
            </span>
            <span className="px-4 py-1.5 bg-white/5 backdrop-blur-md text-gray-300 text-xs font-medium rounded-full border border-white/10">
              {featuredCar.event.name} {featuredCar.event.year}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-6 tracking-tight leading-none"
          >
            {featuredCar.name}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-10 max-w-3xl leading-relaxed"
          >
            {featuredCar.description.length > 250
              ? `${featuredCar.description.substring(0, 250)}...`
              : featuredCar.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href={`/builds/${featuredCar.slug}`}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-red text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-900/30 hover:shadow-red-900/50 hover:scale-105"
            >
              Explore Build
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/builds"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/10"
            >
              View All Builds
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator with fade on scroll */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-400 uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
