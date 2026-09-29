"use client"

import { useTransition, useState } from "react"
import { ArrowLeft, Loader2, Trash2 } from "lucide-react"
import { useFormatter, useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { deleteQuestionAction, deleteAssignmentAction, type HomeworkActionState } from "../actions/homework-actions"
import { HomeworkAssignmentForm } from "./homework-assignment-form"
import { HomeworkQuestionForm } from "./homework-question-form"
import { HomeworkDistributeDialog } from "./homework-distribute-dialog"
import type { AssignmentWithQuestions } from "@/types/homework"
import type { User } from "@/types/user"

interface Props {
  assignment: AssignmentWithQuestions
  students: User[]
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-secondary text-secondary-foreground",
  distributed: "bg-primary/15 text-primary",
  closed: "bg-muted text-muted-foreground",
}

export function HomeworkEditShell({ assignment, students }: Props) {
  const t = useTranslations("teacherHomework")
  const locale = useLocale()
  const format = useFormatter()
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<HomeworkActionState["error"]>()
  const [saved, setSaved] = useState(false)

  const isDraft = assignment.status === "draft"

  function handleDeleteAssignment() {
    if (!confirm(t("edit.confirmDelete"))) return
    startTransition(async () => {
      const result = await deleteAssignmentAction(assignment.id, locale)
      setError(result.error)
    })
  }

  function handleDeleteQuestion(questionId: string) {
    setDeletingId(questionId)
    startTransition(async () => {
      const result = await deleteQuestionAction(assignment.id, questionId, locale)
      setError(result.error)
      setDeletingId(null)
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-270 flex-col gap-5 pb-20">
      <header className="flex flex-wrap items-center gap-3">
        <Button render={<Link href="/teacher/homework" />} nativeButton={false} variant="ghost" size="icon" aria-label={t("back")}>
          <ArrowLeft className="rtl:-scale-x-100" />
        </Button>
        <div className="min-w-0 flex-1 basis-40">
          <h1 className="break-words font-heading text-section font-bold">{assignment.title}</h1>
          <p className="break-words text-sm text-muted-foreground">{assignment.lesson_id}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[assignment.status] ?? STATUS_STYLES.draft}`}>
          {t(`status.${assignment.status}`)}
        </span>
        {isDraft && (
          <Button variant="outline" size="sm" disabled={isPending} onClick={() => { setEditing(!editing); setSaved(false) }}>
            {editing ? t("edit.cancel") : t("edit.editDetails")}
          </Button>
        )}
        {isDraft && (
          <HomeworkDistributeDialog
            assignmentId={assignment.id}
            students={students}
            disabled={assignment.question_count === 0 || isPending || editing}
          />
        )}
        {isDraft && (
          <Button variant="ghost" size="icon" onClick={handleDeleteAssignment} disabled={isPending} aria-label={t("edit.delete")}>
            {isPending ? <Loader2 className="animate-spin" /> : <Trash2 className="size-4 text-destructive" />}
          </Button>
        )}
      </header>
      {assignment.description && <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">{assignment.description}</p>}
      {assignment.due_at && <p className="text-sm text-muted-foreground">{t("form.dueAt")}: {format.dateTime(new Date(assignment.due_at), { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Riyadh" })} ({t("form.timeZone")})</p>}
      {error && <p role="alert" className="text-sm text-destructive">{t(`errors.${error}`)}</p>}
      {saved && <p role="status" className="text-sm text-success-foreground">{t("form.saved")}</p>}
      {editing && <HomeworkAssignmentForm assignment={assignment} embedded onSaved={() => { setEditing(false); setSaved(true) }} />}

      {/* Question list */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("edit.questions")} ({assignment.question_count})
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {assignment.questions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("edit.noQuestions")}</p>
          ) : (
            assignment.questions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold">
                      {idx + 1}. {q.question_text}
                    </p>
                    <ul className="mt-2 grid gap-1">
                      {q.options.map((opt) => (
                        <li
                          key={opt.id}
                          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                            opt.id === q.correct_answer
                              ? "bg-success/30 font-semibold text-success-foreground"
                              : "bg-secondary/30"
                          }`}
                        >
                          <span className="font-mono text-xs">{opt.id.toUpperCase()}</span>
                          <span className="min-w-0 break-words">{opt.text}</span>
                          {opt.id === q.correct_answer && (
                            <span className="ms-auto text-xs">{t("edit.correct")}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 grid gap-1.5 rounded-lg bg-secondary/30 p-3">
                      <p className="text-xs font-semibold text-muted-foreground">{t("question.hints")}</p>
                      {q.hints.map((hint, hintIndex) => (
                        <p key={hintIndex} className="break-words text-sm">
                          {t("question.hintLabel", { number: hintIndex + 1 })}: {hint}
                        </p>
                      ))}
                    </div>
                    {q.concept_ref && (
                      <p className="mt-2 text-xs text-muted-foreground">{t("edit.concept")}: {q.concept_ref}</p>
                    )}
                  </div>
                  {isDraft && (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      onClick={() => handleDeleteQuestion(q.id)}
                      aria-label={t("edit.deleteQuestion")}
                    >
                      {deletingId === q.id ? <Loader2 className="animate-spin size-4" /> : <Trash2 className="size-4 text-destructive" />}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {isDraft && (
        <HomeworkQuestionForm
          assignmentId={assignment.id}
          nextOrder={Math.max(-1, ...assignment.questions.map((question) => question.order)) + 1}
        />
      )}
    </div>
  )
}
