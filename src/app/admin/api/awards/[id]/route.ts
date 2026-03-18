import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

// GET single award
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
    const award = await prisma.award.findUnique({
      where: { id },
    })

    if (!award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 })
    }

    return NextResponse.json(award)
  } catch (error) {
    console.error("Get award error:", error)
    return NextResponse.json({ error: "Failed to get award" }, { status: 500 })
  }
}

// PUT update award
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
    const { name, slug, description } = body

    if (!name || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const award = await prisma.award.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
      },
    })

    return NextResponse.json(award)
  } catch (error: any) {
    console.error("Update award error:", error)
    return NextResponse.json({ error: error.message || "Failed to update award" }, { status: 500 })
  }
}

// DELETE award
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

    await prisma.award.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete award error:", error)
    return NextResponse.json({ error: "Failed to delete award" }, { status: 500 })
  }
}
