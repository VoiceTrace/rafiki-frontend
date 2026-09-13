import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import type { SessionUser, UserRole } from "@/features/auth/types"

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth()
  const user = session?.user

  if (session?.authError || !user?.id || !user.email || !user.role) return null

  return {
    id: user.id,
    name: user.name ?? user.email,
    email: user.email,
    role: user.role,
    emailVerified: user.isEmailVerified,
  }
})

export async function verifySession(locale: string, requiredRole?: UserRole) {
  const user = await getSessionUser()

  if (!user) redirect(`/${locale}/login`)

  if (requiredRole && user.role !== requiredRole) {
    redirect(`/${locale}/${user.role}/today`)
  }

  return { isAuthenticated: true as const, user }
}
