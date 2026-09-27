"use client"

import { useState, useTransition } from "react"
import { ArrowLeft, CheckCircle2, Loader2, XCircle } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { submitHomeworkAction } from "../actions/submit-homework"
import type { StudentAssignmentWithQuestions, SubmissionResult } from "@/types/homework"

interface Props {
  assignment: StudentAssignmentWithQuestions
  initialResult: SubmissionResult | null
}

export function StudentHomeworkMCQ({ assignment, initialResult }: Props) {
  const t = useTranslations("studentHomework")
  const locale = useLocale() as "en" | "ar"
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [result, setResult] = useState<SubmissionResult | null>(initialResult)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isSubmitted = assignment.status === "submitted"
  const allAnswered = assignment.questions.length > 0 && assignment.questions.every((q) => q.id in selected)

  function handleSelect(questionId: string, optionId: string) {
    if (isSubmitted || result || isPending) return
    setSelected((prev) => ({ ...prev, [questionId]: optionId }))
  }

  function handleSubmit() {
    if (!allAnswered || isPending || isSubmitted || result) return
    setError(null)
    startTransition(async () => {
      try {
        const res = await submitHomeworkAction({ assignmentId: assignment.id, locale,
          answers: Object.entries(selected).map(([question_id, selected_option]) => ({
            question_id,
            selected_option,
          })),
        })
        if (res.error) setError(t("mcq.submitError"))
        else setResult(res.result)
      } catch {
        setError(t("mcq.submitError"))
      }
    })
  }

  const resultMap = result
    ? Object.fromEntries(result.results.map((r) => [r.question_id, r]))
    : null

  return (
    <div className="mx-auto flex w-full max-w-160 flex-col gap-5 pb-20">
      <header className="flex items-center gap-2">
        <Button render={<Link href="/student/homework" />} nativeButton={false} variant="ghost" size="icon" aria-label={t("back")}>
          <ArrowLeft className="rtl:-scale-x-100" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="break-words font-heading text-section font-bold">{assignment.title}</h1>
          {assignment.description && (
            <p className="text-sm text-muted-foreground">{assignment.description}</p>
          )}
        </div>
      </header>

      {/* Score banner after submit */}
      {result && (
        <div role="status" className="flex items-center gap-3 rounded-2xl border border-success bg-success/20 p-4">
          <CheckCircle2 className="size-6 shrink-0 text-success-foreground" />
          <div>
            <strong>{t("mcq.submitted")}</strong>
            <p className="text-sm">
              {t("mcq.score", {
                correct: result.correct_count,
                total: result.total_count,
                percent: Math.round(result.score * 100),
              })}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {assignment.questions.map((q, idx) => {
          const attempt = resultMap?.[q.id]
          return (
            <Card key={q.id}>
              <CardHeader>
                <CardTitle className="break-words text-base font-semibold leading-snug">
                  {idx + 1}. {q.question_text}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {q.options.map((opt) => {
                  const isSelected = selected[q.id] === opt.id
                  const isCorrect = attempt?.correct_answer === opt.id
                  const wasSelected = attempt?.selected_option === opt.id
                  let style = "border-border bg-secondary/20 hover:bg-secondary/40"
                  if (attempt) {
                    if (isCorrect) style = "border-success bg-success/20 font-semibold text-success-foreground"
                    else if (wasSelected && !isCorrect) style = "border-destructive/50 bg-destructive/10 text-destructive"
                    else style = "border-border bg-secondary/10 opacity-60"
                  } else if (isSelected) {
                    style = "border-primary bg-primary/10 font-semibold"
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={Boolean(result) || isSubmitted || isPending}
                      aria-pressed={attempt ? wasSelected : isSelected}
                      aria-label={`${opt.id.toUpperCase()}. ${opt.text}${attempt && isCorrect ? ` — ${t("mcq.correctAnswer")}` : attempt && wasSelected ? ` — ${t("mcq.yourAnswer")}` : ""}`}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-start text-sm transition-colors ${style}`}
                    >
                      <span className="shrink-0 font-mono text-xs font-bold">{opt.id.toUpperCase()}</span>
                      <span className="min-w-0 flex-1 break-words">{opt.text}</span>
                      {attempt && isCorrect && <CheckCircle2 className="size-4 shrink-0 text-success-foreground" />}
                      {attempt && wasSelected && !isCorrect && <XCircle className="size-4 shrink-0 text-destructive" />}
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!result && !isSubmitted && (
        <>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button
            size="lg"
            className="w-full"
            disabled={!allAnswered || isPending}
            onClick={handleSubmit}
          >
            {isPending && <Loader2 className="animate-spin" />}
            {t("mcq.submit")}
          </Button>
        </>
      )}
    </div>
  )
}
