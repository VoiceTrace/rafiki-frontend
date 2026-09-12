"use client"

import { useTranslations } from "next-intl"

import type { AuthFormState } from "@/features/auth/actions/auth-actions"

export function FormMessage({ state }: { state: AuthFormState }) {
  const t = useTranslations("auth.errors")

  if (!state.message) return null

  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      className={
        state.status === "error"
          ? "rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          : "rounded-lg bg-secondary/60 px-3 py-2 text-sm text-secondary-foreground"
      }
    >
      {t(state.message)}
    </p>
  )
}

export function FieldError({ errors }: { errors?: string[] }) {
  const t = useTranslations("auth.errors")
  if (!errors?.length) return null
  return <p className="text-xs text-destructive">{errors.map((error) => t(error)).join(" ")}</p>
}

