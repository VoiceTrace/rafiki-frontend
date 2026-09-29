import { getBackendAccessToken } from "@/features/auth/server/dal"
import { getMyAssignment, getMySubmission, listMyAssignments } from "@/lib/api"

export async function loadHomeworkWorkspace(homeworkId?: string) {
  const token = await getBackendAccessToken()
  if (!token) return null
  try {
    const assignments = await listMyAssignments(token)
    const selectedHomework = homeworkId ? await getMyAssignment(token, homeworkId) : null
    // Results are only released once the teacher approves; asking any earlier returns
    // 409 and would blank the whole workspace through the catch below.
    const initialHomeworkResult = selectedHomework?.status === "approved"
      ? await getMySubmission(token, homeworkId!)
      : null
    return { assignments, selectedHomework, initialHomeworkResult }
  } catch {
    return null
  }
}
