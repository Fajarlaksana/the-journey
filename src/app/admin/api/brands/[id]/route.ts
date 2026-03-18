import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

// GET single brand
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
    const brand = await prisma.brand.findUnique({
      where: { id },
    })

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }

    return NextResponse.json(brand)
  } catch (error) {
    console.error("Get brand error:", error)
    return NextResponse.json({ error: "Failed to get brand" }, { status: 500 })
  }
}

// PUT update brand
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
    const { name, slug, logoUrl, country } = body

    if (!name || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name,
        slug,
        logoUrl: logoUrl || null,
        country: country || null,
      },
    })

    return NextResponse.json(brand)
  } catch (error: any) {
    console.error("Update brand error:", error)
    return NextResponse.json({ error: error.message || "Failed to update brand" }, { status: 500 })
  }
}

// DELETE brand
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

    await prisma.brand.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete brand error:", error)
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 })
  }
}
