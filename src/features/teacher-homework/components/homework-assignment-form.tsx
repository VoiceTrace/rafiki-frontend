"use client"

import { useActionState, useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Link } from "@/i18n/navigation"
import { createAssignmentAction, updateAssignmentAction, type HomeworkActionState } from "../actions/homework-actions"
import { HomeworkDueDate, normalizeDueDate } from "./homework-due-date"
import type { AssignmentRead } from "@/types/homework"

interface Props {
  assignment?: AssignmentRead
  embedded?: boolean
  onSaved?: () => void
}

export function HomeworkAssignmentForm({ assignment, embedded = false, onSaved }: Props) {
  const t = useTranslations("teacherHomework")
  const locale = useLocale()
  const isEdit = Boolean(assignment)

  const action = isEdit ? updateAssignmentAction : createAssignmentAction
  const [title, setTitle] = useState(assignment?.title ?? "")
  const [lessonId, setLessonId] = useState(assignment?.lesson_id ?? "")
  const [description, setDescription] = useState(assignment?.description ?? "")
  const [state, formAction, isPending] = useActionState(async (prev: HomeworkActionState | null, form: FormData) => {
    normalizeDueDate(form)
    const result = await action(prev, form)
    if (result.success) onSaved?.()
    return result
  }, null)

  return (
    <div className={embedded ? "w-full" : "mx-auto flex w-full max-w-160 flex-col gap-5 pb-20"}>
      {!embedded && <header className="flex items-center gap-2">
        <Button render={<Link href="/teacher/homework" />} nativeButton={false} variant="ghost" size="icon" aria-label={t("back")}>
          <ArrowLeft className="rtl:-scale-x-100" />
        </Button>
        <h1 className="font-heading text-section font-bold">
          {isEdit ? t("edit.title") : t("create.title")}
        </h1>
      </header>}

      <Card>
        <CardHeader>
          <CardTitle>{t("form.details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-4">
            <fieldset disabled={isPending} className="grid min-w-0 gap-4">
            <input type="hidden" name="locale" value={locale} />
            {isEdit && <input type="hidden" name="assignment_id" value={assignment!.id} />}

            <div className="grid gap-1.5">
              <label htmlFor="lesson_id" className="text-sm font-semibold">
                {t("form.lessonId")} <span aria-hidden="true">*</span>
              </label>
              <Input
                id="lesson_id"
                name="lesson_id"
                required
                maxLength={100}
                value={lessonId}
                onChange={(event) => setLessonId(event.target.value)}
                placeholder={t("form.lessonIdPlaceholder")}
                disabled={isEdit}
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="title" className="text-sm font-semibold">
                {t("form.title")} <span aria-hidden="true">*</span>
              </label>
              <Input
                id="title"
                name="title"
                required
                maxLength={500}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={t("form.titlePlaceholder")}
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="description" className="text-sm font-semibold">
                {t("form.description")}
              </label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={t("form.descriptionPlaceholder")}
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="due_at" className="text-sm font-semibold">
                {t("form.dueAt")}
              </label>
              <HomeworkDueDate id="due_at" value={assignment?.due_at} />
            </div>

            {state?.error && (
              <p role="alert" className="text-sm text-destructive">
                {t(`errors.${state.error}`)}
              </p>
            )}

            {state?.success && <p role="status">{t("form.saved")}</p>}
            <Button type="submit" disabled={isPending || !title.trim() || !lessonId.trim()} className="w-full sm:w-auto sm:self-end">
              {isPending && <Loader2 className="animate-spin" />}
              {isEdit ? t("form.save") : t("form.create")}
            </Button>
            </fieldset>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
