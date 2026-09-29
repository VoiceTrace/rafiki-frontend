import { z } from "zod"

export const localeSchema = z.enum(["en", "ar"])
export const idSchema = z.uuid()
const dueAt = z.iso.datetime({ offset: true }).nullable().optional()
export const assignmentSchema = z.object({
  grade_level: z.string().trim().min(1).max(100),
  subject: z.string().trim().min(1).max(255),
  chapter: z.string().trim().min(1).max(255),
  lesson_id: z.string().trim().min(1).max(100),
  title: z.string().trim().min(1).max(500),
  description: z.string().trim().nullable().optional(),
  due_at: dueAt,
})
export const updateAssignmentSchema = assignmentSchema.partial()
export const questionSchema = z.object({
  question_text: z.string().trim().min(1),
  format: z.enum(["mcq", "short_note"]),
  options: z.array(z.object({ id: z.string().min(1).max(10), text: z.string().trim().min(1) })).max(6),
  correct_answer: z.string().min(1).max(10).nullable(),
  hints: z.array(z.string().trim().min(1).max(500)).length(3),
  concept_ref: z.string().trim().max(200).optional(),
  order: z.number().int().nonnegative(),
}).superRefine(({ format, options, correct_answer }, ctx) => {
  if (format === "mcq" && (options.length < 2 || !correct_answer || !options.some((option) => option.id === correct_answer))) ctx.addIssue({ code: "custom", message: "MCQ needs valid options and a correct answer" })
  if (format === "short_note" && (options.length || correct_answer)) ctx.addIssue({ code: "custom", message: "Short note cannot have options" })
})
export const distributeSchema = z.object({
  due_at: z.iso.datetime({ offset: true }).optional(),
})
