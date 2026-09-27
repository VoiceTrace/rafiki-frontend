import "server-only";
import { getBackendAccessToken, getSessionUser } from "@/features/auth/server/dal";
import type { ClassMastery, EnrolledStudent, ReviewSessionPage, StudentMastery, TeacherClass, TeacherStudentDetailData, TeacherStudentsData } from "../types";

class TeacherApiError extends Error {}

async function teacherRequest<T>(path: string): Promise<T> {
  const [user, token] = await Promise.all([getSessionUser(), getBackendAccessToken()]);
  if (!token || user?.role !== "teacher") throw new TeacherApiError();
  const origin = (process.env.API_URL ?? process.env.AUTH_API_URL)?.replace(/\/$/, "");
  if (!origin) throw new TeacherApiError();
  const response = await fetch(origin + path, { cache: "no-store", headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new TeacherApiError();
  return response.json() as Promise<T>;
}

export async function loadTeacherStudents(locale: string, classId?: string): Promise<TeacherStudentsData> {
  try {
    const classes = await teacherRequest<TeacherClass[]>("/teacher/classes");
    const selectedClass = classes.find((item) => item.id === classId) ?? classes[0] ?? null;
    if (!selectedClass) return { classes, selectedClass: null, roster: [], mastery: null, error: false };
    const query = `?locale=${locale}`;
    const [roster, mastery] = await Promise.all([
      teacherRequest<EnrolledStudent[]>(`/teacher/classes/${selectedClass.id}/students`),
      teacherRequest<ClassMastery>(`/teacher/classes/${selectedClass.id}/mastery${query}`),
    ]);
    return { classes, selectedClass, roster, mastery, error: false };
  } catch {
    return { classes: [], selectedClass: null, roster: [], mastery: null, error: true };
  }
}

export async function loadTeacherStudentDetail(locale: string, studentId: string, classId?: string): Promise<TeacherStudentDetailData> {
  try {
    const classes = await teacherRequest<TeacherClass[]>("/teacher/classes");
    const selectedClass = classes.find((item) => item.id === classId) ?? classes[0] ?? null;
    if (!selectedClass) return { classes, selectedClass: null, mastery: null, sessions: null, error: false };
    const query = `class_id=${selectedClass.id}&locale=${locale}`;
    const [mastery, sessions] = await Promise.all([
      teacherRequest<StudentMastery>(`/teacher/students/${encodeURIComponent(studentId)}/mastery?${query}`),
      teacherRequest<ReviewSessionPage>(`/teacher/students/${encodeURIComponent(studentId)}/review-sessions?${query}&page_size=10`),
    ]);
    return { classes, selectedClass, mastery, sessions, error: false };
  } catch {
    return { classes: [], selectedClass: null, mastery: null, sessions: null, error: true };
  }
}
