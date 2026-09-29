import { getBackendAccessToken, getSessionUser } from "@/features/auth/server/dal";

export async function GET(_request: Request, { params }: { params: Promise<{ assignmentId: string }> }) {
  const [user, token, { assignmentId }] = await Promise.all([getSessionUser(), getBackendAccessToken(), params]);
  if (!user || !token || !["student", "teacher"].includes(user.role)) return new Response("Unauthorized", { status: 401 });
  const origin = (process.env.API_URL ?? process.env.AUTH_API_URL)?.replace(/\/$/, "");
  if (!origin) return new Response("API unavailable", { status: 503 });
  const response = await fetch(`${origin}/study-materials/${encodeURIComponent(assignmentId)}/download`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(20000) });
  if (!response.ok || !response.body) return new Response("Material unavailable", { status: response.status || 404 });
  const headers = new Headers({ "Content-Type": response.headers.get("content-type") ?? "application/octet-stream", "Cache-Control": "private, no-store" });
  const disposition = response.headers.get("content-disposition");
  if (disposition) headers.set("Content-Disposition", disposition);
  return new Response(response.body, { status: 200, headers });
}
