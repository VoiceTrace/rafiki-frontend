"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getBackendAccessToken } from "@/features/auth/server/dal"
import { createAssignment, deleteAssignment, updateAssignment, addQuestion, updateQuestion, deleteQuestion, distributeAssignment, gradeHomeworkSubmission } from "@/lib/api"
import { assignmentSchema, updateAssignmentSchema, questionSchema, distributeSchema, idSchema, localeSchema } from "../schemas/homework"

export type HomeworkActionState = { error?: "auth" | "validation" | "create" | "update" | "delete" | "addQuestion" | "deleteQuestion" | "distribute"; success?: boolean; assignmentId?: string }

function localeFrom(value: unknown) {
  return localeSchema.safeParse(value).data ?? "en"
}

function refreshAssignment(locale: string, id: string) {
  revalidatePath(`/${locale}/teacher/homework`)
  revalidatePath(`/${locale}/teacher/homework/${id}/edit`)
  revalidatePath(`/${locale}/teacher/teaching/lesson`)
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
  if (form.get("lesson_workspace") === "1") {
    const query = new URLSearchParams({
      grade: parsed.data.grade_level,
      subject_id: String(form.get("subject_id") || ""),
      chapter_id: String(form.get("chapter_id") || ""),
      lesson_id: parsed.data.lesson_id,
      assignment_id: assignment.id,
      stage: "homework",
    })
    redirect(`/${locale}/teacher/teaching/lesson?${query.toString()}`)
  }
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
    // Three hints is the ceiling, not a quota — drop the slots the teacher left blank.
    hints: [form.get("hint_0"), form.get("hint_1"), form.get("hint_2")]
      .map((hint) => (typeof hint === "string" ? hint.trim() : ""))
      .filter((hint) => hint.length > 0),
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

export async function saveQuestionAction(input: {
  assignmentId: string
  questionId?: string
  locale: string
  questionText: string
  options: { id: string; text: string }[]
  correctAnswer: string
  hints: string[]
  conceptRef: string
  order: number
}): Promise<HomeworkActionState> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "auth" }
  const assignmentId = idSchema.safeParse(input.assignmentId)
  const questionId = input.questionId ? idSchema.safeParse(input.questionId) : null
  const parsed = questionSchema.safeParse({
    question_text: input.questionText,
    format: "mcq",
    options: input.options,
    correct_answer: input.correctAnswer,
    hints: input.hints,
    concept_ref: input.conceptRef,
    order: input.order,
  })
  if (!assignmentId.success || (questionId && !questionId.success) || !parsed.success) return { error: "validation" }
  try {
    if (questionId?.success) await updateQuestion(token, assignmentId.data, questionId.data, {
      question_text: parsed.data.question_text,
      options: parsed.data.options,
      correct_answer: parsed.data.correct_answer!,
      hints: parsed.data.hints,
      concept_ref: parsed.data.concept_ref,
      order: parsed.data.order,
    })
    else await addQuestion(token, assignmentId.data, parsed.data)
    refreshAssignment(localeFrom(input.locale), assignmentId.data)
    return { success: true }
  } catch {
    return { error: input.questionId ? "update" : "addQuestion" }
  }
}

export async function reorderQuestionsAction(assignmentId: string, orderedIds: string[], locale: string): Promise<HomeworkActionState> {
  const token = await getBackendAccessToken()
  if (!token) return { error: "auth" }
  const parsedAssignment = idSchema.safeParse(assignmentId)
  if (!parsedAssignment.success || orderedIds.some((id) => !idSchema.safeParse(id).success) || new Set(orderedIds).size !== orderedIds.length) return { error: "validation" }
  try {
    await Promise.all(orderedIds.map((questionId, order) => updateQuestion(token, assignmentId, questionId, { order })))
    refreshAssignment(localeFrom(locale), assignmentId)
    return { success: true }
  } catch {
    return { error: "update" }
  }
}

export async function distributeAssignmentAction(assignmentId: string, dueAt: string | undefined, locale: string): Promise<HomeworkActionState> {
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
    revalidatePath(`/${localeFrom(input.locale)}/teacher/teaching/lesson`)
    return { success: true }
  } catch { return { error: "update" } }
}
