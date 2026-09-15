import { getTranslations } from "next-intl/server"

import { AuthCard } from "@/features/auth/components/auth-card"
import { SignUpForm } from "@/features/auth/components/sign-up-form"

export default async function SignUpPage({ params }: { params: Promise<{ locale: string }> }) {
  const [{ locale }, t] = await Promise.all([params, getTranslations("auth")])
  const safeLocale = locale === "ar" ? "ar" : "en"

  return (
    <AuthCard title={t("createYourAccount")} description={t("signUpDescription")}>
      <SignUpForm locale={safeLocale} />
    </AuthCard>
  )
}

