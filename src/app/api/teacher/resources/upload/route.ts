import { getBackendAccessToken, getSessionUser } from "@/features/auth/server/dal";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 22 * 1024 * 1024) return new Response("Upload too large", { status: 413 });
  const [user, token] = await Promise.all([getSessionUser(), getBackendAccessToken()]);
  if (user?.role !== "teacher" || !token) return new Response("Unauthorized", { status: 401 });
  const origin = (process.env.API_URL ?? process.env.AUTH_API_URL)?.replace(/\/$/, "");
  if (!origin) return new Response("API unavailable", { status: 503 });
  const form = await request.formData();
  const response = await fetch(`${origin}/teacher/resources/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form, cache: "no-store", signal: AbortSignal.timeout(30000) });
  return new Response(await response.arrayBuffer(), { status: response.status, headers: { "Content-Type": response.headers.get("content-type") ?? "application/json", "Cache-Control": "private, no-store" } });
}
