import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()
  if (session?.user?.role === "teacher") redirect(`/${locale}/teacher/today`)
  if (session?.user?.role === "student") redirect(`/${locale}/student/today`)
  redirect("/login")
}
