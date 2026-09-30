"use client"

import { useState, useTransition } from "react"
import { ArrowLeft, CheckCircle2, Lightbulb, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { revealHomeworkHintAction, submitHomeworkAction } from "../actions/submit-homework"
import type { StudentAssignmentWithQuestions, SubmissionResult } from "@/types/homework"

interface Props { assignment: StudentAssignmentWithQuestions; initialResult: SubmissionResult | null; backHref?: string }

export function StudentHomeworkMCQ({ assignment, initialResult, backHref = "/student/study-cave?phase=homework" }: Props) {
  const t = useTranslations("studentHomework")
  const locale = useLocale() as "en" | "ar"
  const [answers, setAnswers] = useState<Record<string, string>>({})
  // Seed from the server so hints revealed in an earlier visit are still shown,
  // and the reveal counter stays in step with what the API will allow.
  const [hints, setHints] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(assignment.questions.map((question) => [question.id, question.revealed_hints ?? []])),
  )
  const [submitted, setSubmitted] = useState(assignment.status !== "assigned" && assignment.status !== "in_progress")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const allAnswered = assignment.questions.length > 0 && assignment.questions.every((question) => answers[question.id]?.trim())

  function reveal(questionId: string) {
    startTransition(async () => {
      const result = await revealHomeworkHintAction({ assignmentId: assignment.id, questionId })
      if (!result) { setError(t("mcq.submitError")); return }
      setHints((current) => ({ ...current, [questionId]: [...(current[questionId] ?? []), result.hint] }))
    })
  }

  function submit() {
    if (!allAnswered) return
    startTransition(async () => {
      const result = await submitHomeworkAction({ assignmentId: assignment.id, locale, answers: Object.entries(answers).map(([question_id, answer]) => ({ question_id, answer })) })
      if (result.error) setError(t("mcq.submitError")); else setSubmitted(true)
    })
  }

  return <div className="mx-auto flex w-full max-w-160 flex-col gap-5 pb-20">
    <header className="flex items-center gap-2"><Button render={<Link href={backHref} />} nativeButton={false} variant="ghost" size="icon" aria-label={t("back")}><ArrowLeft className="rtl:-scale-x-100" /></Button><div><h1 className="font-heading text-section font-bold">{assignment.title}</h1>{assignment.description && <p className="text-sm text-muted-foreground">{assignment.description}</p>}</div></header>
    {(submitted || initialResult) && <div role="status" className="flex gap-3 rounded-2xl border border-success bg-success/20 p-4"><CheckCircle2 className="size-6 text-success-foreground" /><div><strong>{t("mcq.submitted")}</strong><p className="text-sm">{assignment.status === "approved" && initialResult?.score != null ? `${Math.round(initialResult.score * 100)}%` : t("mcq.awaitingReview")}</p></div></div>}
    {assignment.questions.map((question, index) => <Card key={question.id}><CardHeader><CardTitle className="text-base">{index + 1}. {question.question_text}</CardTitle></CardHeader><CardContent className="grid gap-3">
      <details className="rounded-xl border border-primary/20 bg-primary/5 p-3"><summary className="cursor-pointer text-sm font-semibold text-primary">{t("mcq.hintsSummary")}</summary><div className="mt-3 grid gap-2">{(hints[question.id] ?? []).map((hint, hintIndex) => <p key={hintIndex} className="text-sm"><Lightbulb className="me-2 inline size-4 text-primary" />{hint}</p>)}{!submitted && (hints[question.id]?.length ?? 0) < question.hint_count && <Button type="button" variant="outline" className="w-fit" disabled={isPending} onClick={() => reveal(question.id)}><Lightbulb />{t("mcq.revealHint", { number: (hints[question.id]?.length ?? 0) + 1 })}</Button>}</div></details>
      {question.format === "mcq" ? question.options.map((option) => <button key={option.id} type="button" disabled={submitted || isPending} onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))} className={`rounded-xl border px-4 py-3 text-start text-sm ${answers[question.id] === option.id ? "border-primary bg-primary/10" : "border-border"}`}>{option.text}</button>) : <textarea disabled={submitted || isPending} value={answers[question.id] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} className="min-h-28 rounded-xl border border-border bg-background p-3 text-sm" />}
    </CardContent></Card>)}
    {!submitted && <><>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</><Button size="lg" disabled={!allAnswered || isPending} onClick={submit}>{isPending && <Loader2 className="animate-spin" />}{t("mcq.submit")}</Button></>}
  </div>
}
