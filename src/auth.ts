import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

// Extend the built-in session types to carry role + accessToken
declare module "next-auth" {
  interface Session {
    user: {
      role: "teacher" | "student"
      accessToken: string
    } & DefaultSession["user"]
  }

  interface User {
    role: "teacher" | "student"
    accessToken: string
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        try {
          const res = await fetch(`${process.env.API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          if (!res.ok) return null

          const data = await res.json()
          const accessToken: string = data.access_token

          // Decode the JWT payload (no verification needed here — the API
          // already verified the credentials; NextAuth session is server-side)
          const payloadB64 = accessToken.split(".")[1]
          const payload = JSON.parse(
            Buffer.from(payloadB64, "base64url").toString("utf-8")
          )

          return {
            id: payload.sub,
            email,
            role: payload.role as "teacher" | "student",
            accessToken,
          }
        } catch {
          return null
        }
      },
    }),
  ],

  callbacks: {
    // Persist role + accessToken into the JWT cookie
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.accessToken = user.accessToken
      }
      return token
    },

    // Expose role + accessToken on the client-accessible session object
    session({ session, token }) {
      session.user.role = token.role as "teacher" | "student"
      session.user.accessToken = token.accessToken as string
      return session
    },
  },

  pages: {
    signIn: "/en/login",
  },
})
