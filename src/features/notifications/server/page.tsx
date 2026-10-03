import { verifySession } from "@/features/auth/server/dal"
import { notificationRequest } from "./api"
import { NotificationPage } from "../components/notification-page"
import type { Inbox } from "../types"

export async function NotificationsRoute({ params, role }: { params: Promise<{ locale: string }>; role: "student" | "teacher" }) {
  const { locale } = await params
  await verifySession(locale, role)
  const response = await notificationRequest("")
  const initial = response.ok ? await response.json() as Inbox : null
  return <NotificationPage initial={initial} />
}
