"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Plus, Pencil, Trash2, Car } from "lucide-react"
import { Brand } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface AdminBrandsPageProps {
  brands: (Brand & {
    _count: { cars: number }
  })[]
}

export function AdminBrandsPage({ brands }: AdminBrandsPageProps) {
  const { toast } = useToast()
  const [brandsList, setBrandsList] = useState(brands)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBrands = brandsList.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (brandId: string, brandName: string) => {
    if (!confirm(`Are you sure you want to delete "${brandName}"?`)) return

    try {
      const response = await fetch(`/admin/api/brands/${brandId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setBrandsList((prev) => prev.filter((brand) => brand.id !== brandId))
        toast({
          title: "Brand deleted",
          description: `"${brandName}" has been deleted.`,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete brand.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Manage Brands
            </h1>
            <p className="text-gray-400">
              {brandsList.length} brands in the database
            </p>
          </div>
          <Link href="/admin/brands/new">
            <Button variant="brand">
              <Plus className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 bg-brand-gray border-brand-gray text-white"
            />
          </div>
        </div>

        <div className="bg-brand-gray rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-black">
              <tr>
                <th className="text-left text-gray-400 font-medium py-4 px-6">Brand</th>
                <th className="text-left text-gray-400 font-medium py-4 px-6">Slug</th>
                <th className="text-left text-gray-400 font-medium py-4 px-6">Country</th>
                <th className="text-left text-gray-400 font-medium py-4 px-6">Builds</th>
                <th className="text-right text-gray-400 font-medium py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((brand, index) => (
                <motion.tr
                  key={brand.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-t border-brand-gray"
                >
                  <td className="py-4 px-6">
                    <span className="text-white font-medium">{brand.name}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{brand.slug}</td>
                  <td className="py-4 px-6 text-gray-400">{brand.country || "-"}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Car className="w-4 h-4" />
                      {brand._count.cars}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/brands/${brand.id}/edit`}>
                        <Button variant="ghost" size="sm" className="flex-1">
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(brand.id, brand.name)}
                        className="text-red-500 hover:text-red-400"
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
