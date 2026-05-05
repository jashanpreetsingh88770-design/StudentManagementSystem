'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

type AttendanceRecord = {
  id: string
  date: string
  present: boolean
  enrollment: {
    student: {
      name: string
      email: string
    }
    course: {
      name: string
    }
  }
}

export default function AttendancePage() {
  const { status } = useSession()
  const router = useRouter()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [router, status])

  useEffect(() => {
    async function loadRecords() {
      const response = await fetch("/api/attendance")
      if (response.ok) {
        const data = await response.json()
        setRecords(data)
      }
      setLoading(false)
    }

    if (status === "authenticated") {
      loadRecords()
    }
  }, [status])

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading attendance...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Attendance Reports</h1>
          <p className="mt-2 text-sm text-slate-600">View attendance records for enrolled students.</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Student</th>
                <th className="px-6 py-4 text-left font-semibold">Course</th>
                <th className="px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {records.length ? (
                records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4">{record.enrollment.student.name}</td>
                    <td className="px-6 py-4">{record.enrollment.course.name}</td>
                    <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{record.present ? "Present" : "Absent"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No attendance records found.
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
