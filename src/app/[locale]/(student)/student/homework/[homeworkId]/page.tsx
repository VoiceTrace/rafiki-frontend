import { redirect } from "next/navigation"

interface Props {
  params: Promise<{ homeworkId: string }>
}

export default async function Page({ params }: Props) {
  const { homeworkId } = await params
  redirect(`/student/study-cave?phase=homework&homeworkId=${encodeURIComponent(homeworkId)}`)
}
