import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin'
    }
  })

  // Create teacher
  const teacherPassword = await bcrypt.hash('teacher123', 10)
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      password: teacherPassword,
      name: 'Teacher User',
      role: 'teacher'
    }
  })

  // Create student
  const studentPassword = await bcrypt.hash('student123', 10)
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: studentPassword,
      name: 'Student User',
      role: 'student'
    }
  })

  // Create course
  const course = await prisma.course.upsert({
    where: { id: 'course1' },
    update: {},
    create: {
      id: 'course1',
      name: 'Mathematics',
      description: 'Basic Mathematics',
      teacherId: teacher.id
    }
  })

  // Enroll student
  const enrollment = await prisma.enrollment.upsert({
    where: { id: 'enrollment1' },
    update: {},
    create: {
      id: 'enrollment1',
      studentId: student.id,
      courseId: course.id
    }
  })

  // Add grade
  await prisma.grade.upsert({
    where: { id: 'grade1' },
    update: {},
    create: {
      id: 'grade1',
      enrollmentId: enrollment.id,
      value: 85,
      subject: 'Math'
    }
  })

  // Add attendance
  await prisma.attendance.upsert({
    where: { id: 'attendance1' },
    update: {},
    create: {
      id: 'attendance1',
      enrollmentId: enrollment.id,
      date: new Date(),
      present: true
    }
  })

  console.log('Seeded database')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })