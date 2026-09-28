import "server-only";
import { getBackendAccessToken, getSessionUser } from "@/features/auth/server/dal";
import type { ClassMastery, ClassMisconceptions, TeacherClass } from "@/features/teacher-students/types";

type Filters = { classId?: string; from?: string; to?: string };
export type TeacherInsightsData = { classes: TeacherClass[]; selectedClass: TeacherClass | null; mastery: ClassMastery | null; misconceptions: ClassMisconceptions | null; error: boolean };

async function request<T>(path: string): Promise<T> {
  const [user, token] = await Promise.all([getSessionUser(), getBackendAccessToken()]);
  if (!token || user?.role !== "teacher") throw new Error("teacher_auth_required");
  const origin = (process.env.API_URL ?? process.env.AUTH_API_URL)?.replace(/\/$/, "");
  if (!origin) throw new Error("api_unavailable");
  const response = await fetch(origin + path, { cache: "no-store", headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error("teacher_insights_failed");
  return response.json() as Promise<T>;
}

export async function loadTeacherInsights(locale: string, filters: Filters): Promise<TeacherInsightsData> {
  try {
    const classes = await request<TeacherClass[]>("/teacher/classes");
    const selectedClass = classes.find((item) => item.id === filters.classId) ?? classes[0] ?? null;
    if (!selectedClass) return { classes, selectedClass: null, mastery: null, misconceptions: null, error: false };
    const query = new URLSearchParams({ locale });
    if (filters.from) query.set("from", filters.from);
    if (filters.to) query.set("to", filters.to);
    const suffix = `?${query.toString()}`;
    const [mastery, misconceptions] = await Promise.all([
      request<ClassMastery>(`/teacher/classes/${selectedClass.id}/mastery${suffix}`),
      request<ClassMisconceptions>(`/teacher/classes/${selectedClass.id}/misconceptions${suffix}`),
    ]);
    return { classes, selectedClass, mastery, misconceptions, error: false };
  } catch {
    return { classes: [], selectedClass: null, mastery: null, misconceptions: null, error: true };
  }
}
