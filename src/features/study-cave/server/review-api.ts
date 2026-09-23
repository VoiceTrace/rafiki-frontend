import "server-only";
import { getBackendAccessToken, getSessionUser } from "@/features/auth/server/dal";
import type { ReviewChapter, ReviewData, ReviewLesson, ReviewSession, ReviewSubject } from "../review-types";

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

export async function loadReview(locale: string, lessonId?: string, subjectId?: string, chapterId?: string): Promise<ReviewData> {
  const data: ReviewData = { subjects: [], chapters: [], lessons: [], lesson: null, session: null, error: false };
  try {
    data.subjects = await reviewRequest<ReviewSubject[]>(`/study-subjects?locale=${locale}`);
    const selected = lessonId ? await reviewRequest<ReviewLesson>(`/study-lessons/${encodeURIComponent(lessonId)}?locale=${locale}`) : null;
    // A direct lesson link is authoritative and resolves its parent selectors.
    const subject = selected?.subject_id ?? subjectId;
    const chapter = selected?.chapter_id ?? chapterId;
    if (!subject) {
      if (chapter) throw new ReviewApiError(404);
      return data;
    }
    if (!data.subjects.some((item) => item.id === subject)) throw new ReviewApiError(404);
    data.subjectId = subject;
    data.chapters = await reviewRequest<ReviewChapter[]>(`/study-subjects/${encodeURIComponent(subject)}/chapters?locale=${locale}`);
    if (!chapter) return data;
    if (!data.chapters.some((item) => item.id === chapter)) throw new ReviewApiError(404);
    data.chapterId = chapter;
    data.lessons = await reviewRequest<ReviewLesson[]>(`/study-lessons?chapter_id=${encodeURIComponent(chapter)}&locale=${locale}`);
    if (!selected) return data;
    if (!data.lessons.some((item) => item.id === selected.id)) throw new ReviewApiError(404);
    try {
      data.session = await reviewRequest<ReviewSession>(`/study-sessions/by-lesson/${encodeURIComponent(selected.id)}?locale=${locale}`);
    } catch (error) {
      if (!(error instanceof ReviewApiError) || error.status !== 404) throw error;
    }
    data.lesson = data.session?.lesson ?? selected;
    return data;
  } catch {
    return { ...data, lesson: null, session: null, error: true };
  }
}
