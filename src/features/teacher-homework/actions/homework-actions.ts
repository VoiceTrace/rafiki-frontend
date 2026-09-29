"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getBackendAccessToken } from "@/features/auth/server/dal"
import { createAssignment, deleteAssignment, updateAssignment, addQuestion, deleteQuestion, distributeAssignment, gradeHomeworkSubmission } from "@/lib/api"
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
    grade_level: form.get("grade_level"), subject: form.get("subject"), chapter: form.get("chapter"), lesson_id: form.get("lesson_id"), title: form.get("title"),
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
    grade_level: form.get("grade_level"), subject: form.get("subject"), chapter: form.get("chapter"), lesson_id: form.get("lesson_id"), title: form.get("title"), description: form.get("description") || null, due_at: form.get("due_at") || null,
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
  const format = form.get("format") === "short_note" ? "short_note" : "mcq"
  const options = []
  for (let i = 0; format === "mcq" && i < 7 && form.has(`option_id_${i}`); i++) {
    options.push({ id: form.get(`option_id_${i}`), text: form.get(`option_text_${i}`) })
  }
  const parsed = questionSchema.safeParse({
    question_text: form.get("question_text"), format, options, correct_answer: format === "mcq" ? form.get("correct_answer") || null : null,
    hints: [form.get("hint_0"), form.get("hint_1"), form.get("hint_2")],
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
  const parsed = distributeSchema.safeParse({ due_at: dueAt })
  if (!idSchema.safeParse(assignmentId).success || !parsed.success) return { error: "validation" }
  try {
    await distributeAssignment(token, assignmentId, parsed.data)
    refreshAssignment(localeFrom(locale), assignmentId)
    return { success: true }
  } catch {
    return { error: "distribute" }
  }
}

export async function gradeSubmissionAction(input: { assignmentId: string; studentAssignmentId: string; locale: string; grades: { question_id: string; score: number; comment?: string }[]; approve: boolean }): Promise<HomeworkActionState> {
  const token = await getBackendAccessToken()
  if (!token || !idSchema.safeParse(input.assignmentId).success || !idSchema.safeParse(input.studentAssignmentId).success) return { error: "validation" }
  if (!input.grades.length || input.grades.some((grade) => !idSchema.safeParse(grade.question_id).success || grade.score < 0 || grade.score > 1)) return { error: "validation" }
  try {
    await gradeHomeworkSubmission(token, input.assignmentId, input.studentAssignmentId, { grades: input.grades, approve: input.approve })
    revalidatePath(`/${localeFrom(input.locale)}/teacher/homework/${input.assignmentId}/submissions`)
    return { success: true }
  } catch { return { error: "update" } }
}
