import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Received car data:", body)

    const {
      name,
      slug,
      brandId,
      ownerName,
      eventId,
      categoryId,
      awardId,
      description,
      engine,
      turbo,
      suspension,
      wheels,
      bodykit,
      interior,
      paint,
      featured,
      trending,
      carOfTheMonth,
      images,
    } = body

    // Validate required fields
    if (!name || !slug || !brandId || !ownerName || !eventId || !categoryId || !description) {
      return NextResponse.json({ error: "Missing required fields", missing: { name, slug, brandId, ownerName, eventId, categoryId, description } }, { status: 400 })
    }

    // Validate images (exactly 6)
    if (!images || !Array.isArray(images) || images.length !== 6) {
      return NextResponse.json({ error: "Exactly 6 images are required", received: images?.length || 0 }, { status: 400 })
    }

    // Create the car entry
    const car = await prisma.car.create({
      data: {
        name,
        slug,
        brand: { connect: { id: brandId } },
        ownerName,
        event: { connect: { id: eventId } },
        category: { connect: { id: categoryId } },
        award: awardId && awardId !== "none" && awardId !== "" ? { connect: { id: awardId } } : undefined,
        description,
        engine: engine || null,
        turbo: turbo || null,
        suspension: suspension || null,
        wheels: wheels || null,
        bodykit: bodykit || null,
        interior: interior || null,
        paint: paint || null,
        featured: featured || false,
        trending: trending || false,
        carOfTheMonth: carOfTheMonth || false,
        published: true,
        images: {
          create: images.map((img: { url: string; order: number; caption?: string }) => ({
            url: img.url,
            order: img.order,
            caption: img.caption || null,
          })),
        },
      },
      include: {
        brand: true,
        event: true,
        category: true,
        images: true,
      },
    })

    console.log("Car created successfully:", car.id)
    return NextResponse.json(car)
  } catch (error: any) {
    console.error("Create car error:", error)
    return NextResponse.json({ error: error.message || "Failed to create car" }, { status: 500 })
  }
}
