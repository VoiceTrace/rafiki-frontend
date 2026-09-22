import { getBackendAccessToken } from "@/features/auth/server/dal"
import { StudentHomeworkListReal } from "@/features/student-homework/components/student-homework-list-real"
import { listMyAssignments } from "@/lib/api"

export default async function Page() {
  const token = await getBackendAccessToken()
  const assignments = token ? await listMyAssignments(token).catch(() => []) : []

  return <StudentHomeworkListReal assignments={assignments} />
}
