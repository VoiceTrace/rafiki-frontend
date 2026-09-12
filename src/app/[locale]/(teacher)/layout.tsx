import type { ReactNode } from "react"
import { AppShell } from "@/components/shared/app-shell"
import { verifySession } from "@/features/auth/server/dal"

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { user } = await verifySession(locale === "ar" ? "ar" : "en", "teacher")
  return <AppShell role="teacher" userName={user.name}>{children}</AppShell>
}
