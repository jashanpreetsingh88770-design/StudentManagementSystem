import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const enrollments = await prisma.enrollment.findMany({
    include: {
      student: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(enrollments)
}
