import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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

        const loginRes = await fetch(`${process.env.API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password }),
        })
        if (!loginRes.ok) return null

        const { access_token } = (await loginRes.json()) as { access_token: string }

        const payload = JSON.parse(
          Buffer.from(access_token.split(".")[1], "base64url").toString(),
        ) as { sub: string; role: string; school_id: string }

        const meRes = await fetch(`${process.env.API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        if (!meRes.ok) return null
        const me = (await meRes.json()) as { full_name: string; email: string }

        return {
          id: payload.sub,
          name: me.full_name,
          email: me.email,
          role: payload.role,
          school_id: payload.school_id,
          access_token,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.school_id = user.school_id
        token.access_token = user.access_token
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      session.user.school_id = token.school_id
      session.user.access_token = token.access_token
      return session
    },
  },
})
