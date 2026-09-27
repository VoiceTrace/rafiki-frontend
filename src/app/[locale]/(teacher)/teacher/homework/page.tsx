import { getBackendAccessToken } from "@/features/auth/server/dal"
import { HomeworkAssignmentList } from "@/features/teacher-homework/components/homework-assignment-list"
import { listAssignments } from "@/lib/api"
import { HomeworkLoadError } from "@/components/homework-load-error"

export default async function Page() {
  const token = await getBackendAccessToken()
  if (!token) return <HomeworkLoadError />
  const assignments = await listAssignments(token).catch(() => null)
  if (!assignments) return <HomeworkLoadError />
  return <HomeworkAssignmentList assignments={assignments} />
}
