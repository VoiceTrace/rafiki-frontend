import { TeacherLessonPage } from "@/features/teacher-lesson/components/teacher-lesson-page";
import { loadTeacherLessonReview } from "@/features/teacher-lesson/server/teacher-lesson-review-api";

export default async function Page({params, searchParams}: PageProps<"/[locale]/teacher/teaching/lesson">) {
  const [{locale}, query] = await Promise.all([params, searchParams]);
  const classId = typeof query.class_id === "string" ? query.class_id : undefined;
  const lessonId = typeof query.lesson_id === "string" ? query.lesson_id : "newton-third-law";
  const data = await loadTeacherLessonReview(locale, classId, lessonId);
  return <TeacherLessonPage reviewData={data} initialTab={query.phase === "after" ? "after" : undefined}/>;
}
