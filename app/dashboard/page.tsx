'use client'

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

type DashboardStats = {
  studentCount: number
  teacherCount: number
  courseCount: number
  enrollmentCount: number
  role: string | null
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [router, status])

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/dashboard")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } finally {
        setLoadingStats(false)
      }
    }

    if (status === "authenticated") {
      loadStats()
    }
  }, [status])

  const role = useMemo(() => {
    const user = session?.user as { role?: string } | undefined
    return user?.role ?? "Unknown"
  }, [session])

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Student Management</p>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Sign out
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Welcome back</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                    {session.user?.name ?? session.user?.email}
                  </h2>
                </div>
                <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                  Role: {role}
                </div>
              </div>
              <p className="mt-6 max-w-xl text-slate-600">
                This dashboard gives you a quick overview of the current student management system and your role-based access.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {loadingStats ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6" />
                ))
              ) : (
                [
                  { label: "Students", value: stats?.studentCount ?? 0 },
                  { label: "Teachers", value: stats?.teacherCount ?? 0 },
                  { label: "Courses", value: stats?.courseCount ?? 0 },
                  { label: "Enrollments", value: stats?.enrollmentCount ?? 0 },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">{item.label}</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Quick actions</h3>
                  <p className="mt-2 text-sm text-slate-600">Jump to live pages for students and courses.</p>
                </div>
              </div>
              <p className="mt-4 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {role === "admin"
                  ? "Admins can manage students and courses from the links below."
                  : role === "teacher"
                  ? "Teachers can review active courses and their student lists."
                  : "Students can browse available courses and review enrollment details."}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Link
                  href="/students"
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-5 text-left text-sm font-medium text-slate-900 transition hover:border-indigo-400 hover:bg-indigo-50"
                >
                  Manage students
                </Link>
                <Link
                  href="/courses"
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-5 text-left text-sm font-medium text-slate-900 transition hover:border-indigo-400 hover:bg-indigo-50"
                >
                  Review courses
                </Link>
                <Link
                  href="/enrollments"
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-5 text-left text-sm font-medium text-slate-900 transition hover:border-indigo-400 hover:bg-indigo-50"
                >
                  View enrollments
                </Link>
                <Link
                  href="/attendance"
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-5 text-left text-sm font-medium text-slate-900 transition hover:border-indigo-400 hover:bg-indigo-50"
                >
                  Attendance reports
                </Link>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">System status</h3>
              <p className="mt-3 text-sm text-slate-600">
                Your account is currently logged in and ready to manage students, courses, grades, and attendance.
              </p>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
                  <p className="font-medium">Session</p>
                  <p className="mt-1">Authenticated</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
                  <p className="font-medium">User role</p>
                  <p className="mt-1">{role}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Tips</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="rounded-2xl bg-slate-50 p-3">Use the dashboard cards to monitor growth at a glance.</li>
                <li className="rounded-2xl bg-slate-50 p-3">Admins can create new student accounts from the students API.</li>
                <li className="rounded-2xl bg-slate-50 p-3">Teachers can review course enrollments and attendance records.</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
