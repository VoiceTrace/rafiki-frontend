import type { ReactNode } from "react"

import { AuthShell } from "@/features/auth/components/auth-shell"

export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <AuthShell locale={locale === "ar" ? "ar" : "en"}>{children}</AuthShell>
}

