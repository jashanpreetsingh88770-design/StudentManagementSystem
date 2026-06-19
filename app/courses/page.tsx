'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

type Course = {
  id: string
  name: null
  description: string | null
  teacher: {
    id: string
    name: string
    email: string
  }
}

export default function CoursesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [router, status])

  useEffect(() => {
    async function loadCourses() {
      const response = await fetch("/api/courses")
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
      setLoading(false)
    }

    if (status === "authenticated") {
      loadCourses()
    }
  }, [status])

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading courses...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Course Catalog</h1>
          <p className="mt-2 text-sm text-slate-600">Browse available courses and their assigned teachers.</p>
        </div>

        <div className="space-y-4">
          {courses.length ? (
            courses.map((course) => (
              <div key={course.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{course.name}</h2>
                    <p className="text-sm text-slate-600">{course.description ?? "No description provided."}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
                    Teacher: {course.teacher.name}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              No courses available.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
