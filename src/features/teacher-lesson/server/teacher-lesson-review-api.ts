import "server-only";
import { getBackendAccessToken, getSessionUser } from "@/features/auth/server/dal";
import type { ClassMastery, ClassMisconceptions, ReviewSessionPage, TeacherClass } from "@/features/teacher-students/types";

export type TeacherLessonReviewData = {
  classes: TeacherClass[];
  selectedClass: TeacherClass | null;
  lessonId: string;
  mastery: ClassMastery | null;
  misconceptions: ClassMisconceptions | null;
  sessions: ReviewSessionPage | null;
  error: boolean;
};

async function request<T>(path: string): Promise<T> {
  const [user, token] = await Promise.all([getSessionUser(), getBackendAccessToken()]);
  if (!token || user?.role !== "teacher") throw new Error("teacher_auth_required");
  const origin = (process.env.API_URL ?? process.env.AUTH_API_URL)?.replace(/\/$/, "");
  if (!origin) throw new Error("api_unavailable");
  const response = await fetch(origin + path, {
    cache: "no-store",
    headers: {Authorization: `Bearer ${token}`},
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("teacher_lesson_review_failed");
  return response.json() as Promise<T>;
}

export async function loadTeacherLessonReview(
  locale: string,
  classId?: string,
  lessonId = "newton-third-law",
): Promise<TeacherLessonReviewData> {
  try {
    const classes = await request<TeacherClass[]>("/teacher/classes");
    const selectedClass = classes.find((item) => item.id === classId)
      ?? classes.find((item) => item.subject_id === "physics")
      ?? classes[0]
      ?? null;
    if (!selectedClass) {
      return {classes, selectedClass: null, lessonId, mastery: null, misconceptions: null, sessions: null, error: false};
    }
    const query = new URLSearchParams({locale, lesson_id: lessonId});
    const suffix = `?${query.toString()}`;
    const [mastery, misconceptions, sessions] = await Promise.all([
      request<ClassMastery>(`/teacher/classes/${selectedClass.id}/mastery${suffix}`),
      request<ClassMisconceptions>(`/teacher/classes/${selectedClass.id}/misconceptions${suffix}`),
      request<ReviewSessionPage>(`/teacher/classes/${selectedClass.id}/review-sessions${suffix}&page_size=50`),
    ]);
    return {classes, selectedClass, lessonId, mastery, misconceptions, sessions, error: false};
  } catch {
    return {classes: [], selectedClass: null, lessonId, mastery: null, misconceptions: null, sessions: null, error: true};
  }
}
