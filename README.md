# Student Management System

A minimal full-stack student management system built with Next.js, Prisma, SQLite, and NextAuth.

## Features

- User authentication (Admin, Teacher, Student roles)
- Student management
- Course management
- Enrollments
- Grades tracking
- Attendance tracking

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up the database:

```bash
npx prisma migrate dev
npx prisma db seed
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

## Login Credentials

- Admin: admin@example.com / admin123
- Teacher: teacher@example.com / teacher123
- Student: student@example.com / student123

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- NextAuth.js
- React Hook Form
