import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { routing } from "@/i18n/routing"

const handleI18nRouting = createMiddleware(routing)

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl
  const session = request.auth

  // Public paths — skip auth checks
  const isPublic =
    pathname.endsWith("/login") ||
    pathname.includes("/auth/redirect") ||
    pathname.startsWith("/api/auth/")

  if (!isPublic && !session?.user) {
    return NextResponse.redirect(new URL("/en/login", request.url))
  }

  if (session?.user) {
    const role = session.user.role

    // Prevent a student from hitting teacher routes and vice versa
    if (pathname.includes("/teacher/") && role !== "teacher") {
      return NextResponse.redirect(new URL("/en/student/today", request.url))
    }
    if (pathname.includes("/student/") && role !== "student") {
      return NextResponse.redirect(new URL("/en/teacher/today", request.url))
    }
  }

  return handleI18nRouting(request)
})

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
