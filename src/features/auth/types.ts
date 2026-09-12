export const userRoles = ["teacher", "student"] as const

export type UserRole = (typeof userRoles)[number]

export type SessionUser = {
  id: string
  name: string
  email: string
  role: UserRole
  emailVerified: boolean
}

export type BackendAuthSession = {
  user: SessionUser
  accessToken?: string
  refreshToken?: string
  accessTokenExpiresAt?: number
}

