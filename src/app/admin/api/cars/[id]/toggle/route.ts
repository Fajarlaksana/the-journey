import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

export async function PATCH(
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
    })

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    const updatedCar = await prisma.car.update({
      where: { id },
      data: {
        published: !car.published,
      },
    })

    return NextResponse.json({ success: true, published: updatedCar.published })
  } catch (error) {
    console.error("Toggle car published error:", error)
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 })
  }
}
