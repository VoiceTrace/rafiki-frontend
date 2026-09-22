import { getBackendAccessToken } from "@/features/auth/server/dal"
import { HomeworkAssignmentList } from "@/features/teacher-homework/components/homework-assignment-list"
import { listAssignments } from "@/lib/api"

export default async function Page() {
  const token = await getBackendAccessToken()
  const assignments = token ? await listAssignments(token).catch(() => []) : []

  return <HomeworkAssignmentList assignments={assignments} />
}
