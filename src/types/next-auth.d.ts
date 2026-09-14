import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    role: string
    school_id: string
    access_token: string
  }
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      school_id: string
      access_token: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    school_id: string
    access_token: string
  }
}
