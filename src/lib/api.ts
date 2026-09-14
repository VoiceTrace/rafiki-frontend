import type { User } from "@/types/user"

const API_URL = process.env.API_URL

function authHeaders(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` }
}

export async function getMe(accessToken: string): Promise<User> {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: authHeaders(accessToken),
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to fetch profile")
  return res.json() as Promise<User>
}

export async function updateMe(
  accessToken: string,
  data: { full_name?: string; password?: string },
): Promise<User> {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: { ...authHeaders(accessToken), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update profile")
  return res.json() as Promise<User>
}

export async function uploadAvatar(accessToken: string, file: File): Promise<User> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${API_URL}/users/me/avatar`, {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: form,
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { detail?: unknown } | null
    throw new Error(res.status === 413 ? "too_large" : res.status === 400 ? "bad_type" : "upload_failed")
  }
  return res.json() as Promise<User>
}

export async function removeAvatar(accessToken: string): Promise<User> {
  const res = await fetch(`${API_URL}/users/me/avatar`, {
    method: "DELETE",
    headers: authHeaders(accessToken),
  })
  if (!res.ok) throw new Error("Failed to remove avatar")
  return res.json() as Promise<User>
}
