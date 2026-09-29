import { getBackendAccessToken } from "@/features/auth/server/dal"
import { getMyAssignment, getMySubmission, listMyAssignments } from "@/lib/api"

export async function loadHomeworkWorkspace(homeworkId?: string) {
  const token = await getBackendAccessToken()
  if (!token) return null
  try {
    const assignments = await listMyAssignments(token)
    const selectedHomework = homeworkId ? await getMyAssignment(token, homeworkId) : null
    const initialHomeworkResult = selectedHomework?.status === "submitted"
      ? await getMySubmission(token, homeworkId!)
      : null
    return { assignments, selectedHomework, initialHomeworkResult }
  } catch {
    return null
  }
}
