import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

// GET all awards
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const awards = await prisma.award.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(awards)
  } catch (error) {
    console.error("Get awards error:", error)
    return NextResponse.json({ error: "Failed to get awards" }, { status: 500 })
  }
}

// POST create award
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description } = body

    if (!name || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const award = await prisma.award.create({
      data: {
        name,
        slug,
        description: description || null,
      },
    })

    return NextResponse.json(award)
  } catch (error: any) {
    console.error("Create award error:", error)
    return NextResponse.json({ error: error.message || "Failed to create award" }, { status: 500 })
  }
}
