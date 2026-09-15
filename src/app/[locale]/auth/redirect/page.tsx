import { auth } from "@/auth"
import { redirect } from "next/navigation"

/**
 * Intermediate page hit after login. Reads the session (which is now set)
 * and redirects to the correct dashboard based on role.
 */
export default async function AuthRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const safeLocale = locale === "ar" ? "ar" : "en"
  const session = await auth()

  if (!session?.user) {
    redirect(`/${safeLocale}/login`)
  }

  redirect(
    session.user.role === "student"
      ? `/${safeLocale}/onboarding`
      : `/${safeLocale}/${session.user.role}/today`,
  )
}
