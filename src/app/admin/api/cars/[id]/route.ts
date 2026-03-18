import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

// GET single car
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        brand: true,
        event: true,
        category: true,
        award: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    return NextResponse.json(car)
  } catch (error) {
    console.error("Get car error:", error)
    return NextResponse.json({ error: "Failed to get car" }, { status: 500 })
  }
}

// PUT update car
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
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
      deletedImageIds = [],
    } = body

    // Validate required fields
    if (!name || !slug || !brandId || !ownerName || !eventId || !categoryId || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate images (exactly 6)
    if (!images || !Array.isArray(images) || images.length !== 6) {
      return NextResponse.json({ error: "Exactly 6 images are required" }, { status: 400 })
    }

    // Delete removed images
    if (deletedImageIds.length > 0) {
      await prisma.carImage.deleteMany({
        where: {
          id: { in: deletedImageIds },
        },
      })
    }

    // Separate new and existing images
    const newImages = images.filter((img: { url: string; order: number; id?: string }) => !img.id)
    const existingImages = images.filter((img: { url: string; order: number; id?: string }) => img.id)

    // Update the car entry
    const car = await prisma.car.update({
      where: { id },
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
        // Update existing images order
        images: {
          update: existingImages.map((img: { id: string; url: string; order: number }) => ({
            where: { id: img.id },
            data: { order: img.order },
          })),
          create: newImages.map((img: { url: string; order: number }) => ({
            url: img.url,
            order: img.order,
          })),
        },
      },
      include: {
        brand: true,
        event: true,
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(car)
  } catch (error) {
    console.error("Update car error:", error)
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 })
  }
}

// DELETE car
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    await prisma.car.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete car error:", error)
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 })
  }
}
