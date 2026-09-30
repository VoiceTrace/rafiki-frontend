"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { gradeSubmissionAction } from "../actions/homework-actions"
import type { TeacherSubmission } from "@/types/homework"

export function HomeworkSubmissions({ assignmentId, locale, submissions }: { assignmentId: string; locale: string; submissions: TeacherSubmission[] }) {
  const [pending, startTransition] = useTransition()
  const [scores, setScores] = useState<Record<string, string>>({})
  return <div className="mx-auto grid w-full max-w-180 gap-4 pb-20"><h1 className="font-heading text-section font-bold">{locale === "ar" ? "مراجعة التسليمات" : "Review submissions"}</h1>{submissions.map((submission) => <Card key={submission.student_assignment_id}><CardHeader><CardTitle>{submission.student_name} <span className="text-sm font-normal text-muted-foreground">{submission.status}</span></CardTitle></CardHeader><CardContent className="grid gap-4">{submission.attempts.map((attempt) => <div key={attempt.question_id} className="grid gap-2 rounded-xl border p-3"><p className="font-semibold">{attempt.question_text}</p><p className="text-sm whitespace-pre-wrap">{attempt.answer}</p><p className="text-xs text-muted-foreground">{locale === "ar" ? `التلميحات المستخدمة: ${attempt.hints_revealed}` : `Hints revealed: ${attempt.hints_revealed}`}</p><label className="grid gap-1 text-sm">{locale === "ar" ? "الدرجة (0 إلى 1)" : "Score (0–1)"}<input type="number" min="0" max="1" step="0.01" value={scores[attempt.question_id] ?? attempt.teacher_score ?? ""} onChange={(event) => setScores((current) => ({ ...current, [attempt.question_id]: event.target.value }))} className="w-28 rounded border p-2" /></label></div>)}<Button disabled={pending || submission.attempts.some((attempt) => Number.isNaN(Number(scores[attempt.question_id] ?? attempt.teacher_score)))} onClick={() => startTransition(async () => { await gradeSubmissionAction({ assignmentId, studentAssignmentId: submission.student_assignment_id, locale, approve: true, grades: submission.attempts.map((attempt) => ({ question_id: attempt.question_id, score: Number(scores[attempt.question_id] ?? attempt.teacher_score) })) }) })}>{locale === "ar" ? "اعتماد النتيجة" : "Approve result"}</Button></CardContent></Card>)}</div>
}
