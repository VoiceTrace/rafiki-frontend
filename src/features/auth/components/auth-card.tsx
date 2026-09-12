import Link from "next/link"
import { useTranslations } from "next-intl"
import type { ReactNode } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthCard({
  children,
  description,
  footer,
  title,
}: {
  children: ReactNode
  description: string
  footer?: ReactNode
  title: string
}) {
  const common = useTranslations("common")

  return (
    <Card className="border-border/80 bg-card/95 shadow-overlay backdrop-blur-sm">
      <CardHeader className="space-y-3 text-center">
        <Link href="/" className="mx-auto text-2xl font-bold tracking-tight text-secondary-foreground">
          {common("appName")}
        </Link>
        <div className="space-y-1.5">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {children}
        {footer ? <div className="text-center text-sm text-muted-foreground">{footer}</div> : null}
      </CardContent>
    </Card>
  )
}

