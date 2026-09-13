import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { loginSchema } from "@/features/auth/schemas/auth-schemas"
import {
  AuthApiError,
  authenticateUser,
  refreshAuthSession,
  revokeAuthSession,
} from "@/features/auth/server/auth-api"

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        role: {},
      },

      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)

        if (!parsed.success) return null

        let result
        try {
          result = await authenticateUser(parsed.data)
        } catch (error) {
          if (error instanceof AuthApiError && error.status === 401) return null
          throw error
        }

        return {
          ...result.user,
          isEmailVerified: result.user.emailVerified,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          accessTokenExpiresAt: result.accessTokenExpiresAt,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.role = user.role
        token.isEmailVerified = user.isEmailVerified
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpiresAt = user.accessTokenExpiresAt
      }

      if (
        !user &&
        typeof token.accessToken === "string" &&
        typeof token.accessTokenExpiresAt === "number" &&
        Date.now() >= token.accessTokenExpiresAt - 30_000
      ) {
        if (typeof token.refreshToken !== "string") {
          token.authError = "RefreshAccessTokenError"
          return token
        }

        try {
          const refreshed = await refreshAuthSession(token.refreshToken)
          token.accessToken = refreshed.accessToken
          token.refreshToken = refreshed.refreshToken ?? token.refreshToken
          token.accessTokenExpiresAt = refreshed.accessTokenExpiresAt
          delete token.authError
        } catch {
          token.authError = "RefreshAccessTokenError"
        }
      }

      return token
    },
    session({ session, token }) {
      if (token.role !== "teacher" && token.role !== "student") {
        throw new Error("Authenticated session is missing a valid user role.")
      }

      session.user.id = token.sub ?? ""
      session.user.role = token.role
      session.user.isEmailVerified = token.isEmailVerified === true
      session.authError =
        token.authError === "RefreshAccessTokenError"
          ? "RefreshAccessTokenError"
          : undefined
      return session
    },
  },
  events: {
    async signOut(message) {
      if ("token" in message && typeof message.token?.refreshToken === "string") {
        await revokeAuthSession(message.token.refreshToken).catch(() => undefined)
      }
    },
  },
})
