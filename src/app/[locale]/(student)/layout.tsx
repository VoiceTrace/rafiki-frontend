import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { auth } from "@/auth"
import { AppShell } from "@/components/shared/app-shell"

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session?.user?.access_token) redirect("/api/auth/signin")

  return (
    <AppShell role="student" user={session.user}>
      {children}
    </AppShell>
  )
}
