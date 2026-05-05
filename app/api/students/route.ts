import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const students = await prisma.user.findMany({
    where: { role: 'student' },
    select: { id: true, name: true, email: true }
  })
  return NextResponse.json(students)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { name, email, password } = await request.json()
  const hashedPassword = await bcrypt.hash(password, 10)
  const student = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'student'
    }
  })
  return NextResponse.json(student)
}