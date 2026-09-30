"use server";

import { z } from "zod";
import { reviewRequest, ReviewApiError } from "../server/review-api";
import type { ReviewSession } from "../review-types";

const localeSchema = z.enum(["en", "ar"]);
const commandSchema = z.object({
  request_id: z.uuid(), expected_version: z.number().int().nonnegative(),
  action: z.enum(["chat", "answer", "hint", "help", "next"]),
  question_id: z.string().max(100).optional(), text: z.string().max(2000).optional(),
  option_id: z.string().max(100).optional(), locale: localeSchema,
});
type Result = { ok: true; session: ReviewSession } | { ok: false; error: "request" | "conflict" | "auth" };

function failure(error: unknown): Result {
  return { ok: false, error: error instanceof ReviewApiError
    ? error.status === 409 ? "conflict" : error.status === 401 || error.status === 403 ? "auth" : "request"
    : "request" };
}

export async function startReview(lessonId: string, locale: string): Promise<Result> {
  const parsed = z.object({ lessonId: z.string().min(1).max(100), locale: localeSchema }).safeParse({ lessonId, locale });
  if (!parsed.success) return { ok: false, error: "request" };
  try {
    return { ok: true, session: await reviewRequest<ReviewSession>(`/study-sessions?locale=${parsed.data.locale}`,
      { method: "POST", body: JSON.stringify({ lesson_id: parsed.data.lessonId }) }) };
  } catch (error) { return failure(error); }
}

export async function sendReviewMessage(sessionId: string, input: unknown): Promise<Result> {
  const id = z.uuid().safeParse(sessionId);
  const command = commandSchema.safeParse(input);
  if (!id.success || !command.success) return { ok: false, error: "request" };
  try {
    return { ok: true, session: await reviewRequest<ReviewSession>(`/study-sessions/${id.data}/messages`,
      { method: "POST", body: JSON.stringify(command.data) }) };
  } catch (error) { return failure(error); }
}

export async function reloadReview(sessionId: string, locale: string): Promise<Result> {
  if (!z.uuid().safeParse(sessionId).success || !localeSchema.safeParse(locale).success) return { ok: false, error: "request" };
  try {
    return { ok: true, session: await reviewRequest<ReviewSession>(`/study-sessions/${sessionId}?locale=${locale}`) };
  } catch (error) { return failure(error); }
}

