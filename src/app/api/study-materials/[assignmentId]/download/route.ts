import { getBackendAccessToken, getSessionUser } from "@/features/auth/server/dal";

export async function GET(request: Request, { params }: { params: Promise<{ assignmentId: string }> }) {
  const [user, token, { assignmentId }] = await Promise.all([getSessionUser(), getBackendAccessToken(), params]);
  if (!user || !token || !["student", "teacher"].includes(user.role)) return new Response("Unauthorized", { status: 401 });
  const origin = (process.env.API_URL ?? process.env.AUTH_API_URL)?.replace(/\/$/, "");
  if (!origin) return new Response("API unavailable", { status: 503 });
  const upstreamUrl = new URL(`${origin}/study-materials/${encodeURIComponent(assignmentId)}/download`);
  if (new URL(request.url).searchParams.get("inline") === "true") upstreamUrl.searchParams.set("inline", "true");
  const range = request.headers.get("range");
  const response = await fetch(upstreamUrl, { headers: { Authorization: `Bearer ${token}`, ...(range ? { Range: range } : {}) }, cache: "no-store", signal: AbortSignal.timeout(20000) });
  if (!response.ok || !response.body) return new Response("Material unavailable", { status: response.status || 404 });
  const headers = new Headers({ "Content-Type": response.headers.get("content-type") ?? "application/octet-stream", "Cache-Control": "private, no-store" });
  const disposition = response.headers.get("content-disposition");
  if (disposition) headers.set("Content-Disposition", disposition);
  for (const name of ["content-length", "content-range", "accept-ranges"]) { const value = response.headers.get(name); if (value) headers.set(name, value); }
  return new Response(response.body, { status: response.status, headers });
}
