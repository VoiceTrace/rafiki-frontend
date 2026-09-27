import { notFound } from "next/navigation"
import { getBackendAccessToken } from "@/features/auth/server/dal"
import { HomeworkEditShell } from "@/features/teacher-homework/components/homework-edit-shell"
import { ApiError, getAssignment, listUsers } from "@/lib/api"
import { HomeworkLoadError } from "@/components/homework-load-error"

interface Props {
  params: Promise<{ assignmentId: string }>
}

export default async function Page({ params }: Props) {
  const { assignmentId } = await params
  const token = await getBackendAccessToken()
  if (!token) return <HomeworkLoadError />
  let assignment
  let students
  try {
    assignment = await getAssignment(token, assignmentId)
    students = assignment.status === "draft" ? await listUsers(token, "student") : []
  } catch (error) {
    if (error instanceof ApiError && [403, 404, 422].includes(error.status)) notFound()
    return <HomeworkLoadError />
  }
  return <HomeworkEditShell assignment={assignment} students={students.filter((student) => student.is_active)} />
}
