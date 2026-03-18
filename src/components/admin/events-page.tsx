"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Plus, Pencil, Trash2, Calendar, MapPin } from "lucide-react"
import { Event } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface AdminEventsPageProps {
  events: (Event & {
    _count: { cars: number }
  })[]
}

export function AdminEventsPage({ events }: AdminEventsPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [eventsList, setEventsList] = useState(events)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEvents = eventsList.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (eventId: string, eventName: string) => {
    if (!confirm(`Are you sure you want to delete "${eventName}"?`)) return

    try {
      const response = await fetch(`/admin/api/events/${eventId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setEventsList((prev) => prev.filter((event) => event.id !== eventId))
        toast({
          title: "Event deleted",
          description: `"${eventName}" has been deleted.`,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Manage Events
            </h1>
            <p className="text-gray-400">
              {eventsList.length} events in the database
            </p>
          </div>
          <Link href="/admin/events/new">
            <Button variant="brand">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 bg-brand-gray border-brand-gray text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-brand-gray rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {event.name}
                  </h3>
                  <span className="inline-block px-2 py-1 bg-brand-red/20 text-brand-red text-sm font-medium rounded mt-1">
                    {event.year}
                  </span>
                </div>
                {event.featured && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-medium rounded">
                    Featured
                  </span>
                )}
              </div>

              {event.location && (
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <Calendar className="w-4 h-4" />
                {event._count.cars} builds
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/admin/events/${event.id}/edit`}>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(event.id, event.name)}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
