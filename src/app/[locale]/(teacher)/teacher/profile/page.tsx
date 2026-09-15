import { redirect } from "next/navigation"
import { getBackendAccessToken, verifySession } from "@/features/auth/server/dal"
import { fetchMyProfile } from "@/features/profile/server/queries"
import { ProfileForm } from "@/features/profile/components/profile-form"

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const safeLocale = locale === "ar" ? "ar" : "en"
  await verifySession(safeLocale, "teacher")
  const accessToken = await getBackendAccessToken()
  if (!accessToken) redirect(`/${safeLocale}/login`)

  const user = await fetchMyProfile(accessToken)
  const avatarBaseUrl = (process.env.API_URL ?? process.env.AUTH_API_URL ?? "").replace(/\/$/, "")

  return (
    <div className="py-4">
      <ProfileForm user={user} avatarBaseUrl={avatarBaseUrl} />
    </div>
  )
}
