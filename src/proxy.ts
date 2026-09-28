import createMiddleware from "next-intl/middleware"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

import { routing } from "@/i18n/routing"

const handleI18nRouting = createMiddleware(routing)
const protectedRoute = /^\/(en|ar)\/(teacher|student)(?:\/|$)/
const authRoute = /^\/(en|ar)\/(login|sign-up|forgot-password|reset-password|verify-email)(?:\/|$)/

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const protectedMatch = pathname.match(protectedRoute)
  const authMatch = pathname.match(authRoute)
  const locale = protectedMatch?.[1] ?? authMatch?.[1] ?? "en"
  const requestedRole = protectedMatch?.[2]
  const token = process.env.AUTH_SECRET
    ? await getToken({req: request, secret: process.env.AUTH_SECRET})
    : null
  const role = token?.role === "teacher" || token?.role === "student"
    ? token.role
    : null

  if (protectedMatch && (!token || token.authError)) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (requestedRole && role && requestedRole !== role) {
    return NextResponse.redirect(new URL(`/${locale}/${role}/today`, request.url))
  }

  if (authMatch && role) {
    return NextResponse.redirect(new URL(`/${locale}/${role}/today`, request.url))
  }

  return handleI18nRouting(request)
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
