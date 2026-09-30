import "server-only";
import { getBackendAccessToken, getSessionUser } from "@/features/auth/server/dal";

export type ResourceType = "question" | "article" | "link" | "image" | "video" | "file";
export type LibraryResource = { id: string; type: ResourceType; title: string; description: string; question: string | null; answer: string | null; source_url: string | null; original_filename: string | null; media_type: string | null; byte_size: number | null; created_at: string; assigned_class_ids: string[]; download_url?: string | null };
export type ResourceClass = { id: string; name: string; grade_id: string; grade_title: string; student_count: number };
export type Grade = { id: string; title: string };
export type CurriculumLesson = { id: string; title: string; chapter_id: string; chapter: string; subject_id: string; subject: string; grade_id: string };
export type SchoolStudent = { id: string; full_name: string; email: string };

function sortResourceClasses(classes: ResourceClass[], locale: string) {
  const gradeNumber = (gradeId: string) => Number(gradeId.match(/\d+/)?.[0] ?? Number.MAX_SAFE_INTEGER);
  return [...classes].sort((a, b) => gradeNumber(a.grade_id) - gradeNumber(b.grade_id) || a.name.localeCompare(b.name, locale, { numeric: true, sensitivity: "base" }));
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const [user, token] = await Promise.all([getSessionUser(), getBackendAccessToken()]);
  if (!token || user?.role !== "teacher") throw new Error("teacher_auth_required");
  const origin = (process.env.API_URL ?? process.env.AUTH_API_URL)?.replace(/\/$/, "");
  if (!origin) throw new Error("api_unavailable");
  const response = await fetch(origin + path, { ...init, cache: "no-store", headers: { Authorization: `Bearer ${token}`, ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...init?.headers }, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error("resource_request_failed");
  return response.json() as Promise<T>;
}

export async function loadTeacherResources(locale: string) {
  const [resources, classes, grades, students] = await Promise.all([
    request<LibraryResource[]>("/teacher/resources"),
    request<ResourceClass[]>(`/teacher/classes?locale=${locale}`),
    request<Grade[]>(`/teacher/resource-grades?locale=${locale}`),
    request<SchoolStudent[]>("/users?role=student"),
  ]);
  const gradeLessons = await Promise.all(grades.map(async (grade) => [grade.id, await request<CurriculumLesson[]>(`/teacher/resource-grades/${grade.id}/lessons?locale=${locale}`)] as const));
  return { resources: resources.map((item) => ({ ...item, download_url: item.original_filename ? `/api/teacher/resources/${encodeURIComponent(item.id)}/download` : null })), classes: sortResourceClasses(classes, locale), grades, students: students.map(({ id, full_name, email }) => ({ id, full_name, email })), curriculum: Object.fromEntries(gradeLessons) as Record<string, CurriculumLesson[]> };
}

export async function saveLibraryResource(input: { type: ResourceType; title: string; description: string; question?: string; answer?: string; source_url?: string }) {
  return request<LibraryResource>("/teacher/resources", { method: "POST", body: JSON.stringify(input) });
}

export async function uploadLibraryResource(input: FormData) {
  return request<LibraryResource>("/teacher/resources/upload", { method: "POST", body: input });
}

export async function assignLibraryResource(input: { class_id: string; lesson_id: string; resource_id: string; required: boolean }) {
  return request("/teacher/lesson-materials", { method: "POST", body: JSON.stringify(input) });
}

export async function createTeacherClass(input: { name: string; grade_id: string }) {
  return sortResourceClasses(await request<ResourceClass[]>("/teacher/classes", { method: "POST", body: JSON.stringify(input) }), "en");
}

export async function loadClassRoster(classId: string) {
  return request<SchoolStudent[]>(`/teacher/classes/${classId}/students`);
}
export async function addClassStudent(classId: string, studentId: string) {
  return request<SchoolStudent[]>(`/teacher/classes/${classId}/students/${studentId}`, { method: "POST" });
}

export async function loadStudentMaterials(lessonId: string, locale: string) {
  const user = await getSessionUser();
  const token = await getBackendAccessToken();
  if (!token || user?.role !== "student") return [];
  const origin = (process.env.API_URL ?? process.env.AUTH_API_URL)?.replace(/\/$/, "");
  if (!origin) return [];
  const response = await fetch(`${origin}/study-lessons/${encodeURIComponent(lessonId)}/materials?locale=${locale}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(12000) });
  if (!response.ok) return [];
  const materials = await response.json() as StudentMaterial[];
  return materials.map((item) => ({ ...item, download_url: item.download_url ? `/api/study-materials/${item.id}/download` : null }));
}

export async function loadStudentResourceLibrary(locale: string) {
  const user = await getSessionUser();
  const token = await getBackendAccessToken();
  if (!token || user?.role !== "student") return null;
  const origin = (process.env.API_URL ?? process.env.AUTH_API_URL)?.replace(/\/$/, "");
  if (!origin) return null;
  try {
    const response = await fetch(`${origin}/student/resources?locale=${locale}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return null;
    const materials = await response.json() as StudentMaterial[];
    return materials.map((item) => ({ ...item, download_url: item.download_url ? `/api/study-materials/${item.id}/download` : null }));
  } catch {
    return null;
  }
}

export type StudentMaterial = {
  id: string;
  lesson_id: string;
  type: ResourceType;
  title: string;
  description: string;
  question: string | null;
  source_url: string | null;
  download_url: string | null;
  original_filename: string | null;
  media_type: string | null;
  byte_size: number | null;
  required: boolean;
  completed: boolean;
  grade_id?: string;
  grade_title?: string;
  class_id?: string;
  class_name?: string;
  subject_id?: string;
  subject_title?: string;
  chapter_id?: string;
  chapter_title?: string;
  lesson_title?: string;
};

export async function setStudentMaterialCompletion(lessonId: string, assignmentId: string, completed: boolean) {
  const user = await getSessionUser();
  const token = await getBackendAccessToken();
  if (!token || user?.role !== "student") throw new Error("student_auth_required");
  const origin = (process.env.API_URL ?? process.env.AUTH_API_URL)?.replace(/\/$/, "");
  if (!origin) throw new Error("api_unavailable");
  const response = await fetch(`${origin}/study-lessons/${encodeURIComponent(lessonId)}/materials/${assignmentId}/completion`, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ completed }), cache: "no-store", signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error("completion_update_failed");
  return response.json();
}
