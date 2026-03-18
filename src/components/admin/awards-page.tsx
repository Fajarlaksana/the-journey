"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Plus, Pencil, Trash2, Trophy } from "lucide-react"
import { Award } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface AdminAwardsPageProps {
  awards: (Award & {
    _count: { cars: number }
  })[]
}

export function AdminAwardsPage({ awards }: AdminAwardsPageProps) {
  const { toast } = useToast()
  const [awardsList, setAwardsList] = useState(awards)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAwards = awardsList.filter((award) =>
    award.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (awardId: string, awardName: string) => {
    if (!confirm(`Are you sure you want to delete "${awardName}"?`)) return

    try {
      const response = await fetch(`/admin/api/awards/${awardId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAwardsList((prev) => prev.filter((award) => award.id !== awardId))
        toast({
          title: "Award deleted",
          description: `"${awardName}" has been deleted.`,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete award.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Manage Awards
            </h1>
            <p className="text-gray-400">
              {awardsList.length} awards in the database
            </p>
          </div>
          <Link href="/admin/awards/new">
            <Button variant="brand">
              <Plus className="w-4 h-4 mr-2" />
              Add Award
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="Search awards..."
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
                <th className="text-left text-gray-400 font-medium py-4 px-6">Award</th>
                <th className="text-left text-gray-400 font-medium py-4 px-6">Slug</th>
                <th className="text-left text-gray-400 font-medium py-4 px-6">Description</th>
                <th className="text-left text-gray-400 font-medium py-4 px-6">Builds</th>
                <th className="text-right text-gray-400 font-medium py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAwards.map((award, index) => (
                <motion.tr
                  key={award.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-t border-brand-gray"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="text-white font-medium">{award.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{award.slug}</td>
                  <td className="py-4 px-6 text-gray-400 max-w-md truncate">
                    {award.description || "-"}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Trophy className="w-4 h-4" />
                      {award._count.cars}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/awards/${award.id}/edit`}>
                        <Button variant="ghost" size="sm" className="flex-1">
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(award.id, award.name)}
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
