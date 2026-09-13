import { auth } from "@/auth"
import { redirect } from "next/navigation"

/**
 * Intermediate page hit after login. Reads the session (which is now set)
 * and redirects to the correct dashboard based on role.
 */
export default async function AuthRedirectPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role === "teacher") {
    redirect("/en/teacher/today")
  } else {
    redirect("/en/student/today")
  }
}
