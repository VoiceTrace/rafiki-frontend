"use client"

import { useMemo, useState, useTransition } from "react"
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react"
import { useFormatter, useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { gradeSubmissionAction } from "../actions/homework-actions"
import type { AssignmentWithQuestions, TeacherSubmission } from "@/types/homework"

function StudentReview({ assignmentId, submission }: { assignmentId: string; submission: TeacherSubmission }) {
  const t = useTranslations("teacherHomework.redesign.results")
  const locale = useLocale()
  const [pending, startTransition] = useTransition()
  const [grades, setGrades] = useState<Record<string, { score: string; comment: string }>>(() => Object.fromEntries(submission.attempts.map((attempt) => [attempt.question_id, { score: attempt.teacher_score?.toString() ?? "", comment: attempt.teacher_comment ?? "" }])))
  const valid = submission.attempts.length > 0 && submission.attempts.every((attempt) => {
    const score = Number(grades[attempt.question_id]?.score)
    return grades[attempt.question_id]?.score !== "" && score >= 0 && score <= 1
  })

  function save(approve: boolean) {
    startTransition(async () => {
      const result = await gradeSubmissionAction({ assignmentId, studentAssignmentId: submission.student_assignment_id, locale, approve, grades: submission.attempts.map((attempt) => ({ question_id: attempt.question_id, score: Number(grades[attempt.question_id].score), comment: grades[attempt.question_id].comment.trim() || undefined })) })
      if (result.error) toast.error(t("gradeError")); else toast.success(approve ? t("approvedToast") : t("savedToast"))
    })
  }

  return <div className="grid gap-4">
    {submission.attempts.map((attempt, index) => <div key={attempt.question_id} className="grid gap-3 rounded-2xl border border-border p-4">
      <div><p className="text-xs font-semibold text-muted-foreground">{t("question", { number: index + 1 })}</p><h3 className="mt-1 font-semibold">{attempt.question_text}</h3></div>
      {attempt.format === "short_note" ? <div className="rounded-xl bg-secondary/40 p-3"><span className="text-xs text-muted-foreground">{t("studentAnswer")}</span><p className="mt-1 whitespace-pre-wrap text-sm">{attempt.answer}</p></div> : <div className="grid gap-2 sm:grid-cols-2"><div className="rounded-xl bg-secondary/40 p-3"><span className="text-xs text-muted-foreground">{t("studentPick")}</span><p className="mt-1 font-semibold">{attempt.answer.toUpperCase()}</p></div><div className="rounded-xl bg-success/20 p-3"><span className="text-xs text-success-foreground">{t("correctAnswer")}</span><p className="mt-1 font-semibold text-success-foreground">{attempt.correct_answer?.toUpperCase()}</p></div></div>}
      <p className="text-xs text-muted-foreground">{t("hintsUsed", { count: attempt.hints_revealed })}</p>
      <div className="grid gap-3 sm:grid-cols-[8rem_1fr]"><label className="grid gap-1 text-sm font-medium">{t("score")}<Input type="number" min="0" max="1" step="0.01" value={grades[attempt.question_id]?.score ?? ""} onChange={(event) => setGrades((current) => ({ ...current, [attempt.question_id]: { ...current[attempt.question_id], score: event.target.value } }))} disabled={pending} /></label><label className="grid gap-1 text-sm font-medium">{t("comment")}<Textarea rows={2} value={grades[attempt.question_id]?.comment ?? ""} onChange={(event) => setGrades((current) => ({ ...current, [attempt.question_id]: { ...current[attempt.question_id], comment: event.target.value } }))} disabled={pending} /></label></div>
    </div>)}
    {submission.attempts.length === 0 && <p className="text-sm text-muted-foreground">{t("notSubmitted")}</p>}
    {submission.attempts.length > 0 && <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="outline" disabled={pending || !valid} onClick={() => save(false)}>{pending && <Loader2 className="animate-spin" />}{t("saveGrade")}</Button><Button disabled={pending || !valid} onClick={() => save(true)}><CheckCircle2 className="size-4" />{t("approve")}</Button></div>}
  </div>
}

export function TeacherHomeworkResults({ assignment, submissions, conceptOptions = [] }: { assignment: AssignmentWithQuestions; submissions: TeacherSubmission[]; conceptOptions?: { id: string; title: string }[] }) {
  const t = useTranslations("teacherHomework.redesign.results")
  const format = useFormatter()
  const [selected, setSelected] = useState<TeacherSubmission | null>(null)
  const submitted = submissions.filter((item) => ["submitted", "graded", "approved"].includes(item.status))
  const scored = submissions.filter((item) => item.score != null)
  const average = scored.length ? scored.reduce((sum, item) => sum + (item.score ?? 0), 0) / scored.length : 0
  const concepts = useMemo(() => {
    const byQuestion = new Map(assignment.questions.map((question) => [question.id, question]))
    const counts = new Map<string, { label: string; faced: number; wrong: number }>()
    for (const submission of submitted) for (const attempt of submission.attempts) {
      const question = byQuestion.get(attempt.question_id)
      if (!question?.concept_ref || question.format !== "mcq") continue
      const current = counts.get(question.concept_ref) ?? { label: conceptOptions.find((concept) => concept.id === question.concept_ref)?.title ?? question.concept_ref, faced: 0, wrong: 0 }
      current.faced += 1
      if (attempt.answer !== attempt.correct_answer) current.wrong += 1
      counts.set(question.concept_ref, current)
    }
    return [...counts.values()].sort((a, b) => b.wrong - a.wrong)
  }, [assignment.questions, conceptOptions, submitted])

  return <section className="grid gap-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-heading text-section font-bold">{assignment.title}</h2><span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">{t(`status.${assignment.status}`)}</span></div><p className="mt-1 text-sm text-muted-foreground">{assignment.description}</p></div>{assignment.due_at && <span className="text-sm text-muted-foreground">{t("due", { date: format.dateTime(new Date(assignment.due_at), { dateStyle: "medium", timeStyle: "short" }) })}</span>}</div>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card><CardHeader><CardTitle>{t("summaryTitle")}</CardTitle></CardHeader><CardContent><div className="grid grid-cols-3 gap-3"><div><strong className="text-2xl">{submitted.length}/{submissions.length}</strong><p className="text-xs text-muted-foreground">{t("submitted")}</p></div><div><strong className="text-2xl">{scored.length ? `${Math.round(average * 100)}%` : "—"}</strong><p className="text-xs text-muted-foreground">{t("average")}</p></div><div><strong className="text-2xl">{submissions.length - submitted.length}</strong><p className="text-xs text-muted-foreground">{t("working")}</p></div></div><Progress className="mt-5" value={submissions.length ? submitted.length / submissions.length * 100 : 0} aria-label={t("submissionProgress")} /></CardContent></Card>
      <Card><CardHeader><CardTitle>{t("strugglesTitle")}</CardTitle><p className="text-sm text-muted-foreground">{t("strugglesDescription")}</p></CardHeader><CardContent className="grid gap-4">{concepts.length === 0 ? <p className="text-sm text-muted-foreground">{t("noStruggles")}</p> : concepts.map((concept) => <div key={concept.label} className="grid gap-1.5"><div className="flex justify-between gap-3 text-sm"><strong>{concept.label}</strong><span className="text-destructive">{t("wrongCount", { wrong: concept.wrong, faced: concept.faced })}</span></div><Progress value={concept.faced ? concept.wrong / concept.faced * 100 : 0} aria-label={concept.label} /></div>)}</CardContent></Card>
    </div>
    <Card><CardHeader><CardTitle>{t("studentsTitle")}</CardTitle></CardHeader><CardContent>{submissions.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">{t("noStudents")}</p> : <Table><TableHeader><TableRow><TableHead>{t("student")}</TableHead><TableHead>{t("statusLabel")}</TableHead><TableHead>{t("scoreLabel")}</TableHead><TableHead>{t("hintsLabel")}</TableHead><TableHead>{t("submittedAt")}</TableHead><TableHead><span className="sr-only">{t("review")}</span></TableHead></TableRow></TableHeader><TableBody>{submissions.map((submission) => <TableRow key={submission.student_assignment_id}><TableCell className="font-medium">{submission.student_name}</TableCell><TableCell>{t(`studentStatus.${submission.status}`)}</TableCell><TableCell>{submission.score == null ? "—" : `${Math.round(submission.score * 100)}%`}</TableCell><TableCell>{submission.attempts.reduce((sum, attempt) => sum + attempt.hints_revealed, 0)}</TableCell><TableCell>{submission.submitted_at ? format.dateTime(new Date(submission.submitted_at), { dateStyle: "medium", timeStyle: "short" }) : "—"}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => setSelected(submission)}>{t("review")}<ChevronRight className="size-4 rtl:-scale-x-100" /></Button></TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card>
    <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null) }}><DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{selected?.student_name}</DialogTitle><DialogDescription>{t("reviewDescription")}</DialogDescription></DialogHeader>{selected && <StudentReview assignmentId={assignment.id} submission={selected} />}</DialogContent></Dialog>
  </section>
}
