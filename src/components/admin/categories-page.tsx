"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Plus, Pencil, Trash2, Car } from "lucide-react"
import { Category } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface AdminCategoriesPageProps {
  categories: (Category & {
    _count: { cars: number }
  })[]
}

export function AdminCategoriesPage({ categories }: AdminCategoriesPageProps) {
  const { toast } = useToast()
  const [categoriesList, setCategoriesList] = useState(categories)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = categoriesList.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) return

    try {
      const response = await fetch(`/admin/api/categories/${categoryId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCategoriesList((prev) => prev.filter((cat) => cat.id !== categoryId))
        toast({
          title: "Category deleted",
          description: `"${categoryName}" has been deleted.`,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Manage Categories
            </h1>
            <p className="text-gray-400">
              {categoriesList.length} categories in the database
            </p>
          </div>
          <Link href="/admin/categories/new">
            <Button variant="brand">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="Search categories..."
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
                <th className="text-left text-gray-400 font-medium py-4 px-6">Category</th>
                <th className="text-left text-gray-400 font-medium py-4 px-6">Slug</th>
                <th className="text-left text-gray-400 font-medium py-4 px-6">Description</th>
                <th className="text-left text-gray-400 font-medium py-4 px-6">Builds</th>
                <th className="text-right text-gray-400 font-medium py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category, index) => (
                <motion.tr
                  key={category.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-t border-brand-gray"
                >
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-brand-red/20 text-brand-red text-sm font-medium rounded-full">
                      {category.name}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{category.slug}</td>
                  <td className="py-4 px-6 text-gray-400 max-w-md truncate">
                    {category.description || "-"}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Car className="w-4 h-4" />
                      {category._count.cars}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Button variant="ghost" size="sm" className="flex-1">
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id, category.name)}
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
