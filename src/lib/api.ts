import type { User } from "@/types/user"
import type {
  AttemptResult,
  MasteryRecord,
  Question,
  StudySession,
  StudySessionWithQuestions,
} from "@/types/study-session"

const API_URL = (process.env.API_URL ?? process.env.AUTH_API_URL)?.replace(/\/$/, "")

function authHeaders(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` }
}

export async function getMe(accessToken: string): Promise<User> {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: authHeaders(accessToken),
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to fetch profile")
  return res.json() as Promise<User>
}

export async function updateMe(
  accessToken: string,
  data: { full_name?: string; password?: string },
): Promise<User> {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: { ...authHeaders(accessToken), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update profile")
  return res.json() as Promise<User>
}

export async function uploadAvatar(accessToken: string, file: File): Promise<User> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${API_URL}/users/me/avatar`, {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: form,
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { detail?: unknown } | null
    throw new Error(res.status === 413 ? "too_large" : res.status === 400 ? "bad_type" : "upload_failed")
  }
  return res.json() as Promise<User>
}

export async function removeAvatar(accessToken: string): Promise<User> {
  const res = await fetch(`${API_URL}/users/me/avatar`, {
    method: "DELETE",
    headers: authHeaders(accessToken),
  })
  if (!res.ok) throw new Error("Failed to remove avatar")
  return res.json() as Promise<User>
}

// ─── Study Sessions (Epic D) ──────────────────────────────────────────────────

export async function createStudySession(
  accessToken: string,
  lessonId: string,
): Promise<StudySession> {
  const res = await fetch(`${API_URL}/study-sessions`, {
    method: "POST",
    headers: { ...authHeaders(accessToken), "Content-Type": "application/json" },
    body: JSON.stringify({ lesson_id: lessonId }),
  })
  if (!res.ok) throw new Error("Failed to create study session")
  return res.json() as Promise<StudySession>
}

export async function getStudySession(
  accessToken: string,
  sessionId: string,
): Promise<StudySessionWithQuestions> {
  const res = await fetch(`${API_URL}/study-sessions/${sessionId}`, {
    headers: authHeaders(accessToken),
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to fetch study session")
  return res.json() as Promise<StudySessionWithQuestions>
}

export async function planStudySession(
  accessToken: string,
  sessionId: string,
  lessonContent: Record<string, unknown>,
): Promise<StudySession> {
  const res = await fetch(`${API_URL}/study-sessions/${sessionId}/plan`, {
    method: "POST",
    headers: { ...authHeaders(accessToken), "Content-Type": "application/json" },
    body: JSON.stringify({ lesson_content: lessonContent }),
  })
  if (!res.ok) throw new Error("Failed to plan study session")
  return res.json() as Promise<StudySession>
}

export async function advanceStage(
  accessToken: string,
  sessionId: string,
  toStage: string,
): Promise<StudySession> {
  const res = await fetch(`${API_URL}/study-sessions/${sessionId}/advance`, {
    method: "POST",
    headers: { ...authHeaders(accessToken), "Content-Type": "application/json" },
    body: JSON.stringify({ to_stage: toStage }),
  })
  if (!res.ok) throw new Error("Failed to advance stage")
  return res.json() as Promise<StudySession>
}

export async function getNextQuestion(
  accessToken: string,
  sessionId: string,
): Promise<Question> {
  const res = await fetch(`${API_URL}/study-sessions/${sessionId}/questions`, {
    method: "POST",
    headers: authHeaders(accessToken),
  })
  if (!res.ok) throw new Error("Failed to get question")
  return res.json() as Promise<Question>
}

export async function submitAttempt(
  accessToken: string,
  sessionId: string,
  questionId: string,
  studentResponse: string,
): Promise<AttemptResult> {
  const res = await fetch(
    `${API_URL}/study-sessions/${sessionId}/questions/${questionId}/attempts`,
    {
      method: "POST",
      headers: { ...authHeaders(accessToken), "Content-Type": "application/json" },
      body: JSON.stringify({ student_response: studentResponse }),
    },
  )
  if (!res.ok) throw new Error("Failed to submit attempt")
  return res.json() as Promise<AttemptResult>
}

export async function advanceConcept(
  accessToken: string,
  sessionId: string,
): Promise<StudySession> {
  const res = await fetch(`${API_URL}/study-sessions/${sessionId}/concepts/next`, {
    method: "POST",
    headers: authHeaders(accessToken),
  })
  if (!res.ok) throw new Error("Failed to advance concept")
  return res.json() as Promise<StudySession>
}

export async function closeStudySession(
  accessToken: string,
  sessionId: string,
): Promise<StudySession> {
  const res = await fetch(`${API_URL}/study-sessions/${sessionId}/close`, {
    method: "POST",
    headers: authHeaders(accessToken),
  })
  if (!res.ok) throw new Error("Failed to close session")
  return res.json() as Promise<StudySession>
}

export async function getMyMastery(
  accessToken: string,
  lessonId?: string,
): Promise<MasteryRecord[]> {
  const url = new URL(`${API_URL}/study-sessions/me/mastery`)
  if (lessonId) url.searchParams.set("lesson_id", lessonId)
  const res = await fetch(url.toString(), {
    headers: authHeaders(accessToken),
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to fetch mastery records")
  return res.json() as Promise<MasteryRecord[]>
}
