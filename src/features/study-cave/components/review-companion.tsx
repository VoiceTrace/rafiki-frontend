"use client";

import { useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bot, Lightbulb, Loader2, SendHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { startReview, sendReviewMessage, reloadReview } from "../actions/review-actions";
import type { ReviewCommand, ReviewEvent, ReviewSession } from "../review-types";
import { ReviewCompletionSummary } from "./review-completion-summary";

export function ReviewCompanion({ lessonId, initialSession }: { lessonId: string; initialSession: ReviewSession | null }) {
  const t = useTranslations("reviewChat");
  const locale = useLocale() === "ar" ? "ar" : "en";
  const [session, setSession] = useState(initialSession);
  const [draft, setDraft] = useState("");
  const [selected, setSelected] = useState(() => initialSession?.messages.findLast((event) => event.kind === "answer" && event.question_id === initialSession.current_question_id)?.option_id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [retry, setRetry] = useState<ReviewCommand | null>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const question = session?.questions.find((q) => q.id === session.current_question_id);

  function accept(result: Awaited<ReturnType<typeof startReview>>) {
    if (!result.ok) { setError(t(`errors.${result.error}`)); return false; }
    setSession(result.session); setError(null); setRetry(null);
    requestAnimationFrame(() => { if (transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight; });
    return true;
  }

  function send(action: ReviewCommand["action"], text = "", option?: string, previous?: ReviewCommand) {
    if (!session || pending) return;
    const command = previous ?? { request_id: crypto.randomUUID(), expected_version: session.version, action,
      question_id: question?.id, text, option_id: option, locale };
    setRetry(command);
    startTransition(async () => {
      const result = await sendReviewMessage(session.id, command);
      if (accept(result)) { setDraft(""); if (action === "next") setSelected(""); }
    });
  }

  function message(event: ReviewEvent, index: number) {
    const text = event.text || (event.action ? t(`actions.${event.action}`) : "");
    if (event.kind === "hint") return <details key={index} open className="rounded-xl border border-assistant bg-assistant/50 p-3">
      <summary className="cursor-pointer font-semibold text-assistant-foreground"><Lightbulb className="me-2 inline size-4" />{t("hintLevel", { level: event.level ?? 1 })}</summary>
      <p dir="auto" className="mt-2 whitespace-pre-wrap text-start">{text}</p>
    </details>;
    return <div key={index} className={`w-fit max-w-[92%] whitespace-pre-wrap rounded-xl p-3 ${event.role === "student" ? "ms-auto bg-secondary" : event.kind === "feedback" && event.score === 1 ? "bg-success/60" : "bg-card"}`}>
      <span className="sr-only">{event.role === "student" ? t("you") : t("assistant")}: </span><p dir="auto" className="text-start">{text}</p>
    </div>;
  }

  return <Card className="border-assistant bg-assistant/25 shadow-surface">
    <CardHeader>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2 text-base font-bold"><Bot className="size-5 text-assistant-foreground" />{t("title")}</CardTitle>
        <span className="rounded-full bg-assistant px-3 py-1 text-xs text-assistant-foreground">{t("demo")}</span>
      </div>
      <p className="text-xs text-muted-foreground">{t("description")}</p>
    </CardHeader>
    <CardContent className="grid gap-3">
      {!session ? <Button disabled={pending} onClick={() => startTransition(async () => { accept(await startReview(lessonId, locale)); })}>{pending ? <Loader2 className="size-4 animate-spin" /> : null}{t("start")}</Button> : <>
        <div ref={transcript} role="log" aria-label={t("history")} tabIndex={0} className="grid max-h-96 gap-3 overflow-y-auto rounded-lg p-1 text-sm leading-6">
          {session.messages.map(message)}
        </div>
        {!session.complete && question && <fieldset disabled={pending || session.resolved} className="grid min-w-0 gap-3 rounded-xl border border-border bg-card p-4">
          <legend className="px-1 text-xs text-muted-foreground">{t("question", { number: session.questions.length })}</legend>
          <p className="text-sm font-semibold leading-6">{question.text}</p>
          {question.kind === "choice" ? <>
            {question.options.map((option) => <label key={option.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm ${selected === option.id ? "border-primary bg-secondary" : "border-border"}`}>
              <input type="radio" name={question.id} value={option.id} checked={selected === option.id} onChange={() => setSelected(option.id)} className="size-4 accent-primary" />
              {option.text}
            </label>)}
            {!session.resolved && <Button disabled={!selected || pending} onClick={() => send("answer", "", selected)}>{t("check")}</Button>}
          </> : <p className="text-xs text-muted-foreground">{t("written")}</p>}
        </fieldset>}
        <div className="flex flex-wrap gap-2">
          {session.can_hint && <Button variant="outline" disabled={pending} onClick={() => send("hint")}><Lightbulb className="size-4" />{session.hint_level ? t("anotherHint") : t("hint")}</Button>}
          <Button variant="outline" disabled={pending} onClick={() => send("help", t("explain"))}>{t("explain")}</Button>
          {session.resolved && !session.complete && <Button disabled={pending} onClick={() => send("next")}>{session.questions.length === session.total_questions ? t("finish") : t("next")}</Button>}
        </div>
        {session.complete ? session.summary
          ? <ReviewCompletionSummary summary={session.summary} />
          : <p className="rounded-xl bg-success/60 p-3 text-sm" role="status">{t("complete")}</p>
        : null}
        {!session.complete && !session.resolved && session.attempts > 0 && <p className="text-xs text-muted-foreground">{t("retry", { attempts: session.attempts })}</p>}
        <form className="flex items-end gap-2" onSubmit={(event) => { event.preventDefault(); if (draft.trim()) send("chat", draft); }}>
          <Textarea aria-label={t("composer")} placeholder={t("composer")} maxLength={2000} value={draft} onChange={(event) => setDraft(event.target.value)} disabled={pending} className="min-h-20 bg-card" />
          <Button type="submit" size="icon" disabled={pending || !draft.trim()} aria-label={t("send")}>{pending ? <Loader2 className="size-4 animate-spin" /> : <SendHorizontal className="rtl:-scale-x-100" />}</Button>
        </form>
      </>}
      {error && <div role="alert" className="grid gap-2 text-sm text-destructive"><p>{error}</p>
        <div className="flex flex-wrap gap-2">
          {retry && <Button variant="outline" disabled={pending} onClick={() => send(retry.action, retry.text, retry.option_id, retry)}>{t("retryRequest")}</Button>}
          {session && <Button variant="outline" disabled={pending} onClick={() => startTransition(async () => { accept(await reloadReview(session.id, locale)); })}>{t("reload")}</Button>}
        </div>
      </div>}
    </CardContent>
  </Card>;
}
