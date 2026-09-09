import type { ReactNode } from "react"
import { AppShell } from "@/components/shared/app-shell"

export default function Layout({ children }: { children: ReactNode }) {
  return <AppShell role="student">{children}</AppShell>
}
