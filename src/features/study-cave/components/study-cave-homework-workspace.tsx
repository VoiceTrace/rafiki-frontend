"use client"

import { useMemo, useState } from "react"
import { BookOpenCheck } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { StudentHomeworkMCQ } from "@/features/student-homework/components/student-homework-mcq"
import { useRouter } from "@/i18n/navigation"
import type { StudentAssignmentRead, StudentAssignmentWithQuestions, SubmissionResult } from "@/types/homework"

interface Props {
  assignments: StudentAssignmentRead[]
  selectedAssignment: StudentAssignmentWithQuestions | null
  initialResult: SubmissionResult | null
}

export function StudyCaveHomeworkWorkspace({ assignments, selectedAssignment, initialResult }: Props) {
  const t = useTranslations("studyCave.homeworkWorkspace")
  const locale = useLocale()
  const router = useRouter()
  const activeAssignments = useMemo(() => assignments.filter((assignment) => assignment.status !== "submitted"), [assignments])
  const [subject, setSubject] = useState(selectedAssignment?.subject ?? activeAssignments[0]?.subject ?? "")
  const chapters = useMemo(() => [...new Set(activeAssignments.filter((assignment) => assignment.subject === subject).map((assignment) => assignment.chapter))], [activeAssignments, subject])
  const [chapter, setChapter] = useState(selectedAssignment?.chapter ?? chapters[0] ?? "")
  const lessons = useMemo(() => activeAssignments.filter((assignment) => assignment.subject === subject && assignment.chapter === chapter), [activeAssignments, chapter, subject])

  if (selectedAssignment) {
    return <StudentHomeworkMCQ assignment={selectedAssignment} initialResult={initialResult} backHref="/student/study-cave?phase=homework" />
  }

  function chooseSubject(value: string | null) {
    if (!value) return
    setSubject(value)
    const nextChapter = activeAssignments.find((assignment) => assignment.subject === value)?.chapter ?? ""
    setChapter(nextChapter)
  }

  function chooseLesson(value: string | null) {
    if (!value) return
    router.push(`/student/study-cave?phase=homework&homeworkId=${encodeURIComponent(value)}`, { locale })
  }

  return (
    <section className="grid gap-4" data-testid="study-cave-homework-workspace">
      <header>
        <h2 className="font-heading text-section font-bold">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
      </header>
      {activeAssignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-14 text-center text-muted-foreground">
          <BookOpenCheck className="mx-auto mb-3 size-8 opacity-40" />
          <p className="font-medium">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
            {t("subject")}
            <Select value={subject} onValueChange={chooseSubject}>
              <SelectTrigger className="h-10 w-full bg-card text-foreground"><span>{subject}</span></SelectTrigger>
              <SelectContent>{[...new Set(activeAssignments.map((assignment) => assignment.subject))].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
            </Select>
          </label>
          <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
            {t("chapter")}
            <Select value={chapter} onValueChange={(value) => { if (value) setChapter(value) }}>
              <SelectTrigger className="h-10 w-full bg-card text-foreground"><span>{chapter}</span></SelectTrigger>
              <SelectContent>{chapters.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
            </Select>
          </label>
          <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
            {t("lesson")}
            <Select onValueChange={chooseLesson}>
              <SelectTrigger className="h-10 w-full bg-card text-foreground"><span>{t("chooseLesson")}</span></SelectTrigger>
              <SelectContent>{lessons.map((assignment) => <SelectItem key={assignment.id} value={assignment.id}>{assignment.lesson_id}</SelectItem>)}</SelectContent>
            </Select>
          </label>
        </div>
      )}
    </section>
  )
}
