"use client"
import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { NotificationPreview } from "./notification-preview"
import { enablePush, listenPush, pushConfigured } from "../firebase-client"

export function NotificationBell({ role }: { role: "student" | "teacher" }) {
  const t = useTranslations("notifications")
  const locale = useLocale()
  const router = useRouter()
  const [count, setCount] = useState(0)
  useEffect(() => {
    let stopped = false
    let unsubscribe: (() => void) | undefined
    let timer: ReturnType<typeof setTimeout>
    let etag = ""
    let failures = 0
    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("rafiqi-notifications") : null
    const refresh = async () => {
      if (stopped || document.hidden) return
      try {
        const response = await fetch("/api/notifications/unread-count", { headers: etag ? { "If-None-Match": etag } : {} })
        if (response.ok) {
          const body: { count: number } = await response.json()
          if (!stopped) setCount(body.count)
          etag = response.headers.get("etag") ?? ""
          channel?.postMessage({ count: body.count })
          window.dispatchEvent(new Event("rafiqi-inbox-changed"))
        } else if (response.status !== 304) throw new Error()
        failures = 0
      } catch { failures = Math.min(failures + 1, 4) }
    }
    const poll = async () => {
      // Web Locks prevents simultaneous requests across tabs; each request stays short.
      if (navigator.locks) await navigator.locks.request("rafiqi-unread-poll", { ifAvailable: true }, async lock => {
        if (lock && Date.now() - Number(localStorage.getItem("rafiqi-last-poll") ?? 0) >= 55000) {
          await refresh(); localStorage.setItem("rafiqi-last-poll", String(Date.now()))
        }
      })
      else await refresh()
      if (!stopped) timer = setTimeout(poll, 60000 * 2 ** failures)
    }
    const reconcile = () => { void refresh() }
    channel?.addEventListener("message", event => {
      if (typeof event.data?.count === "number") { setCount(event.data.count); window.dispatchEvent(new Event("rafiqi-inbox-changed")) }
    })
    void refresh()
    void poll()
    window.addEventListener("focus", reconcile)
    window.addEventListener("online", reconcile)
    window.addEventListener("rafiqi-notifications-changed", reconcile)
    document.addEventListener("visibilitychange", reconcile)
    let startingPush = false
    const startPush = () => {
      if (!localStorage.getItem("rafiqi-push-enabled")) { unsubscribe?.(); unsubscribe = undefined; return }
      if (startingPush || unsubscribe || !pushConfigured || typeof Notification === "undefined" || Notification.permission !== "granted") return
      startingPush = true
      void listenPush(id => {
        if (document.hidden) return
        void refresh()
        if (localStorage.getItem("rafiqi-last-push") !== id) {
          localStorage.setItem("rafiqi-last-push", id)
          toast(t("newUpdate"), {
            id: `notification-${id}`, duration: 10000,
            icon: <Bell aria-hidden="true" />,
            action: { label: t("view"), onClick: () => router.push(`/${role}/notifications?open=${id}`) },
          })
        }
      }).then(stop => { if (stopped) stop(); else unsubscribe = stop }).catch(() => {}).finally(() => { startingPush = false })
    }
    startPush()
    if (localStorage.getItem("rafiqi-push-enabled") && typeof Notification !== "undefined" && Notification.permission === "granted") void enablePush(locale, false).catch(() => {})
    window.addEventListener("rafiqi-push-changed", startPush)
    return () => {
      stopped = true; clearTimeout(timer); unsubscribe?.(); channel?.close()
      window.removeEventListener("focus", reconcile); window.removeEventListener("online", reconcile)
      window.removeEventListener("rafiqi-notifications-changed", reconcile)
      document.removeEventListener("visibilitychange", reconcile)
      window.removeEventListener("rafiqi-push-changed", startPush)
    }
  }, [locale, role, router, t])
  return <NotificationPreview role={role} count={count} />
}
