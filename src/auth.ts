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

        if (!parsed.success) {
          return null
        }

        const { email, password } = parsed.data

        // TEMPORARY TEMPLATE AUTH
        // Replace this with your real user lookup later.
        if (email === "demo@example.com" && password === "password123") {
          return {
            id: "1",
            name: "Demo User",
            email,
          }
        }

        return null
      },
    }),
  ],
})