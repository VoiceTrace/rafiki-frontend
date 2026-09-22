import "server-only";
import { getBackendAccessToken, getSessionUser } from "@/features/auth/server/dal";
import type { ReviewData, ReviewLesson, ReviewSession } from "../review-types";

export class ReviewApiError extends Error {
  constructor(public status: number) { super("review_request_failed"); }
}

export async function reviewRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const user = await getSessionUser();
  const token = await getBackendAccessToken();
  if (!token || user?.role !== "student") throw new ReviewApiError(401);
  const origin = (process.env.API_URL ?? process.env.AUTH_API_URL)?.replace(/\/$/, "");
  if (!origin) throw new ReviewApiError(503);
  const response = await fetch(origin + path, { ...init, cache: "no-store",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new ReviewApiError(response.status);
  return response.json() as Promise<T>;
}

export async function loadReview(locale: string, lessonId?: string): Promise<ReviewData> {
  let lessons: ReviewLesson[] = [];
  let lesson: ReviewLesson | null = null;
  try {
    lessons = await reviewRequest<ReviewLesson[]>(`/study-lessons?locale=${locale}`);
    lesson = lessons.find((item) => item.id === lessonId) ?? (lessonId ? null : lessons[0] ?? null);
    if (!lesson) return { lessons, lesson: null, session: null, error: Boolean(lessonId) };
    let session: ReviewSession | null = null;
    try {
      session = await reviewRequest<ReviewSession>(`/study-sessions/by-lesson/${encodeURIComponent(lesson.id)}?locale=${locale}`);
    } catch (error) {
      if (!(error instanceof ReviewApiError) || error.status !== 404) throw error;
    }
    return { lessons, lesson: session?.lesson ?? lesson, session, error: false };
  } catch {
    return { lessons, lesson, session: null, error: true };
  }
}

