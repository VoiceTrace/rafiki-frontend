import { z } from "zod"
import { notificationRequest } from "@/features/notifications/server/api"

type Context = { params: Promise<{ path?: string[] }> }
const uuid = z.string().uuid()

async function handle(request: Request, context: Context) {
  const { path = [] } = await context.params
  const target = path.join("/")
  const method = request.method
  const valid = (method === "GET" && (target === "" || target === "unread-count" || /^[-\w]+\/destination$/.test(target))) ||
    (method === "PATCH" && path.length === 2 && uuid.safeParse(path[0]).success && path[1] === "read") ||
    (method === "POST" && target === "read-all") ||
    (["PUT", "DELETE"].includes(method) && path.length === 2 && path[0] === "installations" && uuid.safeParse(path[1]).success)
  if (!valid) return new Response(null, { status: 404 })
  if (method !== "GET" && request.headers.get("origin") !== new URL(request.url).origin) {
    return new Response(null, { status: 403 })
  }
  let body: string | undefined
  if (["PUT", "POST", "PATCH"].includes(method)) {
    if (Number(request.headers.get("content-length") ?? 0) > 8192) return new Response(null, { status: 413 })
    const raw = await request.text()
    if (raw.length > 8192) return new Response(null, { status: 413 })
    try {
      if (method === "PUT") body = JSON.stringify(z.object({ fid: z.string().regex(/^[A-Za-z0-9_-]{22}$/), locale: z.enum(["en", "ar"]) }).parse(JSON.parse(raw)))
      else if (method === "POST") body = JSON.stringify(z.object({ cutoff: z.iso.datetime({ offset: true }) }).parse(JSON.parse(raw)))
    } catch { return new Response(null, { status: 422 }) }
  }
  const url = new URL(request.url)
  const response = await notificationRequest(`/${target}${url.search}`, { method, body })
  const text = await response.text()
  const headers = { "Content-Type": "application/json", "Cache-Control": "private, no-cache", Vary: "Cookie" }
  if (method === "GET" && target === "unread-count" && response.ok) {
    const etag = `"${text}"`.replace(/[\r\n]/g, "")
    // Encode the JSON count so quotes in the response never break the ETag.
    const safeTag = `"${Buffer.from(etag).toString("base64url")}"`
    if (request.headers.get("if-none-match") === safeTag) return new Response(null, { status: 304, headers: { ...headers, ETag: safeTag } })
    return new Response(text, { status: response.status, headers: { ...headers, ETag: safeTag } })
  }
  return new Response(text, { status: response.status, headers: { ...headers, "Cache-Control": "private, no-store" } })
}

export const GET = handle
export const POST = handle
export const PATCH = handle
export const PUT = handle
export const DELETE = handle
