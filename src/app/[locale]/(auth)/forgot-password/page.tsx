import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { AuthCard } from "@/features/auth/components/auth-card"
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const [{ locale }, t] = await Promise.all([params, getTranslations("auth")])
  const safeLocale = locale === "ar" ? "ar" : "en"

  return (
    <AuthCard
      title={t("forgotPasswordTitle")}
      description={t("forgotPasswordDescription")}
      footer={<Link href={`/${safeLocale}/login`} className="font-semibold text-primary hover:underline">{t("returnToSignIn")}</Link>}
    >
      <ForgotPasswordForm />
    </AuthCard>
  )
}

