"use server"

import { getBackendAccessToken } from "@/features/auth/server/dal"
import { updateMe, uploadAvatar, removeAvatar } from "@/lib/api"
import { profileSchema } from "@/features/profile/schemas"

export type ProfileActionState =
  | { status: "idle" }
  | { status: "success"; message: string; avatarUrl?: string | null }
  | { status: "error"; message: string }

export async function updateProfileAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const accessToken = await getBackendAccessToken()
  if (!accessToken) return { status: "error", message: "unauthenticated" }

  const raw = {
    full_name: formData.get("full_name"),
    password: formData.get("password"),
  }
  const parsed = profileSchema.safeParse(raw)
  if (!parsed.success) {
    return { status: "error", message: "validation" }
  }

  const data: { full_name?: string; password?: string } = {
    full_name: parsed.data.full_name,
  }
  if (parsed.data.password && parsed.data.password.length >= 8) {
    data.password = parsed.data.password
  }

  try {
    await updateMe(accessToken, data)
    return { status: "success", message: "saved" }
  } catch {
    return { status: "error", message: "server" }
  }
}

export async function uploadAvatarAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const accessToken = await getBackendAccessToken()
  if (!accessToken) return { status: "error", message: "unauthenticated" }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "no_file" }
  }

  try {
    const result = await uploadAvatar(accessToken, file)
    return { status: "success", message: "avatar_updated", avatarUrl: result.avatar_url }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "upload_failed"
    return { status: "error", message: msg }
  }
}

export async function removeAvatarAction(
  _prev: ProfileActionState,
  _formData: FormData,
): Promise<ProfileActionState> {
  const accessToken = await getBackendAccessToken()
  if (!accessToken) return { status: "error", message: "unauthenticated" }

  try {
    await removeAvatar(accessToken)
    return { status: "success", message: "avatar_removed", avatarUrl: null }
  } catch {
    return { status: "error", message: "server" }
  }
}
