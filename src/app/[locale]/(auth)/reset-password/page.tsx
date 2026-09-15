import { getTranslations } from "next-intl/server"

import { AuthCard } from "@/features/auth/components/auth-card"
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const [{ locale }, query, t] = await Promise.all([params, searchParams, getTranslations("auth")])
  const safeLocale = locale === "ar" ? "ar" : "en"

  return (
    <AuthCard title={t("resetPasswordTitle")} description={t("resetPasswordDescription")}>
      <ResetPasswordForm locale={safeLocale} token={query.token ?? ""} />
    </AuthCard>
  )
}

