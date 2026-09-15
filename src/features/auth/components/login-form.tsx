"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useTranslations } from "next-intl"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "@/features/auth/actions/auth-actions"
import { FieldError, FormMessage } from "@/features/auth/components/form-message"
import { RoleSelector } from "@/features/auth/components/role-selector"
import { SubmitButton } from "@/features/auth/components/submit-button"
import { initialAuthFormState } from "@/features/auth/form-state"

export function LoginForm({
  callbackUrl,
  locale,
  registered,
}: {
  callbackUrl?: string
  locale: "en" | "ar"
  registered?: boolean
}) {
  const t = useTranslations("auth")
  const [state, action] = useActionState(loginAction, initialAuthFormState)

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
      {registered ? (
        <p role="status" className="rounded-lg bg-secondary/60 px-3 py-2 text-sm text-secondary-foreground">
          {t("accountCreated")}
        </p>
      ) : null}
      <FormMessage state={state} />
      <RoleSelector />
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={t("emailPlaceholder")}
          aria-invalid={Boolean(state.errors?.email)}
          required
        />
        <FieldError errors={state.errors?.email} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="password">{t("password")}</Label>
          <Link href={`/${locale}/forgot-password`} className="text-xs font-semibold text-primary hover:underline">
            {t("forgotPassword")}
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(state.errors?.password)}
          required
        />
        <FieldError errors={state.errors?.password} />
      </div>
      <SubmitButton label={t("signIn")} />
      {process.env.NODE_ENV !== "production" ? (
        <p className="text-center text-xs text-muted-foreground">{t("mockHint")}</p>
      ) : null}
    </form>
  )
}
