"use client"
import { useCallback, useEffect, useState, useSyncExternalStore } from "react"
import { Bell, CheckCheck } from "lucide-react"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import type { Inbox, NotificationItem } from "../types"
import { disablePush, enablePush, pushConfigured } from "../firebase-client"

function deviceState() {
  if (!pushConfigured) return "unavailable"
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return "unsupported"
  if (Notification.permission === "denied") return "denied"
  return localStorage.getItem("rafiqi-push-enabled") ? "enabled" : "disabled"
}
function subscribeDevice(callback: () => void) {
  window.addEventListener("focus", callback)
  window.addEventListener("storage", callback)
  return () => { window.removeEventListener("focus", callback); window.removeEventListener("storage", callback) }
}

export function NotificationPage({ initial }: { initial: Inbox | null }) {
  const t = useTranslations("notifications")
  const locale = useLocale()
  const router = useRouter()
  const params = useSearchParams()
  const [inbox, setInbox] = useState(initial)
  const [unread, setUnread] = useState(false)
  const [loading, setLoading] = useState(!initial)
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)
  const device = useSyncExternalStore(subscribeDevice, deviceState, () => "disabled")
  const [pushOverride, setPushState] = useState<string | null>(null)
  const pushState = pushOverride ?? device
  const [pushBusy, setPushBusy] = useState(false)
  const load = useCallback(async (cursor?: string) => {
    try {
      const response = await fetch(`/api/notifications?unread_only=${unread}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`)
      if (!response.ok) throw new Error()
      const next: Inbox = await response.json()
      setError(false)
      setInbox(previous => cursor && previous ? { ...next, items: [...previous.items, ...next.items] } : next)
    } catch { setError(true) } finally { setLoading(false) }
  }, [unread])
  useEffect(() => {
    let active = true
    const refresh = () => {
      fetch(`/api/notifications?unread_only=${unread}`).then(async response => {
        if (!response.ok) throw new Error()
        const next: Inbox = await response.json()
        if (active) { setInbox(next); setLoading(false); setError(false) }
      }).catch(() => { if (active) { setError(true); setLoading(false) } })
    }
    refresh()
    window.addEventListener("rafiqi-inbox-changed", refresh)
    return () => { active = false; window.removeEventListener("rafiqi-inbox-changed", refresh) }
  }, [unread])
  const open = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/destination`)
      setBusy(true); setError(false)
      if (!response.ok) throw new Error()
      const destination: { path: string } = await response.json()
      const read = await fetch(`/api/notifications/${id}/read`, { method: "PATCH" })
      if (!read.ok) throw new Error()
      window.dispatchEvent(new Event("rafiqi-notifications-changed"))
      router.push(destination.path)
    } catch { setError(true); toast.error(t("error")) } finally { setBusy(false) }
  }, [router, t])
  const openId = params.get("open")
  useEffect(() => {
    if (!openId || !/^[0-9a-f-]{36}$/.test(openId)) return
    let active = true
    fetch(`/api/notifications/${openId}/destination`).then(async response => {
      if (!response.ok) throw new Error()
      const destination: { path: string } = await response.json()
      if (!active) return
      const read = await fetch(`/api/notifications/${openId}/read`, { method: "PATCH" })
      if (!read.ok) throw new Error()
      if (active) { window.dispatchEvent(new Event("rafiqi-notifications-changed")); router.push(destination.path) }
    }).catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [openId, router])
  async function readAll() {
    if (!inbox) return
    setBusy(true)
    try {
      const response = await fetch("/api/notifications/read-all", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cutoff: inbox.cutoff }) })
      if (!response.ok) throw new Error()
      await load(); window.dispatchEvent(new Event("rafiqi-notifications-changed"))
      toast.success(t("markedRead"))
    } catch { setError(true); toast.error(t("error")) } finally { setBusy(false) }
  }
  async function togglePush() {
    setPushBusy(true)
    try {
      if (pushState === "enabled") { await disablePush(); setPushState("disabled"); toast.success(t("push.disabledDevice")) }
      else { await enablePush(locale); setPushState("enabled"); toast.success(t("push.enabled")) }
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : "failed"
      setPushState(["denied", "unsupported", "unavailable"].includes(message) ? message : "failed")
      toast.error(t(`push.${["denied", "unsupported", "unavailable"].includes(message) ? message : "failed"}`))
    } finally { setPushBusy(false) }
  }
  function description(item: NotificationItem) {
    return item.template_key === "materialAssigned" ? t("materialAssigned", { title: item.template_data.title ?? "" }) : t("newUpdate")
  }
  return <section className="mx-auto max-w-4xl space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-2xl font-bold">{t("title")}</h1><p className="mt-1 text-muted-foreground">{t("subtitle")}</p></div>
      <Button variant="outline" onClick={readAll} disabled={busy || !inbox?.items.some(item => !item.read_at)}><CheckCheck aria-hidden="true" />{t("readAll")}</Button>
    </header>
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-5">
      <div><h2 className="font-semibold">{t("browserTitle")}</h2><p role="status" className="mt-1 text-sm text-muted-foreground">{t(`push.${pushState}`)}</p></div>
      <Button onClick={togglePush} disabled={pushBusy || ["denied", "unsupported", "unavailable"].includes(pushState)}>{pushBusy ? t("saving") : pushState === "enabled" ? t("disable") : t("enable")}</Button>
    </div>
    <div className="flex gap-2" aria-label={t("filters")}>
      <Button variant={!unread ? "default" : "outline"} aria-pressed={!unread} onClick={() => setUnread(false)}>{t("all")}</Button>
      <Button variant={unread ? "default" : "outline"} aria-pressed={unread} onClick={() => setUnread(true)}>{t("unread")}</Button>
    </div>
    {error && <div role="alert" className="rounded-xl border border-destructive p-4"><p>{t("error")}</p><Button variant="outline" onClick={() => load()}>{t("retry")}</Button></div>}
    {loading && !inbox && <p role="status">{t("loading")}</p>}
    {inbox?.items.length === 0 && !loading && <div className="rounded-2xl border bg-card p-12 text-center"><Bell className="mx-auto mb-3 size-8 text-muted-foreground" aria-hidden="true" /><h2 className="font-semibold">{unread ? t("noUnread") : t("empty")}</h2></div>}
    <ul className="space-y-3" aria-busy={loading}>
      {inbox?.items.map(item => <li key={item.id} className={`rounded-2xl border bg-card p-5 ${!item.read_at ? "border-primary/40" : ""}`}>
        <div className="flex items-start gap-3"><Bell className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" /><div className="min-w-0 flex-1">
          <p className={!item.read_at ? "font-semibold" : ""}>{description(item)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{item.template_data.source}</p>
          <time dateTime={item.created_at} className="text-xs text-muted-foreground">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.created_at))}</time>
          {!item.read_at && <span className="ms-2 text-xs font-semibold text-primary">{t("unread")}</span>}
        </div><Button variant="outline" disabled={busy} onClick={() => open(item.id)}>{t("view")}</Button></div>
      </li>)}
    </ul>
    {inbox?.next_cursor && <Button variant="outline" disabled={loading} onClick={() => load(inbox.next_cursor ?? undefined)}>{t("more")}</Button>}
  </section>
}
