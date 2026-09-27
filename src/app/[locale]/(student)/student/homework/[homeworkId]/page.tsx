import { notFound } from "next/navigation"
import { getBackendAccessToken } from "@/features/auth/server/dal"
import { StudentHomeworkMCQ } from "@/features/student-homework/components/student-homework-mcq"
import { ApiError, getMyAssignment, getMySubmission } from "@/lib/api"
import { HomeworkLoadError } from "@/components/homework-load-error"

interface Props {
  params: Promise<{ homeworkId: string }>
}

export default async function Page({ params }: Props) {
  const { homeworkId } = await params
  const token = await getBackendAccessToken()
  if (!token) return <HomeworkLoadError />

  let assignment
  let initialResult
  try {
    assignment = await getMyAssignment(token, homeworkId)
    initialResult = assignment.status === "submitted" ? await getMySubmission(token, homeworkId) : null
  } catch (error) {
    if (error instanceof ApiError && [403, 404, 422].includes(error.status)) notFound()
    return <HomeworkLoadError />
  }
  return <StudentHomeworkMCQ key={assignment.id} assignment={assignment} initialResult={initialResult} />
}
