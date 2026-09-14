import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { fetchMyProfile } from "@/features/profile/server/queries"
import { ProfileForm } from "@/features/profile/components/profile-form"

export default async function TeacherProfilePage() {
  const session = await auth()
  if (!session?.user?.access_token) redirect("/api/auth/signin")

  const user = await fetchMyProfile(session.user.access_token)

  return (
    <div className="py-4">
      <ProfileForm user={user} />
    </div>
  )
}
