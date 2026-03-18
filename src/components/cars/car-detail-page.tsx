"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useSwipeable } from "react-swipeable"
import {
  Trophy,
  Calendar,
  User,
  Gauge,
  Wind,
  Zap,
  CircleDot,
  Palette,
  Armchair,
  Wrench,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Share2,
  Heart,
} from "lucide-react"
import { Car, Brand, Event, Category, Award, CarImage } from "@prisma/client"
import { CarCard } from "@/components/cars/car-card"

interface CarDetailPageProps {
  car: Car & {
    brand: Brand
    event: Event
    category: Category
    award: Award | null
    images: CarImage[]
  }
  relatedCars: (Car & {
    brand: Brand
    event: Event
    category: Category
    images: CarImage[]
  })[]
}

export function CarDetailPage({ car, relatedCars }: CarDetailPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGalleryOpen) return
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "Escape") setIsGalleryOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isGalleryOpen])

  const nextImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev === car.images.length - 1 ? 0 : prev + 1))
  }, [car.images.length])

  const prevImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev === 0 ? car.images.length - 1 : prev - 1))
  }, [car.images.length])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
  })

  const specs = [
    { icon: Gauge, label: "Engine", value: car.engine },
    { icon: Wind, label: "Forced Induction", value: car.turbo },
    { icon: Zap, label: "Suspension", value: car.suspension },
    { icon: CircleDot, label: "Wheels", value: car.wheels },
    { icon: Wrench, label: "Bodykit", value: car.bodykit },
    { icon: Armchair, label: "Interior", value: car.interior },
    { icon: Palette, label: "Paint", value: car.paint },
  ].filter((s) => s.value)

  return (
    <main className="min-h-screen bg-brand-dark">
      {/* Cinematic Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={car.images[0]?.url || ""}
            alt={car.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
          <Link
            href="/builds"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Builds</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-full backdrop-blur-md transition-all ${
                isLiked ? "bg-brand-red text-white" : "bg-black/30 text-white hover:bg-black/50"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button className="p-3 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-brand-red text-white text-xs font-bold uppercase tracking-wider rounded-full">
                {car.category.name}
              </span>
              {car.award && (
                <span className="flex items-center gap-2 px-4 py-1.5 bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider rounded-full">
                  <Trophy className="w-4 h-4" />
                  {car.award.name}
                </span>
              )}
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/10">
                {car.brand.name}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 leading-tight">
              {car.name}
            </h1>
            <p className="text-gray-300 text-lg md:text-xl flex items-center gap-4">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {car.ownerName}
              </span>
              <span className="w-1 h-1 bg-gray-500 rounded-full" />
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {car.event.name} {car.event.year}
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Magazine-Style Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                  About This Build
                </h2>
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg md:text-xl first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left">
                    {car.description}
                  </p>
                </div>
              </motion.div>

              {/* Specifications */}
              {specs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-8">
                    Specifications
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {specs.map((spec, index) => (
                      <motion.div
                        key={spec.label}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="group flex items-start gap-4 bg-brand-gray/50 hover:bg-brand-gray rounded-xl p-5 transition-colors border border-white/5 hover:border-white/10"
                      >
                        <div className="p-2.5 bg-brand-red/10 rounded-lg group-hover:bg-brand-red/20 transition-colors">
                          <spec.icon className="w-5 h-5 text-brand-red" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">
                            {spec.label}
                          </p>
                          <p className="text-white font-medium">{spec.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar - Thumbnail Gallery - Right Column */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="sticky top-24"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-bold text-white">
                    Gallery
                  </h3>
                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Full Screen
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {car.images.map((image, index) => (
                    <motion.button
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedImageIndex(index)
                        setIsGalleryOpen(true)
                      }}
                      className={`relative aspect-video rounded-lg overflow-hidden group transition-all duration-300 ${
                        index === selectedImageIndex 
                          ? "ring-2 ring-brand-red ring-offset-2 ring-offset-brand-dark" 
                          : "hover:ring-2 hover:ring-white/30 hover:ring-offset-2 hover:ring-offset-brand-dark"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`${car.name} - Image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, 200px"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                        {index + 1}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Builds */}
      {relatedCars.length > 0 && (
        <section className="py-16 bg-black">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl md:text-4xl font-bold text-white mb-8"
            >
              Related Builds
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCars.map((relatedCar, index) => (
                <motion.div
                  key={relatedCar.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <CarCard car={relatedCar} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center"
            onClick={() => setIsGalleryOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-6 right-6 p-3 text-white/70 hover:text-white z-10 transition-colors hover:bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation - Desktop */}
            {car.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="hidden md:flex absolute left-6 p-3 text-white/70 hover:text-white z-10 transition-colors hover:bg-white/10 rounded-full"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="hidden md:flex absolute right-6 p-3 text-white/70 hover:text-white z-10 transition-colors hover:bg-white/10 rounded-full"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image with Swipe Support - Mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 md:p-8"
              onClick={(e) => e.stopPropagation()}
              {...swipeHandlers}
            >
              <Image
                src={car.images[selectedImageIndex]?.url || ""}
                alt={`${car.name} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                quality={95}
              />
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <div className="px-4 py-2 bg-black/50 backdrop-blur-md text-white text-sm font-medium rounded-full">
                {selectedImageIndex + 1} / {car.images.length}
              </div>
            </div>

            {/* Mobile Navigation Dots */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
              {car.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImageIndex(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedImageIndex 
                      ? "w-6 bg-brand-red" 
                      : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
