import { TeacherStudentsPage } from "@/features/teacher-students/components/teacher-students-page";
import { loadTeacherStudents } from "@/features/teacher-students/server/teacher-students-api";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ class_id?: string; q?: string }> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const data = await loadTeacherStudents(locale === "ar" ? "ar" : "en", query.class_id);
  return <TeacherStudentsPage data={data} query={query.q ?? ""} />;
}
