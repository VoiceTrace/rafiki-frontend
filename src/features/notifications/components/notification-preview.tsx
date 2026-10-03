"use client"
import { useCallback, useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Popover, PopoverTrigger, PopoverContent, PopoverTitle, PopoverDescription } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import type { Inbox } from "../types"

export function NotificationPreview({ role, count }: { role: "student" | "teacher"; count: number }) {
  const t = useTranslations("notifications")
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [inbox, setInbox] = useState<Inbox | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const load = useCallback(async () => {
    setLoading(true); setError(false)
    try {
      const response = await fetch("/api/notifications?limit=5", { cache: "no-store" })
      if (!response.ok) throw new Error()
      setInbox(await response.json())
    } catch { setError(true) } finally { setLoading(false) }
  }, [])
  useEffect(() => {
    if (!open) return
    const refresh = () => { void load() }
    window.addEventListener("rafiqi-inbox-changed", refresh)
    return () => window.removeEventListener("rafiqi-inbox-changed", refresh)
  }, [open, load])
  return <Popover open={open} onOpenChange={value => { setOpen(value); if (value) void load() }}>
    <PopoverTrigger render={<Button variant="ghost" size="icon" className="relative size-10" />} aria-label={t("badge", { count })}>
      <Bell aria-hidden="true" />
      {count > 0 && <span className="absolute -end-1 -top-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground" aria-hidden="true">{count > 99 ? "99+" : count}</span>}
    </PopoverTrigger>
    <PopoverContent align="end" sideOffset={12} className="w-[min(24rem,calc(100vw-2rem))] p-0" dir={locale === "ar" ? "rtl" : "ltr"}>
      <Card>
        <CardHeader><PopoverTitle>{t("title")}</PopoverTitle><PopoverDescription>{t("recent")}</PopoverDescription></CardHeader>
        <CardContent className="max-h-[min(26rem,60vh)] overflow-y-auto" aria-busy={loading}>
          {loading && !inbox && <div role="status" aria-label={t("loading")} className="flex flex-col gap-3"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>}
          {error ? <div role="alert"><p>{t("error")}</p><Button variant="outline" onClick={load}>{t("retry")}</Button></div> : inbox?.items.length === 0 ? <p className="py-8 text-center text-muted-foreground">{t("empty")}</p> : <ul className="flex flex-col gap-2">
            {inbox?.items.slice(0,5).map(item => <li key={item.id}>
              <Link href={`/${role}/notifications?open=${item.id}`} onClick={() => setOpen(false)} className="flex gap-3 rounded-lg p-3 hover:bg-muted focus-visible:outline-ring">
                <Bell className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className={!item.read_at ? "font-semibold" : ""}>{item.template_key === "materialAssigned" ? t("materialAssigned", { title: item.template_data.title ?? "" }) : t("newUpdate")}</span>
                  <span className="text-sm text-muted-foreground">{item.template_data.source}</span>
                  <time dateTime={item.created_at} className="text-xs text-muted-foreground">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.created_at))}</time>
                  {!item.read_at && <span className="text-xs font-semibold text-primary">{t("unread")}</span>}
                </div>
              </Link>
            </li>)}
          </ul>}
        </CardContent>
        <CardFooter><Link href={`/${role}/notifications`} onClick={() => setOpen(false)} className={buttonVariants({ variant: "outline", className: "w-full" })}>{t("viewAll")}</Link></CardFooter>
      </Card>
    </PopoverContent>
  </Popover>
}
