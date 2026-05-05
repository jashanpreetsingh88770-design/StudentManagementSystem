import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [studentCount, teacherCount, courseCount, enrollmentCount] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.user.count({ where: { role: "teacher" } }),
    prisma.course.count(),
    prisma.enrollment.count(),
  ])

  const role = (session.user as { role?: string } | undefined)?.role ?? null

  return NextResponse.json({
    studentCount,
    teacherCount,
    courseCount,
    enrollmentCount,
    role,
  })
}
