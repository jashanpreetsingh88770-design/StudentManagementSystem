'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

type Enrollment = {
  id: string
  createdAt: string
  student: {
    name: string
    email: string
  }
  course: {
    name: string
  }
}

export default function EnrollmentsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [router, status])

  useEffect(() => {
    async function loadEnrollments() {
      const response = await fetch("/api/enrollments")
      if (response.ok) {
        const data = await response.json()
        setEnrollments(data)
      }
      setLoading(false)
    }

    if (status === "authenticated") {
      loadEnrollments()
    }
  }, [status])

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading enrollments...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Enrollment Records</h1>
          <p className="mt-2 text-sm text-slate-600">Track which students are enrolled in which courses.</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Student</th>
                <th className="px-6 py-4 text-left font-semibold">Course</th>
                <th className="px-6 py-4 text-left font-semibold">Enrolled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {enrollments.length ? (
                enrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td className="px-6 py-4">{enrollment.student.name}</td>
                    <td className="px-6 py-4">{enrollment.course.name}</td>
                    <td className="px-6 py-4">{new Date(enrollment.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    No enrollments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
