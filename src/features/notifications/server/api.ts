import "server-only"
import { getBackendAccessToken, getSessionUser } from "@/features/auth/server/dal"

export async function notificationRequest(path: string, init?: RequestInit) {
  const user = await getSessionUser()
  const token = await getBackendAccessToken()
  if (!user || !token) return Response.json({ error: "unauthorized" }, { status: 401 })
  const origin = (process.env.API_URL ?? process.env.AUTH_API_URL)?.replace(/\/$/, "")
  if (!origin) return Response.json({ error: "unavailable" }, { status: 503 })
  try {
    return await fetch(`${origin}/notifications${path}`, {
      ...init, cache: "no-store", signal: AbortSignal.timeout(15000),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503 })
  }
}
