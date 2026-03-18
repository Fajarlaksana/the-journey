"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { Event } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface EventFormProps {
  event?: Event
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState(event?.imageUrl || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(event?.imageUrl || "")

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: event?.name || "",
      slug: event?.slug || "",
      description: event?.description || "",
      year: event?.year?.toString() || new Date().getFullYear().toString(),
      location: event?.location || "",
      startDate: event?.startDate?.toISOString().split('T')[0] || "",
      endDate: event?.endDate?.toISOString().split('T')[0] || "",
      featured: event?.featured || false,
    },
  })

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleUploadImage = async () => {
    if (!imageFile) return null
    
    const formData = new FormData()
    formData.append("file", imageFile)
    formData.append("order", "0")

    const response = await fetch("/admin/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) return null

    const result = await response.json()
    return result.url
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      let finalImageUrl = imageUrl

      if (imageFile) {
        const uploadedUrl = await handleUploadImage()
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl
        }
      }

      const url = event ? `/admin/api/events/${event.id}` : "/admin/api/events"
      const method = event ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          year: parseInt(data.year),
          imageUrl: finalImageUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save event")
      }

      toast({
        title: "Success",
        description: event ? "Event has been updated." : "Event has been created.",
      })

      router.push("/admin/events")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save event.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">
            {event ? "Edit Event" : "Add New Event"}
          </h1>
          <p className="text-gray-400">{event ? "Update event information" : "Create a new automotive event"}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
          <div className="bg-brand-gray rounded-lg p-6">
            <h2 className="font-display text-xl font-bold text-white mb-6">Event Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-300">Event Name *</Label>
                <Input
                  {...register("name", { required: "Event name is required" })}
                  className="bg-brand-dark border-brand-gray text-white"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Slug *</Label>
                <Input
                  {...register("slug", { required: "Slug is required" })}
                  className="bg-brand-dark border-brand-gray text-white"
                />
                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Year *</Label>
                <Input
                  type="number"
                  {...register("year", { required: "Year is required" })}
                  className="bg-brand-dark border-brand-gray text-white"
                />
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Location</Label>
                <Input
                  {...register("location")}
                  className="bg-brand-dark border-brand-gray text-white"
                  placeholder="e.g., Tokyo, Japan"
                />
              </div>

              <div>
                <Label className="text-gray-300">Start Date</Label>
                <Input
                  type="date"
                  {...register("startDate")}
                  className="bg-brand-dark border-brand-gray text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">End Date</Label>
                <Input
                  type="date"
                  {...register("endDate")}
                  className="bg-brand-dark border-brand-gray text-white"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label className="text-gray-300">Description</Label>
              <Textarea
                {...register("description")}
                rows={4}
                className="bg-brand-dark border-brand-gray text-white"
              />
            </div>

            <div className="mt-6">
              <Label className="text-gray-300">Event Image</Label>
              <div className="mt-2 flex items-center gap-4">
                {imagePreview && (
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="event-image"
                  />
                  <Label htmlFor="event-image" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        {imagePreview ? "Change Image" : "Upload Image"}
                      </span>
                    </Button>
                  </Label>
                </div>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImagePreview("")
                      setImageFile(null)
                      setImageUrl("")
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="w-4 h-4 rounded bg-brand-dark border-brand-gray"
                />
                <span className="text-gray-300">Featured Event</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" variant="brand" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (event ? "Update Event" : "Create Event")}
            </Button>
            <Link href="/admin/events" className="text-gray-400 hover:text-white transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
