import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { routing } from "@/i18n/routing"

const handleI18nRouting = createMiddleware(routing)
const protectedRoute = /^\/(en|ar)\/(teacher|student)(?:\/|$)/
const authRoute = /^\/(en|ar)\/(login|sign-up|forgot-password|reset-password|verify-email)(?:\/|$)/

export const proxy = auth((request) => {
  const { pathname, search } = request.nextUrl
  const protectedMatch = pathname.match(protectedRoute)
  const authMatch = pathname.match(authRoute)
  const locale = protectedMatch?.[1] ?? authMatch?.[1] ?? "en"
  const requestedRole = protectedMatch?.[2]
  const user = request.auth?.user

  if (protectedMatch && !user) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (requestedRole && user?.role && requestedRole !== user.role) {
    return NextResponse.redirect(new URL(`/${locale}/${user.role}/today`, request.url))
  }

  if (authMatch && user?.role) {
    return NextResponse.redirect(new URL(`/${locale}/${user.role}/today`, request.url))
  }

  return handleI18nRouting(request)
})

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
