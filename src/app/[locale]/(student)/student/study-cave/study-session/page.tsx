import { redirect } from "next/navigation"
import { getBackendAccessToken, verifySession } from "@/features/auth/server/dal"
import { createStudySession } from "@/lib/api"
import { StudySessionShell } from "@/features/study-cave/components/study-session-shell"

type SearchParams = {
  lesson_id?: string | string[]
  session_id?: string | string[]
}

export default async function StudySessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await params
  const safeLocale = locale === "ar" ? "ar" : "en"
  await verifySession(safeLocale, "student")

  const accessToken = await getBackendAccessToken()
  if (!accessToken) redirect(`/${safeLocale}/login`)

  const sp = await searchParams
  const lessonId =
    typeof sp.lesson_id === "string" ? sp.lesson_id : "lesson-demo"

  // Create a new session (production will pass lessonId from B1)
  let session
  try {
    session = await createStudySession(accessToken, lessonId)
  } catch {
    redirect(`/${safeLocale}/student/study-cave`)
  }

  // Stub lesson content until B1 ships a real lessons API
  const lessonContent = {
    lesson_id: lessonId,
    objectives: ["Understand the core concepts", "Apply them in context"],
    concepts: ["concept_1", "concept_2", "concept_3"],
    materials: "Textbook chapter 3",
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] py-4">
      <h1 className="font-heading text-page font-bold tracking-tight mb-1">Study Session</h1>
      <p className="text-sm text-muted-foreground mb-6">Lesson: {lessonId}</p>
      <StudySessionShell
        accessToken={accessToken}
        lessonId={lessonId}
        lessonContent={lessonContent}
        initialSession={session!}
      />
    </div>
  )
}
