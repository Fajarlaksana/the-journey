"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Filter, X } from "lucide-react"
import { Car, Brand, Category, Event, CarImage, Award } from "@prisma/client"
import { CarCard } from "@/components/cars/car-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BuildsPageProps {
  cars: (Car & {
    brand: Brand
    event: Event
    category: Category
    award: Award | null
    images: CarImage[]
  })[]
  brands: Brand[]
  categories: Category[]
  events: Event[]
}

export function BuildsPage({ cars, brands, categories, events }: BuildsPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch =
        searchQuery === "" ||
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.ownerName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesBrand = selectedBrand === "all" || car.brandId === selectedBrand
      const matchesCategory = selectedCategory === "all" || car.categoryId === selectedCategory
      const matchesEvent = selectedEvent === "all" || car.eventId === selectedEvent

      return matchesSearch && matchesBrand && matchesCategory && matchesEvent
    })
  }, [cars, searchQuery, selectedBrand, selectedCategory, selectedEvent])

  const activeFiltersCount = [selectedBrand, selectedCategory, selectedEvent].filter(
    (f) => f !== "all"
  ).length

  const clearFilters = () => {
    setSelectedBrand("all")
    setSelectedCategory("all")
    setSelectedEvent("all")
    setSearchQuery("")
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4">
              Car Builds
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our collection of modified cars from automotive events around the world.
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, brand, or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters ({activeFiltersCount})
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-border text-foreground hover:bg-muted"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-6 bg-card border border-border rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-brand-dark border-brand-gray text-white">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-dark border-brand-gray">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Event</label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger className="bg-brand-dark border-brand-gray text-white">
                    <SelectValue placeholder="All Events" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-dark border-brand-gray">
                    <SelectItem value="all">All Events</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name} {event.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-400">
              Showing <span className="text-white font-medium">{filteredCars.length}</span> builds
            </p>
          </div>

          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car, index) => (
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
              <p className="text-gray-400 text-lg mb-4">No builds found</p>
              <Button variant="brand" onClick={clearFilters}>
                Clear all filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}
