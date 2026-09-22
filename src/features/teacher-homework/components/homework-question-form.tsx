"use client"

import { useActionState, useState } from "react"
import { Loader2, Minus, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addQuestionAction } from "../actions/homework-actions"

interface Props {
  assignmentId: string
  nextOrder: number
}

interface OptionRow {
  id: string
  text: string
}

const DEFAULT_OPTIONS: OptionRow[] = [
  { id: "a", text: "" },
  { id: "b", text: "" },
  { id: "c", text: "" },
  { id: "d", text: "" },
]

export function HomeworkQuestionForm({ assignmentId, nextOrder }: Props) {
  const t = useTranslations("teacherHomework")
  const locale = useLocale()
  const [options, setOptions] = useState<OptionRow[]>(DEFAULT_OPTIONS)
  const [correctAnswer, setCorrectAnswer] = useState("a")
  const [state, formAction, isPending] = useActionState(addQuestionAction, null)

  function addOption() {
    if (options.length >= 6) return
    const nextId = String.fromCharCode(97 + options.length) // a, b, c, ...
    setOptions((prev) => [...prev, { id: nextId, text: "" }])
  }

  function removeOption(idx: number) {
    if (options.length <= 2) return
    setOptions((prev) => prev.filter((_, i) => i !== idx))
    if (correctAnswer === options[idx].id) setCorrectAnswer(options[0]?.id ?? "a")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("question.addTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="assignment_id" value={assignmentId} />
          <input type="hidden" name="order" value={nextOrder} />
          <input type="hidden" name="correct_answer" value={correctAnswer} />

          {/* Inject option id/text pairs for the server action parser */}
          {options.map((opt, idx) => (
            <input key={`id-${idx}`} type="hidden" name={`option_id_${idx}`} value={opt.id} />
          ))}

          <div className="grid gap-1.5">
            <label className="text-sm font-semibold">{t("question.text")} *</label>
            <Textarea
              name="question_text"
              required
              rows={3}
              placeholder={t("question.textPlaceholder")}
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-semibold">{t("question.conceptRef")}</label>
            <Input name="concept_ref" placeholder={t("question.conceptRefPlaceholder")} />
          </div>

          <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold">{t("question.options")} *</legend>
            {options.map((opt, idx) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={`correct_${opt.id}`}
                  name="correct_radio"
                  value={opt.id}
                  checked={correctAnswer === opt.id}
                  onChange={() => setCorrectAnswer(opt.id)}
                  aria-label={t("question.markCorrect", { id: opt.id })}
                  className="h-4 w-4 shrink-0 accent-primary"
                />
                <span className="w-5 shrink-0 font-mono text-sm font-bold text-muted-foreground">
                  {opt.id.toUpperCase()}
                </span>
                <Input
                  name={`option_text_${idx}`}
                  required
                  value={opt.text}
                  onChange={(e) =>
                    setOptions((prev) =>
                      prev.map((o, i) => (i === idx ? { ...o, text: e.target.value } : o)),
                    )
                  }
                  placeholder={t("question.optionPlaceholder", { id: opt.id.toUpperCase() })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={options.length <= 2}
                  onClick={() => removeOption(idx)}
                  aria-label={t("question.removeOption")}
                >
                  <Minus className="size-4" />
                </Button>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">{t("question.correctHint")}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              disabled={options.length >= 6}
              onClick={addOption}
            >
              <Plus className="size-4" />
              {t("question.addOption")}
            </Button>
          </fieldset>

          {state?.error && (
            <p role="alert" className="text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" disabled={isPending} className="w-full sm:w-auto sm:self-end">
            {isPending && <Loader2 className="animate-spin" />}
            {t("question.add")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
