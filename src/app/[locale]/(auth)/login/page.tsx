import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { AuthCard } from "@/features/auth/components/auth-card"
import { LoginForm } from "@/features/auth/components/login-form"

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ callbackUrl?: string; registered?: string }>
}) {
  const [{ locale }, query, t] = await Promise.all([
    params,
    searchParams,
    getTranslations("auth"),
  ])
  const safeLocale = locale === "ar" ? "ar" : "en"

  return (
    <AuthCard
      title={t("welcomeBack")}
      description={t("loginDescription")}
      footer={<>{t("newToRafiqi")} <Link href={`/${safeLocale}/sign-up`} className="font-semibold text-primary hover:underline">{t("createAccount")}</Link></>}
    >
      <LoginForm
        locale={safeLocale}
        callbackUrl={query.callbackUrl}
        registered={query.registered === "1"}
      />
    </AuthCard>
  )
}

