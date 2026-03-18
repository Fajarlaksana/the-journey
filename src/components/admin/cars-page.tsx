"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { Car, Brand, Event, Category, CarImage } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface AdminCarsPageProps {
  cars: (Car & {
    brand: Brand
    event: Event
    category: Category
    images: CarImage[]
  })[]
}

export function AdminCarsPage({ cars }: AdminCarsPageProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [carsList, setCarsList] = useState(cars)

  const filteredCars = carsList.filter(
    (car) =>
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleTogglePublished = async (carId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/admin/api/cars/${carId}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        setCarsList((prev) =>
          prev.map((car) =>
            car.id === carId ? { ...car, published: !currentStatus } : car
          )
        )
        toast({
          title: currentStatus ? "Car unpublished" : "Car published",
          description: `The car has been ${currentStatus ? "unpublished" : "published"}.`,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update car status.",
      })
    }
  }

  const handleDelete = async (carId: string, carName: string) => {
    if (!confirm(`Are you sure you want to delete "${carName}"?`)) return

    try {
      const response = await fetch(`/admin/api/cars/${carId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCarsList((prev) => prev.filter((car) => car.id !== carId))
        toast({
          title: "Car deleted",
          description: `"${carName}" has been deleted.`,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete car.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Manage Cars
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {carsList.length} builds in the database
            </p>
          </div>
          <Link href="/admin/cars/new">
            <Button variant="brand" className="w-full sm:w-auto touch-target">
              <Plus className="w-4 h-4 mr-2" />
              Add New Build
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border text-foreground h-11"
            />
          </div>
        </div>

        {/* Cars Table with Horizontal Scroll */}
        <div className="table-wrapper bg-card border border-border rounded-lg">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="text-left text-foreground font-semibold py-3 px-4">Build</th>
                <th className="text-left text-foreground font-semibold py-3 px-4">Owner</th>
                <th className="text-left text-foreground font-semibold py-3 px-4">Category</th>
                <th className="text-left text-foreground font-semibold py-3 px-4">Event</th>
                <th className="text-left text-foreground font-semibold py-3 px-4">Status</th>
                <th className="text-right text-foreground font-semibold py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car, index) => (
                <motion.tr
                  key={car.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {car.images[0] && (
                        <div className="w-16 h-10 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={car.images[0].url}
                            alt={car.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-foreground font-medium text-sm sm:text-base">{car.name}</p>
                        <p className="text-muted-foreground text-xs sm:text-sm">{car.brand.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-sm sm:text-base">{car.ownerName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-brand-red/20 text-brand-red text-xs font-medium rounded-full whitespace-nowrap">
                      {car.category.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-sm sm:text-base whitespace-nowrap">
                    {car.event.name} {car.event.year}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleTogglePublished(car.id, car.published)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium touch-target ${
                        car.published
                          ? "bg-green-500/20 text-green-500"
                          : "bg-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {car.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/builds/${car.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground touch-target">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/cars/${car.id}/edit`}>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-blue-500 touch-target">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-red-500 touch-target"
                        onClick={() => handleDelete(car.id, car.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
