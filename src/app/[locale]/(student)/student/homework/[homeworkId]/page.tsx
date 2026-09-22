import { notFound } from "next/navigation"
import { getBackendAccessToken } from "@/features/auth/server/dal"
import { StudentHomeworkMCQ } from "@/features/student-homework/components/student-homework-mcq"
import { getMyAssignment } from "@/lib/api"

interface Props {
  params: Promise<{ homeworkId: string }>
}

export default async function Page({ params }: Props) {
  const { homeworkId } = await params
  const token = await getBackendAccessToken()
  if (!token) notFound()

  const assignment = await getMyAssignment(token, homeworkId).catch(() => null)
  if (!assignment) notFound()

  return <StudentHomeworkMCQ assignment={assignment} accessToken={token} />
}
