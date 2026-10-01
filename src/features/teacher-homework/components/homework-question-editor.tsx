"use client"

import { useMemo, useState, useTransition } from "react"
import { Loader2, Minus, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { saveQuestionAction } from "../actions/homework-actions"
import type { QuestionTeacher } from "@/types/homework"

type Option = { id: string; text: string }

export function HomeworkQuestionEditor({ assignmentId, question, order, concepts, onDone }: {
  assignmentId: string
  question?: QuestionTeacher
  order: number
  concepts: { id: string; title: string }[]
  onDone?: () => void
}) {
  const t = useTranslations("teacherHomework.redesign.builder")
  const locale = useLocale()
  const [pending, startTransition] = useTransition()
  const [questionText, setQuestionText] = useState(question?.question_text ?? "")
  const [options, setOptions] = useState<Option[]>(question?.options ?? ["a", "b", "c", "d"].map((id) => ({ id, text: "" })))
  const [correctAnswer, setCorrectAnswer] = useState(question?.correct_answer ?? "a")
  const [conceptRef, setConceptRef] = useState(question?.concept_ref ?? concepts[0]?.id ?? "")
  const [hints, setHints] = useState<string[]>(question?.hints.length ? question.hints : [""])
  const [error, setError] = useState<string | null>(null)
  const normalizedOptions = useMemo(() => options.map((option) => option.text.trim().toLocaleLowerCase()), [options])

  function addOption() {
    const id = ["a", "b", "c", "d", "e", "f"].find((candidate) => !options.some((option) => option.id === candidate))
    if (id) setOptions((current) => [...current, { id, text: "" }])
  }

  function removeOption(id: string) {
    if (options.length <= 2) return
    const next = options.filter((option) => option.id !== id)
    setOptions(next)
    if (correctAnswer === id) setCorrectAnswer(next[0].id)
  }

  function submit() {
    const hasDuplicate = new Set(normalizedOptions).size !== normalizedOptions.length
    if (!questionText.trim()) return setError(t("errors.question"))
    if (options.length < 2 || options.some((option) => !option.text.trim())) return setError(t("errors.options"))
    if (hasDuplicate) return setError(t("errors.duplicate"))
    if (!correctAnswer || !options.some((option) => option.id === correctAnswer)) return setError(t("errors.correct"))
    if (!conceptRef) return setError(t("errors.concept"))
    if (hints.some((hint) => !hint.trim())) return setError(t("errors.hint"))
    setError(null)
    startTransition(async () => {
      const result = await saveQuestionAction({
        assignmentId, questionId: question?.id, locale, questionText: questionText.trim(),
        options: options.map((option) => ({ ...option, text: option.text.trim() })), correctAnswer,
        hints: hints.map((hint) => hint.trim()), conceptRef, order,
      })
      if (result.error) return setError(t("errors.save"))
      toast.success(question ? t("updated") : t("added"))
      onDone?.()
      if (!question) {
        setQuestionText("")
        setOptions(["a", "b", "c", "d"].map((id) => ({ id, text: "" })))
        setCorrectAnswer("a")
        setHints([""])
      }
    })
  }

  return <div className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
    <div className="grid gap-1.5">
      <label htmlFor={`question-${question?.id ?? "new"}`} className="text-sm font-semibold">{t("question")}</label>
      <Textarea id={`question-${question?.id ?? "new"}`} value={questionText} onChange={(event) => setQuestionText(event.target.value)} rows={3} disabled={pending} />
    </div>

    <fieldset className="grid gap-2" disabled={pending}>
      <legend className="mb-1 text-sm font-semibold">{t("options")}</legend>
      <RadioGroup value={correctAnswer} onValueChange={(value) => value && setCorrectAnswer(value)} aria-label={t("correctAnswer")}>
        {options.map((option, index) => <label key={option.id} className="flex items-center gap-3 rounded-xl border border-border p-3 focus-within:ring-2 focus-within:ring-ring">
          <RadioGroupItem value={option.id} aria-label={t("markCorrect", { option: option.id.toUpperCase() })} />
          <span className="w-5 font-mono text-sm font-bold text-muted-foreground">{option.id.toUpperCase()}</span>
          <Input value={option.text} onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, text: event.target.value } : item))} aria-label={t("option", { option: option.id.toUpperCase() })} />
          <Button type="button" variant="ghost" size="icon" disabled={options.length <= 2} onClick={() => removeOption(option.id)} aria-label={t("removeOption", { option: option.id.toUpperCase() })}><Minus className="size-4" /></Button>
        </label>)}
      </RadioGroup>
      <Button type="button" variant="outline" size="sm" className="w-fit" disabled={options.length >= 6} onClick={addOption}><Plus className="size-4" />{t("addOption")}</Button>
    </fieldset>

    <div className="grid gap-1.5">
      <label className="text-sm font-semibold">{t("concept")}</label>
      <Select value={conceptRef} onValueChange={(value) => value && setConceptRef(value)} disabled={pending}>
        <SelectTrigger className="w-full"><span>{concepts.find((concept) => concept.id === conceptRef)?.title ?? t("chooseConcept")}</span></SelectTrigger>
        <SelectContent>{concepts.map((concept) => <SelectItem key={concept.id} value={concept.id}>{concept.title}</SelectItem>)}</SelectContent>
      </Select>
    </div>

    <fieldset className="grid gap-3" disabled={pending}>
      <div className="flex items-center justify-between gap-3"><legend className="text-sm font-semibold">{t("hints")}</legend><span className="text-xs text-muted-foreground">{t("hintCount", { count: hints.length })}</span></div>
      {hints.map((hint, index) => <div key={index} className="flex items-start gap-2">
        <Textarea value={hint} onChange={(event) => setHints((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} rows={2} aria-label={t("hint", { number: index + 1 })} placeholder={t("hintPlaceholder", { number: index + 1 })} />
        <Button type="button" variant="ghost" size="icon" onClick={() => setHints((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={t("removeHint", { number: index + 1 })}><Minus className="size-4" /></Button>
      </div>)}
      {hints.length < 3 && <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => setHints((current) => [...current, ""])}><Plus className="size-4" />{t("addHint")}</Button>}
    </fieldset>

    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="flex justify-end gap-2">{question && <Button type="button" variant="outline" onClick={onDone} disabled={pending}>{t("cancel")}</Button>}<Button type="button" onClick={submit} disabled={pending}>{pending && <Loader2 className="animate-spin" />}{question ? t("save") : t("addQuestion")}</Button></div>
  </div>
}
