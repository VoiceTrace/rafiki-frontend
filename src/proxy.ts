import createMiddleware from "next-intl/middleware"

import { auth } from "@/auth"
import { routing } from "@/i18n/routing"

const handleI18nRouting = createMiddleware(routing)

export const proxy = auth((request) => handleI18nRouting(request))

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
