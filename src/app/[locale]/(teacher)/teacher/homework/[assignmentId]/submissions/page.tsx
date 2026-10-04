import { getBackendAccessToken } from "@/features/auth/server/dal"
import { listHomeworkSubmissions } from "@/lib/api"
import { HomeworkSubmissions } from "@/features/teacher-homework/components/homework-submissions"
import { HomeworkLoadError } from "@/components/homework-load-error"

export default async function Page({ params }: { params: Promise<{ assignmentId: string; locale: string }> }) {
  const { assignmentId, locale } = await params
  const token = await getBackendAccessToken()
  if (!token) return <HomeworkLoadError />
  let submissions
  try { submissions = await listHomeworkSubmissions(token, assignmentId) } catch { return <HomeworkLoadError /> }
  return <HomeworkSubmissions assignmentId={assignmentId} locale={locale} submissions={submissions} />
}
