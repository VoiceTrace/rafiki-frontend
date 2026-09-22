import { notFound } from "next/navigation"
import { getBackendAccessToken } from "@/features/auth/server/dal"
import { HomeworkEditShell } from "@/features/teacher-homework/components/homework-edit-shell"
import { getAssignment, listUsers } from "@/lib/api"

interface Props {
  params: Promise<{ assignmentId: string }>
}

export default async function Page({ params }: Props) {
  const { assignmentId } = await params
  const token = await getBackendAccessToken()
  if (!token) notFound()

  const [assignment, students] = await Promise.all([
    getAssignment(token, assignmentId).catch(() => null),
    listUsers(token, "student").catch(() => []),
  ])

  if (!assignment) notFound()

  return <HomeworkEditShell assignment={assignment} students={students} />
}
