import { redirect } from "next/navigation"

export default function Page() {
  redirect("/student/study-cave?phase=homework")
}
