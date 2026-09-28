import { TeacherStudentDetailPage } from "@/features/teacher-students/components/teacher-student-detail-page";
import { loadTeacherStudentDetail } from "@/features/teacher-students/server/teacher-students-api";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string; studentId: string }>; searchParams: Promise<{ class_id?: string }> }) {
  const [{ locale, studentId }, query] = await Promise.all([params, searchParams]);
  const data = await loadTeacherStudentDetail(locale === "ar" ? "ar" : "en", studentId, query.class_id);
  return <TeacherStudentDetailPage data={data} />;
}
