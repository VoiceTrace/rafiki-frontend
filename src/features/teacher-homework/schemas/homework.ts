import { z } from "zod"

export const localeSchema = z.enum(["en", "ar"])
export const idSchema = z.uuid()
const dueAt = z.iso.datetime({ offset: true }).nullable().optional()
export const assignmentSchema = z.object({
  lesson_id: z.string().trim().min(1).max(100),
  title: z.string().trim().min(1).max(500),
  description: z.string().trim().nullable().optional(),
  due_at: dueAt,
})
export const updateAssignmentSchema = assignmentSchema.omit({ lesson_id: true })
export const questionSchema = z.object({
  question_text: z.string().trim().min(1),
  options: z.array(z.object({ id: z.string().min(1).max(10), text: z.string().trim().min(1) })).min(2).max(6),
  correct_answer: z.string().min(1).max(10),
  concept_ref: z.string().trim().max(200).optional(),
  order: z.number().int().nonnegative(),
}).refine(({ options, correct_answer }) =>
  new Set(options.map((option) => option.id)).size === options.length &&
  options.some((option) => option.id === correct_answer),
)
export const distributeSchema = z.object({
  student_ids: z.array(idSchema).min(1).refine((ids) => new Set(ids).size === ids.length),
  due_at: z.iso.datetime({ offset: true }).optional(),
})
