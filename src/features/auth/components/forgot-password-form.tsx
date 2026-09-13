"use client"

import { useActionState } from "react"
import { useTranslations } from "next-intl"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordAction } from "@/features/auth/actions/auth-actions"
import { FieldError, FormMessage } from "@/features/auth/components/form-message"
import { SubmitButton } from "@/features/auth/components/submit-button"
import { initialAuthFormState } from "@/features/auth/form-state"

export function ForgotPasswordForm() {
  const t = useTranslations("auth")
  const [state, action] = useActionState(forgotPasswordAction, initialAuthFormState)

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormMessage state={state} />
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" autoComplete="email" inputMode="email" aria-invalid={Boolean(state.errors?.email)} required />
        <FieldError errors={state.errors?.email} />
      </div>
      <SubmitButton label={t("sendResetLink")} />
    </form>
  )
}
