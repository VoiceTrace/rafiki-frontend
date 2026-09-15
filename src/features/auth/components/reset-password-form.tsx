"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useTranslations } from "next-intl"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPasswordAction } from "@/features/auth/actions/auth-actions"
import { FieldError, FormMessage } from "@/features/auth/components/form-message"
import { SubmitButton } from "@/features/auth/components/submit-button"
import { initialAuthFormState } from "@/features/auth/form-state"

export function ResetPasswordForm({ locale, token }: { locale: "en" | "ar"; token: string }) {
  const t = useTranslations("auth")
  const [state, action] = useActionState(resetPasswordAction, initialAuthFormState)

  if (state.status === "success") {
    return (
      <div className="space-y-4 text-center">
        <FormMessage state={state} />
        <Link href={`/${locale}/login`} className="font-semibold text-primary hover:underline">{t("returnToSignIn")}</Link>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="token" value={token} />
      <FormMessage state={state} />
      <div className="space-y-2">
        <Label htmlFor="password">{t("newPassword")}</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" aria-describedby="password-help" aria-invalid={Boolean(state.errors?.password)} required />
        <p id="password-help" className="text-xs text-muted-foreground">{t("passwordHelp")}</p>
        <FieldError errors={state.errors?.password} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
        <Input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" aria-invalid={Boolean(state.errors?.confirmPassword)} required />
        <FieldError errors={state.errors?.confirmPassword} />
      </div>
      <SubmitButton label={t("resetPassword")} />
    </form>
  )
}
