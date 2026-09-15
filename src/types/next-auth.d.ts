import type { DefaultSession } from "next-auth"

import type { UserRole } from "@/features/auth/types"

declare module "next-auth" {
  interface User {
    role: UserRole
    isEmailVerified: boolean
    accessToken?: string
    refreshToken?: string
    accessTokenExpiresAt?: number
  }

  interface Session {
    authError?: "RefreshAccessTokenError"
    user: DefaultSession["user"] & {
      id: string
      role: UserRole
      isEmailVerified: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    isEmailVerified: boolean
    accessToken?: string
    refreshToken?: string
    accessTokenExpiresAt?: number
    authError?: "RefreshAccessTokenError"
  }
}
