'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

type Student = {
  id: string
  name: string
  email: string
}

export default function StudentsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [router, status])

  useEffect(() => {
    async function loadStudents() {
      const response = await fetch("/api/students")
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      }
      setLoading(false)
    }

    if (status === "authenticated") {
      loadStudents()
    }
  }, [status])

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading students...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Student Directory</h1>
          <p className="mt-2 text-sm text-slate-600">Review enrolled students and their contact details.</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {students.length ? (
                students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4">{student.name}</td>
                    <td className="px-6 py-4">{student.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                    No students found.
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
