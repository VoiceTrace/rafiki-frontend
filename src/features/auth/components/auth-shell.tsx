import Link from "next/link"
import type { ReactNode } from "react"

export function AuthShell({
  children,
  locale,
}: {
  children: ReactNode
  locale: "en" | "ar"
}) {
  const otherLocale = locale === "ar" ? "en" : "ar"

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-background px-4 py-10 sm:px-6">
      <div aria-hidden="true" className="absolute -start-32 -top-32 size-80 rounded-full bg-secondary/55 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-40 -end-24 size-96 rounded-full bg-accent/55 blur-3xl" />
      <Link
        href={`/${otherLocale}/login`}
        className="absolute end-4 top-4 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground outline-none transition-colors hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:end-6 sm:top-6"
        aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      >
        {otherLocale.toUpperCase()}
      </Link>
      <div className="relative w-full max-w-md">{children}</div>
    </main>
  )
}

