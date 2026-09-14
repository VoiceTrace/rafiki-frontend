import { z } from "zod"

export const profileSchema = z.object({
  full_name: z.string().min(1, "required").max(255),
  password: z.string().min(8, "min8").or(z.literal("")).optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
