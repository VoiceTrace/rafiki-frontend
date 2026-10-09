import { NotificationsRoute } from "@/features/notifications/server/page"
export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  return <NotificationsRoute params={params} role="teacher" />
}
