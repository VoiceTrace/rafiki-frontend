import { getBackendAccessToken } from "@/features/auth/server/dal"
import { StudentHomeworkListReal } from "@/features/student-homework/components/student-homework-list-real"
import { listMyAssignments } from "@/lib/api"
import { HomeworkLoadError } from "@/components/homework-load-error"

export default async function Page() {
  const token = await getBackendAccessToken()
  if (!token) return <HomeworkLoadError />
  const assignments = await listMyAssignments(token).catch(() => null)
  if (!assignments) return <HomeworkLoadError />
  return <StudentHomeworkListReal assignments={assignments} />
}
