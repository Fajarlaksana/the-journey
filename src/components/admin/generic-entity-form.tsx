"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface GenericFormProps {
  item?: any
  entityType: 'brand' | 'category' | 'award'
  entityName: string
  apiUrl: string
  redirectUrl: string
  extraFields?: {
    name: string
    label: string
    type?: string
  }[]
}

export function GenericEntityForm({ 
  item, 
  entityType, 
  entityName, 
  apiUrl,
  redirectUrl,
  extraFields = []
}: GenericFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState(item?.logoUrl || item?.imageUrl || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(item?.logoUrl || item?.imageUrl || "")

  const defaultValues: any = {
    name: item?.name || "",
    slug: item?.slug || "",
    description: item?.description || "",
  }

  extraFields.forEach(field => {
    defaultValues[field.name] = item?.[field.name] || ""
  })

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

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

      const url = item ? `${apiUrl}/${item.id}` : apiUrl
      const method = item ? "PUT" : "POST"

      const payload: any = {
        ...data,
        [entityType === 'brand' ? 'logoUrl' : 'imageUrl']: finalImageUrl,
      }

      // Add extra fields
      extraFields.forEach(field => {
        if (data[field.name]) {
          payload[field.name] = data[field.name]
        }
      })

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to save ${entityName.toLowerCase()}`)
      }

      toast({
        title: "Success",
        description: item ? `${entityName} has been updated.` : `${entityName} has been created.`,
      })

      router.push(redirectUrl)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to save ${entityName.toLowerCase()}.`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const imageLabel = entityType === 'brand' ? 'Logo' : 'Image'
  const imageField = entityType === 'brand' ? 'logoUrl' : 'imageUrl'

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href={redirectUrl} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to {entityName}s
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">
            {item ? `Edit ${entityName}` : `Add New ${entityName}`}
          </h1>
          <p className="text-gray-400">{item ? `Update ${entityName.toLowerCase()} information` : `Create a new ${entityName.toLowerCase()}`}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
          <div className="bg-brand-gray rounded-lg p-6">
            <h2 className="font-display text-xl font-bold text-white mb-6">{entityName} Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-300">{entityName} Name *</Label>
                <Input
                  {...register("name", { required: `${entityName} name is required` })}
                  className="bg-brand-dark border-brand-gray text-white"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{String(errors.name.message)}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Slug *</Label>
                <Input
                  {...register("slug", { required: "Slug is required" })}
                  className="bg-brand-dark border-brand-gray text-white"
                />
                {errors.slug && <p className="text-red-500 text-sm mt-1">{String(errors.slug.message)}</p>}
              </div>

              {extraFields.map(field => (
                <div key={field.name}>
                  <Label className="text-gray-300">{field.label}</Label>
                  <Input
                    type={field.type || "text"}
                    {...register(field.name)}
                    className="bg-brand-dark border-brand-gray text-white"
                  />
                </div>
              ))}
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
              <Label className="text-gray-300">{imageLabel}</Label>
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
                    id="entity-image"
                  />
                  <Label htmlFor="entity-image" className="cursor-pointer">
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
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" variant="brand" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (item ? `Update ${entityName}` : `Create ${entityName}`)}
            </Button>
            <Link href={redirectUrl} className="text-gray-400 hover:text-white transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
