"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getBackendAccessToken } from "@/features/auth/server/dal"
import {
  createAssignment,
  deleteAssignment,
  updateAssignment,
  addQuestion,
  deleteQuestion,
  distributeAssignment,
} from "@/lib/api"
import type {
  AddQuestionRequest,
  CreateAssignmentRequest,
  DistributeRequest,
  UpdateAssignmentRequest,
} from "@/types/homework"

function getLocale(formData: FormData): string {
  return (formData.get("locale") as string | null) ?? "en"
}

export async function createAssignmentAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "Not authenticated" }

  const data: CreateAssignmentRequest = {
    lesson_id: formData.get("lesson_id") as string,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    due_at: (formData.get("due_at") as string) || undefined,
  }

  try {
    const assignment = await createAssignment(token, data)
    const locale = getLocale(formData)
    redirect(`/${locale}/teacher/homework/${assignment.id}/edit`)
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to create assignment" }
  }
}

export async function updateAssignmentAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "Not authenticated" }

  const assignmentId = formData.get("assignment_id") as string
  const data: UpdateAssignmentRequest = {
    title: (formData.get("title") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    due_at: (formData.get("due_at") as string) || undefined,
  }

  try {
    await updateAssignment(token, assignmentId, data)
    const locale = getLocale(formData)
    revalidatePath(`/${locale}/teacher/homework/${assignmentId}/edit`)
    return {}
  } catch {
    return { error: "Failed to update assignment" }
  }
}

export async function deleteAssignmentAction(
  assignmentId: string,
  locale: string,
): Promise<{ error?: string }> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "Not authenticated" }
  try {
    await deleteAssignment(token, assignmentId)
    revalidatePath(`/${locale}/teacher/homework`)
    redirect(`/${locale}/teacher/homework`)
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to delete assignment" }
  }
}

export async function addQuestionAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "Not authenticated" }

  const assignmentId = formData.get("assignment_id") as string
  const locale = getLocale(formData)

  // Parse options from form: option_id_0..N, option_text_0..N
  const options: Array<{ id: string; text: string }> = []
  let i = 0
  while (formData.has(`option_id_${i}`)) {
    options.push({
      id: formData.get(`option_id_${i}`) as string,
      text: formData.get(`option_text_${i}`) as string,
    })
    i++
  }

  const data: AddQuestionRequest = {
    question_text: formData.get("question_text") as string,
    options,
    correct_answer: formData.get("correct_answer") as string,
    concept_ref: (formData.get("concept_ref") as string) || undefined,
    order: Number(formData.get("order") ?? 0),
  }

  try {
    await addQuestion(token, assignmentId, data)
    revalidatePath(`/${locale}/teacher/homework/${assignmentId}/edit`)
    return {}
  } catch {
    return { error: "Failed to add question" }
  }
}

export async function deleteQuestionAction(
  assignmentId: string,
  questionId: string,
  locale: string,
): Promise<{ error?: string }> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "Not authenticated" }
  try {
    await deleteQuestion(token, assignmentId, questionId)
    revalidatePath(`/${locale}/teacher/homework/${assignmentId}/edit`)
    return {}
  } catch {
    return { error: "Failed to delete question" }
  }
}

export async function distributeAssignmentAction(
  assignmentId: string,
  studentIds: string[],
  dueAt: string | undefined,
  locale: string,
): Promise<{ error?: string }> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "Not authenticated" }

  const data: DistributeRequest = { student_ids: studentIds, due_at: dueAt }

  try {
    await distributeAssignment(token, assignmentId, data)
    revalidatePath(`/${locale}/teacher/homework`)
    revalidatePath(`/${locale}/teacher/homework/${assignmentId}/edit`)
    return {}
  } catch {
    return { error: "Failed to distribute assignment" }
  }
}
