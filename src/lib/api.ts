import type { User } from "@/types/user"

const API_URL = (
  process.env.API_URL ??
  process.env.AUTH_API_URL ??
  process.env.NEXT_PUBLIC_API_URL
)?.replace(/\/$/, "")

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

export async function listUsers(
  accessToken: string,
  role?: "teacher" | "student",
): Promise<User[]> {
  const url = new URL(`${API_URL}/users`)
  if (role) url.searchParams.set("role", role)
  const res = await fetch(url.toString(), { headers: authHeaders(accessToken), cache: "no-store" })
  if (!res.ok) throw new Error("Failed to list users")
  return res.json() as Promise<User[]>
}

// ── Homework API (Epic E) ─────────────────────────────────────────────────────

import type {
  AddQuestionRequest,
  AssignmentRead,
  AssignmentWithQuestions,
  CreateAssignmentRequest,
  DistributeRequest,
  GapDigestRead,
  QuestionTeacher,
  StudentAssignmentRead,
  StudentAssignmentWithQuestions,
  SubmissionResult,
  SubmitHomeworkRequest,
  UpdateAssignmentRequest,
  UpdateQuestionRequest,
} from "@/types/homework"

export async function listAssignments(
  accessToken: string,
  lessonId?: string,
): Promise<AssignmentRead[]> {
  const url = new URL(`${API_URL}/homework/assignments`)
  if (lessonId) url.searchParams.set("lesson_id", lessonId)
  const res = await fetch(url.toString(), { headers: authHeaders(accessToken), cache: "no-store" })
  if (!res.ok) throw new Error("Failed to list assignments")
  return res.json() as Promise<AssignmentRead[]>
}

export async function createAssignment(
  accessToken: string,
  data: CreateAssignmentRequest,
): Promise<AssignmentRead> {
  const res = await fetch(`${API_URL}/homework/assignments`, {
    method: "POST",
    headers: { ...authHeaders(accessToken), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create assignment")
  return res.json() as Promise<AssignmentRead>
}

export async function getAssignment(
  accessToken: string,
  assignmentId: string,
): Promise<AssignmentWithQuestions> {
  const res = await fetch(`${API_URL}/homework/assignments/${assignmentId}`, {
    headers: authHeaders(accessToken),
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to get assignment")
  return res.json() as Promise<AssignmentWithQuestions>
}

export async function updateAssignment(
  accessToken: string,
  assignmentId: string,
  data: UpdateAssignmentRequest,
): Promise<AssignmentRead> {
  const res = await fetch(`${API_URL}/homework/assignments/${assignmentId}`, {
    method: "PATCH",
    headers: { ...authHeaders(accessToken), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update assignment")
  return res.json() as Promise<AssignmentRead>
}

export async function deleteAssignment(
  accessToken: string,
  assignmentId: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/homework/assignments/${assignmentId}`, {
    method: "DELETE",
    headers: authHeaders(accessToken),
  })
  if (!res.ok) throw new Error("Failed to delete assignment")
}

export async function addQuestion(
  accessToken: string,
  assignmentId: string,
  data: AddQuestionRequest,
): Promise<QuestionTeacher> {
  const res = await fetch(`${API_URL}/homework/assignments/${assignmentId}/questions`, {
    method: "POST",
    headers: { ...authHeaders(accessToken), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to add question")
  return res.json() as Promise<QuestionTeacher>
}

export async function updateQuestion(
  accessToken: string,
  assignmentId: string,
  questionId: string,
  data: UpdateQuestionRequest,
): Promise<QuestionTeacher> {
  const res = await fetch(
    `${API_URL}/homework/assignments/${assignmentId}/questions/${questionId}`,
    {
      method: "PATCH",
      headers: { ...authHeaders(accessToken), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  )
  if (!res.ok) throw new Error("Failed to update question")
  return res.json() as Promise<QuestionTeacher>
}

export async function deleteQuestion(
  accessToken: string,
  assignmentId: string,
  questionId: string,
): Promise<void> {
  const res = await fetch(
    `${API_URL}/homework/assignments/${assignmentId}/questions/${questionId}`,
    { method: "DELETE", headers: authHeaders(accessToken) },
  )
  if (!res.ok) throw new Error("Failed to delete question")
}

export async function distributeAssignment(
  accessToken: string,
  assignmentId: string,
  data: DistributeRequest,
): Promise<AssignmentRead> {
  const res = await fetch(`${API_URL}/homework/assignments/${assignmentId}/distribute`, {
    method: "POST",
    headers: { ...authHeaders(accessToken), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to distribute assignment")
  return res.json() as Promise<AssignmentRead>
}

export async function getGapDigest(
  accessToken: string,
  assignmentId: string,
): Promise<GapDigestRead> {
  const res = await fetch(`${API_URL}/homework/assignments/${assignmentId}/gap-digest`, {
    headers: authHeaders(accessToken),
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to get gap digest")
  return res.json() as Promise<GapDigestRead>
}

export async function listMyAssignments(
  accessToken: string,
): Promise<StudentAssignmentRead[]> {
  const res = await fetch(`${API_URL}/homework/me/assignments`, {
    headers: authHeaders(accessToken),
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to list assignments")
  return res.json() as Promise<StudentAssignmentRead[]>
}

export async function getMyAssignment(
  accessToken: string,
  studentAssignmentId: string,
): Promise<StudentAssignmentWithQuestions> {
  const res = await fetch(`${API_URL}/homework/me/assignments/${studentAssignmentId}`, {
    headers: authHeaders(accessToken),
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to get assignment")
  return res.json() as Promise<StudentAssignmentWithQuestions>
}

export async function submitHomework(
  accessToken: string,
  studentAssignmentId: string,
  data: SubmitHomeworkRequest,
): Promise<SubmissionResult> {
  const res = await fetch(
    `${API_URL}/homework/me/assignments/${studentAssignmentId}/submit`,
    {
      method: "POST",
      headers: { ...authHeaders(accessToken), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  )
  if (!res.ok) throw new Error("Failed to submit homework")
  return res.json() as Promise<SubmissionResult>
}
