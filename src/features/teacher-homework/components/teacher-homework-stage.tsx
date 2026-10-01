"use client"

import { useActionState, useState, useTransition } from "react"
import { ArrowDown, ArrowUp, CalendarDays, Eye, Loader2, Pencil, Send, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { HomeworkDueDate, normalizeDueDate } from "./homework-due-date"
import { HomeworkQuestionEditor } from "./homework-question-editor"
import { TeacherHomeworkResults } from "./teacher-homework-results"
import {
  createAssignmentAction,
  deleteQuestionAction,
  distributeAssignmentAction,
  reorderQuestionsAction,
  updateAssignmentAction,
  type HomeworkActionState,
} from "../actions/homework-actions"
import type { AssignmentRead, AssignmentWithQuestions, TeacherSubmission } from "@/types/homework"

type LessonContext = {
  grade: string
  subjectId: string
  subjectTitle: string
  chapterId: string
  chapterTitle: string
  lessonId: string
  lessonTitle: string
  concepts: { id: string; title: string }[]
}

function AssignmentDetailsForm({ context, assignment }: { context: LessonContext; assignment?: AssignmentWithQuestions }) {
  const t = useTranslations("teacherHomework.redesign")
  const locale = useLocale()
  const action = assignment ? updateAssignmentAction : createAssignmentAction
  const [state, formAction, pending] = useActionState(async (previous: HomeworkActionState | null, form: FormData) => {
    normalizeDueDate(form)
    const result = await action(previous, form)
    if (result.success) toast.success(t("draftSaved"))
    return result
  }, null)
  return <Card>
    <CardHeader><CardTitle>{assignment ? t("details.editTitle") : t("details.title")}</CardTitle></CardHeader>
    <CardContent><form action={formAction} className="grid gap-4">
      <fieldset disabled={pending} className="grid gap-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="lesson_workspace" value="1" />
        <input type="hidden" name="subject_id" value={context.subjectId} />
        <input type="hidden" name="chapter_id" value={context.chapterId} />
        <input type="hidden" name="grade_level" value={context.grade} />
        <input type="hidden" name="subject" value={context.subjectTitle} />
        <input type="hidden" name="chapter" value={context.chapterTitle} />
        <input type="hidden" name="lesson_id" value={context.lessonId} />
        {assignment && <input type="hidden" name="assignment_id" value={assignment.id} />}
        <div className="grid gap-1.5"><label htmlFor="homework-title" className="text-sm font-semibold">{t("details.homeworkTitle")}</label><Input id="homework-title" name="title" defaultValue={assignment?.title} required maxLength={500} /></div>
        <div className="grid gap-1.5"><label htmlFor="homework-description" className="text-sm font-semibold">{t("details.description")}</label><Textarea id="homework-description" name="description" defaultValue={assignment?.description ?? ""} rows={3} /></div>
        <div className="grid gap-1.5"><label htmlFor="homework-due" className="text-sm font-semibold">{t("details.due")}</label><HomeworkDueDate id="homework-due" value={assignment?.due_at} /></div>
        {state?.error && <p role="alert" className="text-sm text-destructive">{t("saveError")}</p>}
        <Button type="submit" className="w-full sm:w-fit sm:justify-self-end" disabled={pending}>{pending && <Loader2 className="animate-spin" />}{t("saveDraft")}</Button>
      </fieldset>
    </form></CardContent>
  </Card>
}

function StudentPreview({ assignment }: { assignment: AssignmentWithQuestions }) {
  const t = useTranslations("teacherHomework.redesign.preview")
  const [index, setIndex] = useState(0)
  const question = assignment.questions[index]
  if (!question) return <p className="text-sm text-muted-foreground">{t("empty")}</p>
  return <div className="grid gap-4">
    <div className="flex items-center justify-between text-sm"><strong>{t("progress", { current: index + 1, total: assignment.questions.length })}</strong><span className="text-muted-foreground">{assignment.title}</span></div>
    <div className="rounded-2xl border border-border p-4"><h3 className="font-semibold">{question.question_text}</h3><div className="mt-4 grid gap-2">{question.options.map((option) => <div key={option.id} className="rounded-xl border border-border px-4 py-3 text-sm">{option.id.toUpperCase()}. {option.text}</div>)}</div></div>
    <div className="flex justify-between"><Button variant="outline" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>{t("previous")}</Button><Button disabled={index === assignment.questions.length - 1} onClick={() => setIndex((value) => value + 1)}>{t("next")}</Button></div>
  </div>
}

export function TeacherHomeworkStage({ context, assignments, assignment, submissions, activeStudentCount, onSelectAssignment }: {
  context: LessonContext
  assignments: AssignmentRead[]
  assignment: AssignmentWithQuestions | null
  submissions: TeacherSubmission[]
  activeStudentCount: number
  onSelectAssignment: (id: string) => void
}) {
  const t = useTranslations("teacherHomework.redesign")
  const locale = useLocale()
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  if (!context.lessonId) return <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">{t("chooseLesson")}</div>

  if (!assignment) return <section className="grid gap-4"><div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center"><h2 className="font-heading text-xl font-bold">{t("empty.title")}</h2><p className="mt-2 text-sm text-muted-foreground">{t("empty.description")}</p></div><AssignmentDetailsForm context={context} /></section>

  if (assignment.status !== "draft") return <TeacherHomeworkResults assignment={assignment} submissions={submissions} />

  function moveQuestion(index: number, direction: -1 | 1) {
    if (!assignment) return
    const ordered = [...assignment.questions]
    const target = index + direction
    if (target < 0 || target >= ordered.length) return
    ;[ordered[index], ordered[target]] = [ordered[target], ordered[index]]
    startTransition(async () => {
      const result = await reorderQuestionsAction(assignment.id, ordered.map((question) => question.id), locale)
      if (result.error) setError(t("reorderError")); else toast.success(t("reordered"))
    })
  }

  function removeQuestion(questionId: string) {
    if (!assignment) return
    startTransition(async () => {
      const result = await deleteQuestionAction(assignment.id, questionId, locale)
      if (result.error) setError(t("deleteError")); else toast.success(t("deleted"))
    })
  }

  function distribute() {
    if (!assignment) return
    startTransition(async () => {
      const result = await distributeAssignmentAction(assignment.id, assignment.due_at ?? undefined, locale)
      if (result.error) setError(t("distributeError")); else toast.success(t("distributed"))
    })
  }

  return <section className="grid gap-5">
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-heading text-xl font-bold">{assignment.title}</h2><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">{t("status.draft")}</span></div><p className="mt-1 text-sm text-muted-foreground">{t("questionCount", { count: assignment.question_count })}{assignment.due_at ? ` · ${t("due", { date: new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(assignment.due_at)) })}` : ""}</p></div>
      {assignments.length > 1 && <select value={assignment.id} onChange={(event) => onSelectAssignment(event.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" aria-label={t("chooseAssignment")}>{assignments.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select>}
      <Dialog><DialogTrigger render={<Button variant="outline" disabled={assignment.questions.length === 0} />}><Eye className="size-4" />{t("preview.trigger")}</DialogTrigger><DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{t("preview.title")}</DialogTitle><DialogDescription>{t("preview.description")}</DialogDescription></DialogHeader><StudentPreview assignment={assignment} /></DialogContent></Dialog>
      <Button disabled={pending || assignment.questions.length === 0 || activeStudentCount === 0} onClick={distribute}><Send className="size-4" />{pending ? t("distributing") : t("distribute", { count: activeStudentCount })}</Button>
    </div>
    <AssignmentDetailsForm context={context} assignment={assignment} />
    <Card><CardHeader><CardTitle>{t("questionsTitle")}</CardTitle></CardHeader><CardContent className="grid gap-3">
      {assignment.questions.length === 0 && <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">{t("noQuestions")}</p>}
      {assignment.questions.map((question, index) => editingQuestion === question.id ? <HomeworkQuestionEditor key={question.id} assignmentId={assignment.id} question={question} order={index} concepts={context.concepts} onDone={() => setEditingQuestion(null)} /> : <div key={question.id} className="rounded-2xl border border-border p-4">
        <div className="flex items-start gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold">{index + 1}</span><div className="min-w-0 flex-1"><p className="font-semibold">{question.question_text}</p><p className="mt-1 text-xs text-muted-foreground">{context.concepts.find((concept) => concept.id === question.concept_ref)?.title ?? question.concept_ref}</p></div><div className="flex"><Button size="icon" variant="ghost" disabled={index === 0 || pending} onClick={() => moveQuestion(index, -1)} aria-label={t("moveUp")}><ArrowUp className="size-4" /></Button><Button size="icon" variant="ghost" disabled={index === assignment.questions.length - 1 || pending} onClick={() => moveQuestion(index, 1)} aria-label={t("moveDown")}><ArrowDown className="size-4" /></Button><Button size="icon" variant="ghost" disabled={pending} onClick={() => setEditingQuestion(question.id)} aria-label={t("editQuestion")}><Pencil className="size-4" /></Button><Button size="icon" variant="ghost" disabled={pending} onClick={() => removeQuestion(question.id)} aria-label={t("deleteQuestion")}><Trash2 className="size-4 text-destructive" /></Button></div></div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">{question.options.map((option) => <div key={option.id} className={`rounded-xl px-3 py-2 text-sm ${option.id === question.correct_answer ? "bg-success/25 font-semibold text-success-foreground" : "bg-secondary/40"}`}>{option.id.toUpperCase()}. {option.text}</div>)}</div>
        {question.hints.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{question.hints.map((hint, hintIndex) => <span key={hintIndex} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{t("hint", { number: hintIndex + 1 })}: {hint}</span>)}</div>}
      </div>)}
    </CardContent></Card>
    <div><h2 className="mb-3 font-heading text-xl font-bold">{t("addQuestion")}</h2><HomeworkQuestionEditor assignmentId={assignment.id} order={assignment.questions.length} concepts={context.concepts} /></div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-4" />{t("lockNote")}</div>
  </section>
}
