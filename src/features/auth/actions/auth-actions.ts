"use server"

import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

import { signIn, signOut } from "@/auth"
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signUpSchema,
} from "@/features/auth/schemas/auth-schemas"
import {
  AuthApiError,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "@/features/auth/server/auth-api"
import type { UserRole } from "@/features/auth/types"

type FieldErrors = Record<string, string[] | undefined>

export type AuthFormState = {
  status: "idle" | "error" | "success"
  message?: string
  errors?: FieldErrors
}

function fieldErrors(error: { flatten(): { fieldErrors: FieldErrors } }) {
  return error.flatten().fieldErrors
}

function normalizeLocale(value: FormDataEntryValue | null) {
  return value === "ar" ? "ar" : "en"
}

function roleHome(locale: string, role: UserRole) {
  return `/${locale}/${role}/today`
}

function safeCallbackUrl(
  value: FormDataEntryValue | null,
  locale: string,
  role: UserRole,
) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return roleHome(locale, role)
  }

  try {
    const url = new URL(value, "https://rafiqi.local")
    if (url.origin !== "https://rafiqi.local") return roleHome(locale, role)
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return roleHome(locale, role)
  }
}

export async function loginAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  })

  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error) }
  }

  const locale = normalizeLocale(formData.get("locale"))
  const redirectTo = safeCallbackUrl(
    formData.get("callbackUrl"),
    locale,
    parsed.data.role,
  )

  try {
    await signIn("credentials", { ...parsed.data, redirectTo })
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: "error",
        message:
          error.type === "CredentialsSignin"
            ? "invalidCredentials"
            : "requestFailed",
      }
    }

    throw error
  }

  return { status: "success" }
}

export async function signUpAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    acceptTerms: formData.get("acceptTerms"),
  })

  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error) }
  }

  const locale = normalizeLocale(formData.get("locale"))
  const input = {
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password,
    role: parsed.data.role,
  }

  try {
    await registerUser(input)
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof AuthApiError && error.status === 409
          ? "accountExists"
          : error instanceof AuthApiError
            ? error.code
            : "requestFailed",
    }
  }

  try {
    await signIn("credentials", {
      email: input.email,
      password: input.password,
      role: input.role,
      redirectTo: roleHome(locale, input.role),
    })
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/${locale}/login?registered=1`)
    }
    throw error
  }

  return { status: "success" }
}

export async function forgotPasswordAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") })

  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error) }
  }

  try {
    await requestPasswordReset(parsed.data.email)
  } catch {
    // Deliberately return the same result to prevent account enumeration.
  }

  return { status: "success", message: "resetEmailSent" }
}

export async function resetPasswordAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error) }
  }

  try {
    await resetPassword({ token: parsed.data.token, password: parsed.data.password })
  } catch (error) {
    return {
      status: "error",
      message: error instanceof AuthApiError ? error.code : "requestFailed",
    }
  }

  return { status: "success", message: "passwordReset" }
}

export async function logoutAction(formData: FormData) {
  const locale = normalizeLocale(formData.get("locale"))
  await signOut({ redirectTo: `/${locale}/login` })
}
