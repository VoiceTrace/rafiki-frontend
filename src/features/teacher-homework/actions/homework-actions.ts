"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getBackendAccessToken } from "@/features/auth/server/dal"
import { createAssignment, deleteAssignment, updateAssignment, addQuestion, deleteQuestion, distributeAssignment } from "@/lib/api"
import { assignmentSchema, updateAssignmentSchema, questionSchema, distributeSchema, idSchema, localeSchema } from "../schemas/homework"

export type HomeworkActionState = { error?: "auth" | "validation" | "create" | "update" | "delete" | "addQuestion" | "deleteQuestion" | "distribute"; success?: boolean }

function localeFrom(value: unknown) {
  return localeSchema.safeParse(value).data ?? "en"
}

function refreshAssignment(locale: string, id: string) {
  revalidatePath(`/${locale}/teacher/homework`)
  revalidatePath(`/${locale}/teacher/homework/${id}/edit`)
}

export async function createAssignmentAction(_prev: HomeworkActionState | null, form: FormData): Promise<HomeworkActionState> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "auth" }
  const parsed = assignmentSchema.safeParse({
    lesson_id: form.get("lesson_id"), title: form.get("title"),
    description: form.get("description") || undefined, due_at: form.get("due_at") || undefined,
  })
  if (!parsed.success) return { error: "validation" }
  let assignment
  try {
    assignment = await createAssignment(token, {
      ...parsed.data, description: parsed.data.description ?? undefined, due_at: parsed.data.due_at ?? undefined,
    })
  } catch {
    return { error: "create" }
  }
  const locale = localeFrom(form.get("locale"))
  revalidatePath(`/${locale}/teacher/homework`)
  redirect(`/${locale}/teacher/homework/${assignment.id}/edit`)
}

export async function updateAssignmentAction(_prev: HomeworkActionState | null, form: FormData): Promise<HomeworkActionState> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "auth" }
  const id = idSchema.safeParse(form.get("assignment_id"))
  const parsed = updateAssignmentSchema.safeParse({
    title: form.get("title"), description: form.get("description") || null, due_at: form.get("due_at") || null,
  })
  if (!id.success || !parsed.success) return { error: "validation" }
  try {
    await updateAssignment(token, id.data, parsed.data)
    refreshAssignment(localeFrom(form.get("locale")), id.data)
    return { success: true }
  } catch {
    return { error: "update" }
  }
}

export async function deleteAssignmentAction(assignmentId: string, locale: string): Promise<HomeworkActionState> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "auth" }
  if (!idSchema.safeParse(assignmentId).success) return { error: "validation" }
  try {
    await deleteAssignment(token, assignmentId)
  } catch {
    return { error: "delete" }
  }
  const language = localeFrom(locale)
  revalidatePath(`/${language}/teacher/homework`)
  redirect(`/${language}/teacher/homework`)
}

export async function addQuestionAction(_prev: HomeworkActionState | null, form: FormData): Promise<HomeworkActionState> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "auth" }
  const id = idSchema.safeParse(form.get("assignment_id"))
  const options = []
  for (let i = 0; i < 7 && form.has(`option_id_${i}`); i++) {
    options.push({ id: form.get(`option_id_${i}`), text: form.get(`option_text_${i}`) })
  }
  const parsed = questionSchema.safeParse({
    question_text: form.get("question_text"), options, correct_answer: form.get("correct_answer"),
    concept_ref: form.get("concept_ref") || undefined, order: Number(form.get("order")),
  })
  if (!id.success || !parsed.success) return { error: "validation" }
  try {
    await addQuestion(token, id.data, parsed.data)
    refreshAssignment(localeFrom(form.get("locale")), id.data)
    return { success: true }
  } catch {
    return { error: "addQuestion" }
  }
}

export async function deleteQuestionAction(assignmentId: string, questionId: string, locale: string): Promise<HomeworkActionState> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "auth" }
  if (!idSchema.safeParse(assignmentId).success || !idSchema.safeParse(questionId).success) return { error: "validation" }
  try {
    await deleteQuestion(token, assignmentId, questionId)
    refreshAssignment(localeFrom(locale), assignmentId)
    return { success: true }
  } catch {
    return { error: "deleteQuestion" }
  }
}

export async function distributeAssignmentAction(assignmentId: string, studentIds: string[], dueAt: string | undefined, locale: string): Promise<HomeworkActionState> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "auth" }
  const parsed = distributeSchema.safeParse({ student_ids: studentIds, due_at: dueAt })
  if (!idSchema.safeParse(assignmentId).success || !parsed.success) return { error: "validation" }
  try {
    await distributeAssignment(token, assignmentId, parsed.data)
    refreshAssignment(localeFrom(locale), assignmentId)
    return { success: true }
  } catch {
    return { error: "distribute" }
  }
}
