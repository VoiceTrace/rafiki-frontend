import Link from "next/link"
import { CircleCheckBig, CircleX } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { AuthCard } from "@/features/auth/components/auth-card"
import { verifyEmail } from "@/features/auth/server/auth-api"

export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const [{ locale }, query, t] = await Promise.all([params, searchParams, getTranslations("auth")])
  const safeLocale = locale === "ar" ? "ar" : "en"
  let verified = Boolean(query.token)

  if (query.token) {
    try {
      await verifyEmail(query.token)
    } catch {
      verified = false
    }
  }

  return (
    <AuthCard title={verified ? t("emailVerified") : t("verificationFailed")} description={verified ? t("emailVerifiedDescription") : t("verificationFailedDescription")}>
      <div className="space-y-5 text-center">
        {verified ? <CircleCheckBig className="mx-auto size-12 text-primary" aria-hidden="true" /> : <CircleX className="mx-auto size-12 text-destructive" aria-hidden="true" />}
        <Link href={`/${safeLocale}/login`} className="font-semibold text-primary hover:underline">{t("returnToSignIn")}</Link>
      </div>
    </AuthCard>
  )
}

