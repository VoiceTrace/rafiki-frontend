import { z } from "zod"

import { userRoles } from "@/features/auth/types"

const email = z.string().trim().toLowerCase().email("invalidEmail")
const password = z
  .string()
  .min(8, "passwordLength")
  .regex(/[A-Za-z]/, "passwordLetter")
  .regex(/[0-9]/, "passwordNumber")

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "passwordRequired"),
  role: z.enum(userRoles),
})

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "nameLength").max(80, "nameLength"),
    email,
    role: z.enum(userRoles),
    password,
    confirmPassword: z.string(),
    acceptTerms: z.literal("on", { error: "termsRequired" }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwordMismatch",
  })

export const forgotPasswordSchema = z.object({ email })

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "invalidResetLink"),
    password,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwordMismatch",
  })

