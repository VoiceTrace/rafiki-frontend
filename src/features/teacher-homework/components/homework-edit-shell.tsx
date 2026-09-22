"use client"

import { useTransition, useState } from "react"
import { ArrowLeft, Loader2, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { deleteQuestionAction, deleteAssignmentAction } from "../actions/homework-actions"
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
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const isDraft = assignment.status === "draft"

  function handleDeleteAssignment() {
    if (!confirm(t("edit.confirmDelete"))) return
    startTransition(async () => {
      await deleteAssignmentAction(assignment.id, locale)
    })
  }

  function handleDeleteQuestion(questionId: string) {
    setDeletingId(questionId)
    startTransition(async () => {
      await deleteQuestionAction(assignment.id, questionId, locale)
      setDeletingId(null)
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-270 flex-col gap-5 pb-20">
      <header className="flex items-center gap-3">
        <Button render={<Link href="/teacher/homework" />} nativeButton={false} variant="ghost" size="icon" aria-label={t("back")}>
          <ArrowLeft className="rtl:-scale-x-100" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="font-heading text-section font-bold">{assignment.title}</h1>
          <p className="text-sm text-muted-foreground">{assignment.lesson_id}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[assignment.status] ?? STATUS_STYLES.draft}`}>
          {t(`status.${assignment.status}`)}
        </span>
        {isDraft && (
          <HomeworkDistributeDialog
            assignmentId={assignment.id}
            students={students}
            disabled={assignment.question_count === 0}
          />
        )}
        {isDraft && (
          <Button variant="ghost" size="icon" onClick={handleDeleteAssignment} disabled={isPending} aria-label={t("edit.delete")}>
            {isPending ? <Loader2 className="animate-spin" /> : <Trash2 className="size-4 text-destructive" />}
          </Button>
        )}
      </header>

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
                    <p className="text-sm font-semibold">
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
                          {opt.text}
                          {opt.id === q.correct_answer && (
                            <span className="ms-auto text-xs">{t("edit.correct")}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    {q.concept_ref && (
                      <p className="mt-2 text-xs text-muted-foreground">{t("edit.concept")}: {q.concept_ref}</p>
                    )}
                  </div>
                  {isDraft && (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingId === q.id}
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
          nextOrder={assignment.question_count}
        />
      )}
    </div>
  )
}
