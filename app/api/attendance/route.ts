import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const records = await prisma.attendance.findMany({
    include: {
      enrollment: {
        include: {
          student: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(records)
}
