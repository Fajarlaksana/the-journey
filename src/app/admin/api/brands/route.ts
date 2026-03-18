import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

// GET all brands
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(brands)
  } catch (error) {
    console.error("Get brands error:", error)
    return NextResponse.json({ error: "Failed to get brands" }, { status: 500 })
  }
}

// POST create brand
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, logoUrl, country } = body

    if (!name || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        logoUrl: logoUrl || null,
        country: country || null,
      },
    })

    return NextResponse.json(brand)
  } catch (error: any) {
    console.error("Create brand error:", error)
    return NextResponse.json({ error: error.message || "Failed to create brand" }, { status: 500 })
  }
}
