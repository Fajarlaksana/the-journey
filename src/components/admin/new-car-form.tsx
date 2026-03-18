"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { ArrowLeft, Upload, X, GripVertical } from "lucide-react"
import { Brand, Event, Category, Award } from "@prisma/client"
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

interface NewCarFormProps {
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

export function NewCarForm({ brands, events, categories, awards }: NewCarFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<{ url: string; order: number; file?: File }[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      featured: false,
      trending: false,
      carOfTheMonth: false,
    },
  })

  const name = watch("name")

  // Auto-generate slug from name
  useState(() => {
    const subscription = watch((value, { name }) => {
      if (name === "name" && value.name) {
        setValue("slug", slugify(value.name))
      }
    })
    return () => subscription.unsubscribe()
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
      // Upload images first
      const uploadedImages: { url: string; order: number; caption?: string }[] = []

      for (const image of images) {
        if (image.file) {
          const formData = new FormData()
          formData.append("file", image.file)
          formData.append("order", image.order.toString())

          const response = await fetch("/admin/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Image upload failed")
          }

          const result = await response.json()
          uploadedImages.push({ url: result.url, order: image.order })
        }
      }

      // Prepare data for API
      const apiData = {
        name: data.name,
        slug: data.slug,
        brandId: data.brandId,
        ownerName: data.ownerName,
        eventId: data.eventId,
        categoryId: data.categoryId,
        awardId: data.awardId || null,
        description: data.description,
        engine: data.engine || null,
        turbo: data.turbo || null,
        suspension: data.suspension || null,
        wheels: data.wheels || null,
        bodykit: data.bodykit || null,
        interior: data.interior || null,
        paint: data.paint || null,
        featured: data.featured || false,
        trending: data.trending || false,
        carOfTheMonth: data.carOfTheMonth || false,
        images: uploadedImages,
      }

      console.log("Submitting car data:", apiData)

      // Create car entry
      const carResponse = await fetch("/admin/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      })

      const carData = await carResponse.json()
      console.log("API Response:", carData)

      if (!carResponse.ok) {
        throw new Error(carData.error || "Failed to create car")
      }

      toast({
        title: "Success",
        description: "Car build has been created.",
      })

      router.push("/admin/cars")
    } catch (error: any) {
      console.error("Create car error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create car build.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <LinkToAdminCars />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-4">
            Add New Build
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">Create a new car build entry</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-6">
              Basic Information
            </h2>
            <div className="form-grid">
              <div>
                <Label htmlFor="name" className="text-foreground font-medium">Car Name *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Car name is required" })}
                  className="bg-background border-border text-foreground"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="slug" className="text-foreground font-medium">Slug *</Label>
                <Input
                  id="slug"
                  {...register("slug", { required: "Slug is required" })}
                  className="bg-background border-border text-foreground"
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
                )}
              </div>

              <div>
                <Label className="text-foreground font-medium mb-2 block">Brand *</Label>
                <Select onValueChange={(value) => setValue("brandId", value)} defaultValue="">
                  <SelectTrigger id="brandId" className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ownerName" className="text-foreground font-medium">Owner Name *</Label>
                <Input
                  id="ownerName"
                  {...register("ownerName", { required: "Owner name is required" })}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div>
                <Label className="text-foreground font-medium mb-2 block">Event *</Label>
                <Select onValueChange={(value) => setValue("eventId", value)} defaultValue="">
                  <SelectTrigger id="eventId" className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name} {event.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground font-medium mb-2 block">Category *</Label>
                <Select onValueChange={(value) => setValue("categoryId", value)} defaultValue="">
                  <SelectTrigger id="categoryId" className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground font-medium mb-2 block">Award (Optional)</Label>
                <Select onValueChange={(value) => setValue("awardId", value === "none" ? "" : value)} defaultValue="none">
                  <SelectTrigger id="awardId" className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select award" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
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
              <Label htmlFor="description" className="text-foreground font-medium">Description *</Label>
              <Textarea
                id="description"
                {...register("description", { required: "Description is required" })}
                rows={4}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="engine" className="text-foreground font-medium">Engine</Label>
                <Input
                  id="engine"
                  {...register("engine")}
                  className="bg-background border-border text-foreground"
                  placeholder="e.g., 2JZ-GTE"
                />
              </div>
              <div>
                <Label htmlFor="turbo" className="text-foreground font-medium">Turbo / Supercharger</Label>
                <Input
                  id="turbo"
                  {...register("turbo")}
                  className="bg-background border-border text-foreground"
                  placeholder="e.g., Garrett GTX3582R"
                />
              </div>
              <div>
                <Label htmlFor="suspension" className="text-foreground font-medium">Suspension</Label>
                <Input
                  id="suspension"
                  {...register("suspension")}
                  className="bg-background border-border text-foreground"
                  placeholder="e.g., BC Racing Coilovers"
                />
              </div>
              <div>
                <Label htmlFor="wheels" className="text-foreground font-medium">Wheels</Label>
                <Input
                  id="wheels"
                  {...register("wheels")}
                  className="bg-background border-border text-foreground"
                  placeholder="e.g., Work Meister S1 18x9.5"
                />
              </div>
              <div>
                <Label htmlFor="bodykit" className="text-foreground font-medium">Bodykit</Label>
                <Input
                  id="bodykit"
                  {...register("bodykit")}
                  className="bg-background border-border text-foreground"
                  placeholder="e.g., Liberty Walk"
                />
              </div>
              <div>
                <Label htmlFor="interior" className="text-foreground font-medium">Interior</Label>
                <Input
                  id="interior"
                  {...register("interior")}
                  className="bg-background border-border text-foreground"
                  placeholder="e.g., Recaro Seats"
                />
              </div>
              <div>
                <Label htmlFor="paint" className="text-foreground font-medium">Paint</Label>
                <Input
                  id="paint"
                  {...register("paint")}
                  className="bg-background border-border text-foreground"
                  placeholder="e.g., Lamborghini Orange"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              Images (Exactly 6)
            </h2>
            <p className="text-muted-foreground mb-6">
              Upload exactly 6 images for this car build. Drag to reorder.
            </p>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-brand-red bg-brand-red/10"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground mb-2">
                Drag and drop images here
              </p>
              <p className="text-muted-foreground text-sm mb-4">
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
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                    <img src={image.url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
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

            <p className={`text-sm mt-4 ${images.length === 6 ? "text-green-500" : "text-muted-foreground"}`}>
              {images.length} / 6 images uploaded
            </p>
          </div>

          {/* Options */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              Display Options
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="w-4 h-4 rounded bg-background border-border"
                />
                <span className="text-foreground">Featured Build</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("trending")}
                  className="w-4 h-4 rounded bg-background border-border"
                />
                <span className="text-foreground">Trending Build</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("carOfTheMonth")}
                  className="w-4 h-4 rounded bg-background border-border"
                />
                <span className="text-foreground">Car of the Month</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <Button type="submit" variant="brand" disabled={isSubmitting || images.length !== 6}>
              {isSubmitting ? "Creating..." : "Create Build"}
            </Button>
            <LinkToAdminCars />
          </div>
        </form>
      </div>
    </div>
  )
}

function LinkToAdminCars() {
  return (
    <Link href="/admin/cars" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
      <ArrowLeft className="w-4 h-4" />
      Back to Cars
    </Link>
  )
}
