import { getMe } from "@/lib/api"
import type { User } from "@/types/user"

export async function fetchMyProfile(accessToken: string): Promise<User> {
  return getMe(accessToken)
}
