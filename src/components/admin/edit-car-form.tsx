"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { ArrowLeft, Upload, X, GripVertical, Trash2 } from "lucide-react"
import Link from "next/link"
import { Car, Brand, Event, Category, Award, CarImage } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { slugify } from "@/lib/utils"

interface EditCarFormProps {
  car: Car & {
    brand: Brand
    event: Event
    category: Category
    award: Award | null
    images: CarImage[]
  }
  brands: Brand[]
  events: Event[]
  categories: Category[]
  awards: Award[]
}

interface FormData {
  name: string
  slug: string
  brandId: string
  ownerName: string
  eventId: string
  categoryId: string
  awardId: string
  description: string
  engine: string
  turbo: string
  suspension: string
  wheels: string
  bodykit: string
  interior: string
  paint: string
  featured: boolean
  trending: boolean
  carOfTheMonth: boolean
}

export function EditCarForm({ car, brands, events, categories, awards }: EditCarFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<{ url: string; order: number; file?: File; id?: string }[]>(
    car.images.map((img) => ({ url: img.url, order: img.order, id: img.id }))
  )
  const [isDragging, setIsDragging] = useState(false)
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: car.name,
      slug: car.slug,
      brandId: car.brandId,
      ownerName: car.ownerName,
      eventId: car.eventId,
      categoryId: car.categoryId,
      awardId: car.awardId || "",
      description: car.description,
      engine: car.engine || "",
      turbo: car.turbo || "",
      suspension: car.suspension || "",
      wheels: car.wheels || "",
      bodykit: car.bodykit || "",
      interior: car.interior || "",
      paint: car.paint || "",
      featured: car.featured,
      trending: car.trending,
      carOfTheMonth: car.carOfTheMonth,
    },
  })

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    )
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    const remainingSlots = 6 - images.length
    const filesToAdd = files.slice(0, remainingSlots)

    filesToAdd.forEach((file, index) => {
      const url = URL.createObjectURL(file)
      setImages((prev) => [
        ...prev,
        { url, order: prev.length, file },
      ])
    })

    if (files.length > remainingSlots) {
      toast({
        variant: "destructive",
        title: "Too many images",
        description: "You can only upload exactly 6 images per car.",
      })
    }
  }

  const removeImage = (index: number) => {
    const image = images[index]
    if (image.id) {
      setDeletedImageIds((prev) => [...prev, image.id!])
    }
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      const [removed] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, removed)
      return newImages.map((img, i) => ({ ...img, order: i }))
    })
  }

  const onSubmit = async (data: FormData) => {
    if (images.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid images",
        description: "Please upload exactly 6 images.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Upload new images
      const uploadedImages: { url: string; order: number }[] = []
      const existingImages: { id: string; url: string; order: number }[] = []

      for (const image of images) {
        if (image.file) {
          const formData = new FormData()
          formData.append("file", image.file)
          formData.append("order", image.order.toString())

          const response = await fetch("/admin/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) throw new Error("Image upload failed")

          const result = await response.json()
          uploadedImages.push({ url: result.url, order: image.order })
        } else if (image.id) {
          // Keep existing image but update order
          existingImages.push({ id: image.id, url: image.url, order: image.order })
        }
      }

      // Update car entry
      const response = await fetch(`/admin/api/cars/${car.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images: [...uploadedImages, ...existingImages],
          deletedImageIds,
        }),
      })

      if (!response.ok) throw new Error("Failed to update car")

      toast({
        title: "Success",
        description: "Car build has been updated.",
      })

      router.push("/admin/cars")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update car build.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/cars" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Cars
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">
            Edit Build
          </h1>
          <p className="text-gray-400">Update car build information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-brand-gray rounded-lg p-6">
            <h2 className="font-display text-xl font-bold text-white mb-6">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-gray-300">Car Name *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Car name is required" })}
                  className="bg-brand-dark border-brand-gray text-white"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="slug" className="text-gray-300">Slug *</Label>
                <Input
                  id="slug"
                  {...register("slug", { required: "Slug is required" })}
                  className="bg-brand-dark border-brand-gray text-white"
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">Brand *</Label>
                <Select value={watch("brandId")} onValueChange={(value) => setValue("brandId", value)}>
                  <SelectTrigger id="brandId" className="bg-brand-dark border-brand-gray text-white">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-dark border-brand-gray">
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ownerName" className="text-gray-300">Owner Name *</Label>
                <Input
                  id="ownerName"
                  {...register("ownerName", { required: "Owner name is required" })}
                  className="bg-brand-dark border-brand-gray text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">Event *</Label>
                <Select value={watch("eventId")} onValueChange={(value) => setValue("eventId", value)}>
                  <SelectTrigger id="eventId" className="bg-brand-dark border-brand-gray text-white">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-dark border-brand-gray">
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name} {event.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">Category *</Label>
                <Select value={watch("categoryId")} onValueChange={(value) => setValue("categoryId", value)}>
                  <SelectTrigger id="categoryId" className="bg-brand-dark border-brand-gray text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-dark border-brand-gray">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">Award (Optional)</Label>
                <Select value={watch("awardId") || "none"} onValueChange={(value) => setValue("awardId", value === "none" ? "" : value)}>
                  <SelectTrigger id="awardId" className="bg-brand-dark border-brand-gray text-white">
                    <SelectValue placeholder="Select award" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-dark border-brand-gray">
                    <SelectItem value="none">No Award</SelectItem>
                    {awards.map((award) => (
                      <SelectItem key={award.id} value={award.id}>
                        {award.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="description" className="text-gray-300">Description *</Label>
              <Textarea
                id="description"
                {...register("description", { required: "Description is required" })}
                rows={4}
                className="bg-brand-dark border-brand-gray text-white"
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-brand-gray rounded-lg p-6">
            <h2 className="font-display text-xl font-bold text-white mb-6">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="engine" className="text-gray-300">Engine</Label>
                <Input
                  id="engine"
                  {...register("engine")}
                  className="bg-brand-dark border-brand-gray text-white"
                  placeholder="e.g., 2JZ-GTE"
                />
              </div>
              <div>
                <Label htmlFor="turbo" className="text-gray-300">Turbo / Supercharger</Label>
                <Input
                  id="turbo"
                  {...register("turbo")}
                  className="bg-brand-dark border-brand-gray text-white"
                  placeholder="e.g., Garrett GTX3582R"
                />
              </div>
              <div>
                <Label htmlFor="suspension" className="text-gray-300">Suspension</Label>
                <Input
                  id="suspension"
                  {...register("suspension")}
                  className="bg-brand-dark border-brand-gray text-white"
                  placeholder="e.g., BC Racing Coilovers"
                />
              </div>
              <div>
                <Label htmlFor="wheels" className="text-gray-300">Wheels</Label>
                <Input
                  id="wheels"
                  {...register("wheels")}
                  className="bg-brand-dark border-brand-gray text-white"
                  placeholder="e.g., Work Meister S1 18x9.5"
                />
              </div>
              <div>
                <Label htmlFor="bodykit" className="text-gray-300">Bodykit</Label>
                <Input
                  id="bodykit"
                  {...register("bodykit")}
                  className="bg-brand-dark border-brand-gray text-white"
                  placeholder="e.g., Liberty Walk"
                />
              </div>
              <div>
                <Label htmlFor="interior" className="text-gray-300">Interior</Label>
                <Input
                  id="interior"
                  {...register("interior")}
                  className="bg-brand-dark border-brand-gray text-white"
                  placeholder="e.g., Recaro Seats"
                />
              </div>
              <div>
                <Label htmlFor="paint" className="text-gray-300">Paint</Label>
                <Input
                  id="paint"
                  {...register("paint")}
                  className="bg-brand-dark border-brand-gray text-white"
                  placeholder="e.g., Lamborghini Orange"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-brand-gray rounded-lg p-6">
            <h2 className="font-display text-xl font-bold text-white mb-2">
              Images (Exactly 6)
            </h2>
            <p className="text-gray-400 mb-6">
              Upload exactly 6 images for this car build. Drag to reorder.
            </p>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-brand-red bg-brand-red/10"
                  : "border-brand-gray hover:border-gray-500"
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">
                Drag and drop images here
              </p>
              <p className="text-gray-500 text-sm mb-4">
                or click to select files
              </p>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <Button type="button" variant="outline" asChild>
                <label htmlFor="image-upload" className="cursor-pointer">
                  Select Images
                </label>
              </Button>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {images.map((image, index) => (
                  <div key={image.id || index} className="relative aspect-video rounded-lg overflow-hidden group">
                    <img src={image.url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 rounded text-white opacity-0 group-hover:opacity-100"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className={`text-sm mt-4 ${images.length === 6 ? "text-green-500" : "text-gray-400"}`}>
              {images.length} / 6 images uploaded
            </p>
          </div>

          {/* Options */}
          <div className="bg-brand-gray rounded-lg p-6">
            <h2 className="font-display text-xl font-bold text-white mb-6">
              Display Options
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="w-4 h-4 rounded bg-brand-dark border-brand-gray"
                />
                <span className="text-gray-300">Featured Build</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("trending")}
                  className="w-4 h-4 rounded bg-brand-dark border-brand-gray"
                />
                <span className="text-gray-300">Trending Build</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("carOfTheMonth")}
                  className="w-4 h-4 rounded bg-brand-dark border-brand-gray"
                />
                <span className="text-gray-300">Car of the Month</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <Button type="submit" variant="brand" disabled={isSubmitting || images.length !== 6}>
              {isSubmitting ? "Updating..." : "Update Build"}
            </Button>
            <Link href="/admin/cars" className="text-gray-400 hover:text-white transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
