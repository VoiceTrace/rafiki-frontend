"use client"

import { useMemo, useState, useTransition } from "react"
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Lightbulb, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { revealHomeworkHintAction, submitHomeworkAction } from "../actions/submit-homework"
import type { StudentAssignmentWithQuestions, SubmissionResult } from "@/types/homework"

interface Props { assignment: StudentAssignmentWithQuestions; initialResult: SubmissionResult | null; backHref?: string }

export function StudentHomeworkMCQ({ assignment, initialResult, backHref = "/student/study-cave?phase=homework" }: Props) {
  const t = useTranslations("studentHomework.mcq")
  const locale = useLocale() as "en" | "ar"
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [answers, setAnswers] = useState<Record<string, string>>(() => Object.fromEntries(initialResult?.results.map((result) => [result.question_id, result.answer]) ?? []))
  const [hints, setHints] = useState<Record<string, string[]>>(() => Object.fromEntries(assignment.questions.map((question) => [question.id, question.revealed_hints ?? []])))
  const [error, setError] = useState<string | null>(null)
  // Read the clock once per mount; calling Date.now() during render is impure.
  const [now] = useState(() => Date.now())
  const [pending, startTransition] = useTransition()
  const submitted = ["submitted", "graded", "approved"].includes(assignment.status)
  const approved = assignment.status === "approved" && initialResult
  const overdue = Boolean(assignment.due_at && new Date(assignment.due_at).getTime() < now && !submitted)
  const rawStep = searchParams.get("q") ?? "1"
  const review = rawStep === "review"
  const parsedStep = Number(rawStep)
  const index = Number.isInteger(parsedStep) ? Math.min(Math.max(parsedStep - 1, 0), Math.max(assignment.questions.length - 1, 0)) : 0
  const question = assignment.questions[index]
  const answeredCount = assignment.questions.filter((item) => Boolean(answers[item.id]?.trim())).length
  const unanswered = assignment.questions.filter((item) => !answers[item.id]?.trim())

  function navigate(step: number | "review") {
    const params = new URLSearchParams(searchParams.toString())
    params.set("q", String(step))
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function reveal(questionId: string) {
    startTransition(async () => {
      const result = await revealHomeworkHintAction({ assignmentId: assignment.id, questionId })
      if (!result) return setError(t("hintError"))
      setHints((current) => ({ ...current, [questionId]: [...(current[questionId] ?? []), result.hint] }))
      setError(null)
    })
  }

  function submit() {
    if (unanswered.length) return
    startTransition(async () => {
      const result = await submitHomeworkAction({ assignmentId: assignment.id, locale, answers: assignment.questions.map((item) => ({ question_id: item.id, answer: answers[item.id].trim() })) })
      if (result.error) return setError(t("submitError"))
      toast.success(t("submittedToast"))
      router.refresh()
    })
  }

  const resultByQuestion = useMemo(() => new Map(initialResult?.results.map((result) => [result.question_id, result]) ?? []), [initialResult])

  if (submitted) return <div className="mx-auto grid w-full max-w-180 gap-5 pb-20">
    <header className="flex items-center gap-3"><Button render={<Link href={backHref} />} nativeButton={false} variant="ghost" size="icon" aria-label={t("back")}><ArrowLeft className="rtl:-scale-x-100" /></Button><div><h1 className="font-heading text-section font-bold">{assignment.title}</h1><p className="text-sm text-muted-foreground">{assignment.subject} · {assignment.chapter}</p></div></header>
    <div role="status" className="rounded-2xl border border-success/40 bg-success/15 p-5"><CheckCircle2 className="mb-3 size-7 text-success-foreground" /><h2 className="font-heading text-xl font-bold">{approved ? t("approvedTitle") : t("waitingTitle")}</h2><p className="mt-1 text-sm text-muted-foreground">{approved ? t("approvedDescription") : t("awaitingReview")}</p>{approved && initialResult.score != null && <p className="mt-4 text-3xl font-bold text-success-foreground">{Math.round(initialResult.score * 100)}%</p>}</div>
    {approved && <div className="grid gap-3">{assignment.questions.map((item, itemIndex) => { const result = resultByQuestion.get(item.id); const picked = item.options.find((option) => option.id === result?.answer); return <Card key={item.id}><CardContent className="grid gap-3 p-4 sm:p-5"><h3 className="font-semibold">{itemIndex + 1}. {item.question_text}</h3><div className="rounded-xl bg-secondary/40 p-3 text-sm"><span className="text-xs text-muted-foreground">{t("yourAnswer")}</span><p className="mt-1 font-semibold">{picked ? `${picked.id.toUpperCase()}. ${picked.text}` : result?.answer}</p></div>{result?.teacher_score != null && <p className="text-sm">{t("teacherScore", { score: Math.round(result.teacher_score * 100) })}</p>}{result?.teacher_comment && <div className="rounded-xl border-s-4 border-primary bg-primary/5 p-3 text-sm"><strong>{t("teacherComment")}</strong><p className="mt-1">{result.teacher_comment}</p></div>}</CardContent></Card> })}</div>}
  </div>

  if (!question) return <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">{t("empty")}</div>

  return <div className="mx-auto flex w-full max-w-180 flex-col gap-5 pb-24">
    <header className="flex items-start gap-3"><Button render={<Link href={backHref} />} nativeButton={false} variant="ghost" size="icon" aria-label={t("back")}><ArrowLeft className="rtl:-scale-x-100" /></Button><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="font-heading text-section font-bold">{assignment.title}</h1>{overdue && <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">{t("overdue")}</span>}</div><p className="text-sm text-muted-foreground">{assignment.subject} · {assignment.chapter}</p></div></header>
    {assignment.description && <p className="text-sm text-muted-foreground">{assignment.description}</p>}
    {!review && <section aria-label={t("progressLabel")} className="grid gap-3"><div className="flex items-center justify-between text-sm"><strong>{t("questionProgress", { current: index + 1, total: assignment.questions.length })}</strong><span className="text-muted-foreground">{t("answered", { count: answeredCount, total: assignment.questions.length })}</span></div><Progress value={(index + 1) / assignment.questions.length * 100} /><div className="flex flex-wrap justify-center gap-2">{assignment.questions.map((item, dotIndex) => <button key={item.id} type="button" onClick={() => navigate(dotIndex + 1)} aria-label={t("goToQuestion", { number: dotIndex + 1 })} aria-current={dotIndex === index ? "step" : undefined} className={`size-3 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring ${dotIndex === index ? "scale-125 bg-primary" : answers[item.id]?.trim() ? "bg-success-foreground" : "bg-muted-foreground/30"}`} />)}</div></section>}

    {review ? <section className="grid gap-4"><div><h2 className="font-heading text-section font-bold">{t("reviewTitle")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("reviewDescription")}</p></div><div className="grid gap-2">{assignment.questions.map((item, itemIndex) => <button key={item.id} type="button" onClick={() => navigate(itemIndex + 1)} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-start focus-visible:ring-2 focus-visible:ring-ring"><span className={`grid size-8 place-items-center rounded-full text-sm font-bold ${answers[item.id]?.trim() ? "bg-success/30 text-success-foreground" : "bg-muted text-muted-foreground"}`}>{itemIndex + 1}</span><span className="min-w-0 flex-1 truncate text-sm font-medium">{item.question_text}</span><span className="text-xs text-muted-foreground">{answers[item.id]?.trim() ? t("answeredStatus") : t("unansweredStatus")}</span></button>)}</div>{unanswered.length > 0 && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{t("unansweredWarning", { count: unanswered.length })}</p>}<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><Button variant="outline" onClick={() => navigate(assignment.questions.length)}>{t("backToQuestions")}</Button><AlertDialog><AlertDialogTrigger render={<Button disabled={pending} />} >{t("submit")}</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t("confirmTitle")}</AlertDialogTitle><AlertDialogDescription>{unanswered.length ? t("confirmUnanswered", { count: unanswered.length }) : t("confirmDescription")}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t("cancel")}</AlertDialogCancel><AlertDialogAction disabled={pending || unanswered.length > 0} onClick={submit}>{pending && <Loader2 className="animate-spin" />}{t("confirmSubmit")}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></section> : <Card><CardContent className="grid gap-5 p-4 sm:p-6"><h2 className="font-heading text-xl font-bold">{question.question_text}</h2>{question.format === "short_note" ? <div className="grid gap-2"><label htmlFor={`answer-${question.id}`} className="text-sm font-semibold">{t("shortNoteLabel")}</label><Textarea id={`answer-${question.id}`} value={answers[question.id] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder={t("shortNotePlaceholder")} rows={5} maxLength={5000} disabled={pending} /></div> : <RadioGroup value={answers[question.id] ?? ""} onValueChange={(value) => value && setAnswers((current) => ({ ...current, [question.id]: value }))} aria-label={question.question_text} disabled={pending}>{question.options.map((option) => <label key={option.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors focus-within:ring-2 focus-within:ring-ring ${answers[question.id] === option.id ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/30"}`}><RadioGroupItem value={option.id} /><span className="grid size-8 place-items-center rounded-full bg-secondary font-mono text-sm font-bold">{option.id.toUpperCase()}</span><span className="text-sm font-medium">{option.text}</span></label>)}</RadioGroup>}<div className="grid gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-primary"><Lightbulb className="size-4" />{t("hintsSummary")}</div><div aria-live="polite" className="grid gap-2">{(hints[question.id] ?? []).map((hint, hintIndex) => <div key={hintIndex} className="rounded-xl bg-card p-3 text-sm"><strong>{t("hintLabel", { number: hintIndex + 1 })}</strong><p className="mt-1">{hint}</p></div>)}</div>{(hints[question.id]?.length ?? 0) < question.hint_count && <Button type="button" variant="outline" className="w-fit" disabled={pending} onClick={() => reveal(question.id)}><Lightbulb className="size-4" />{t("revealHint", { number: (hints[question.id]?.length ?? 0) + 1 })}</Button>}</div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</CardContent></Card>}

    {!review && <footer className="flex items-center justify-between gap-3"><Button variant="outline" disabled={index === 0} onClick={() => navigate(index)}><ArrowLeft className="size-4 rtl:-scale-x-100" />{t("previous")}</Button>{index === assignment.questions.length - 1 ? <Button onClick={() => navigate("review")}>{t("reviewAnswers")}<CheckCircle2 className="size-4" /></Button> : <Button onClick={() => navigate(index + 2)}>{t("next")}<ArrowRight className="size-4 rtl:-scale-x-100" /></Button>}</footer>}
    {overdue && <p className="flex items-center gap-2 text-xs text-destructive"><Clock3 className="size-4" />{t("lateNote")}</p>}
  </div>
}
