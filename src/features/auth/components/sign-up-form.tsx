"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useTranslations } from "next-intl"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpAction } from "@/features/auth/actions/auth-actions"
import { FieldError, FormMessage } from "@/features/auth/components/form-message"
import { RoleSelector } from "@/features/auth/components/role-selector"
import { SubmitButton } from "@/features/auth/components/submit-button"
import { initialAuthFormState } from "@/features/auth/form-state"

export function SignUpForm({ locale }: { locale: "en" | "ar" }) {
  const t = useTranslations("auth")
  const [state, action] = useActionState(signUpAction, initialAuthFormState)

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <FormMessage state={state} />
      <RoleSelector />
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" name="name" autoComplete="name" aria-invalid={Boolean(state.errors?.name)} required />
        <FieldError errors={state.errors?.name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" autoComplete="email" inputMode="email" aria-invalid={Boolean(state.errors?.email)} required />
        <FieldError errors={state.errors?.email} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">{t("password")}</Label>
        <Input id="new-password" name="password" type="password" autoComplete="new-password" aria-describedby="password-help" aria-invalid={Boolean(state.errors?.password)} required />
        <p id="password-help" className="text-xs text-muted-foreground">{t("passwordHelp")}</p>
        <FieldError errors={state.errors?.password} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
        <Input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" aria-invalid={Boolean(state.errors?.confirmPassword)} required />
        <FieldError errors={state.errors?.confirmPassword} />
      </div>
      <div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input name="acceptTerms" type="checkbox" className="mt-0.5 size-4 rounded border-input accent-primary" />
          <span>{t("acceptTerms")}</span>
        </label>
        <FieldError errors={state.errors?.acceptTerms} />
      </div>
      <SubmitButton label={t("createAccount")} />
      <p className="text-center text-sm text-muted-foreground">
        {t("alreadyHaveAccount")} {" "}
        <Link href={`/${locale}/login`} className="font-semibold text-primary hover:underline">{t("signIn")}</Link>
      </p>
    </form>
  )
}
