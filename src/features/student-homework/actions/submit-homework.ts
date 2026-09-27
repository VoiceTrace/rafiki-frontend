"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { getBackendAccessToken } from "@/features/auth/server/dal"
import { submitHomework } from "@/lib/api"
import type { SubmissionResult } from "@/types/homework"

const submissionSchema = z.object({
  assignmentId: z.uuid(),
  locale: z.enum(["en", "ar"]),
  answers: z.array(z.object({ question_id: z.uuid(), selected_option: z.string().min(1).max(10) }))
    .min(1).refine((answers) => new Set(answers.map((answer) => answer.question_id)).size === answers.length),
})

export async function submitHomeworkAction(input: z.infer<typeof submissionSchema>): Promise<
  { result: SubmissionResult; error?: never } | { error: true; result?: never }
> {
  const parsed = submissionSchema.safeParse(input)
  const token = await getBackendAccessToken()
  if (!parsed.success || !token) return { error: true }
  try {
    const { assignmentId, locale, answers } = parsed.data
    const result = await submitHomework(token, assignmentId, { answers })
    revalidatePath(`/${locale}/student/homework`)
    revalidatePath(`/${locale}/student/homework/${assignmentId}`)
    return { result }
  } catch {
    return { error: true }
  }
}
