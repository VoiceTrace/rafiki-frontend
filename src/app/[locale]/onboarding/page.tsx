import { redirect } from "next/navigation"

import { getSessionUser } from "@/features/auth/server/dal"
import { StudentOnboarding } from "@/features/student-onboarding/components/student-onboarding"

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const safeLocale = locale === "ar" ? "ar" : "en"
  const user = await getSessionUser()

  if (!user) redirect(`/${safeLocale}/login`)
  if (user.role !== "student") redirect(`/${safeLocale}/${user.role}/today`)

  return (
    <StudentOnboarding
      locale={safeLocale}
      studentId={user.id}
      studentName={user.name}
    />
  )
}
