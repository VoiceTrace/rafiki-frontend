"use client"

import { useState, useTransition } from "react"
import { ArrowLeft, BarChart3, CircleCheck, Loader2, MessageCircleQuestion, MoreHorizontal, NotebookPen, Sparkles, UsersRound, Video } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LessonStageTabs } from "@/components/shared/lesson-stage-tabs"
import { TeacherLiveSessionPanel } from "@/features/live-session/components/teacher-live-session-panel"
import { TeacherHomeworkStage } from "@/features/teacher-homework/components/teacher-homework-stage"
import { usePathname, useRouter } from "@/i18n/navigation"
import { TeacherBeforeClassPreparation } from "./teacher-before-class-preparation"
import type { ReviewChapter, ReviewLesson, ReviewSubject } from "@/features/study-cave/review-types"
import type { AssignmentRead, AssignmentWithQuestions, TeacherSubmission } from "@/types/homework"

type ReadyData = {
  status: "ready"
  grades: string[]
  selectedGrade: string
  subjects: ReviewSubject[]
  chapters: ReviewChapter[]
  lessons: ReviewLesson[]
  selectedSubjectId: string
  selectedChapterId: string
  selectedLesson: ReviewLesson | null
  assignments: AssignmentRead[]
  assignment: AssignmentWithQuestions | null
  submissions: TeacherSubmission[]
  activeStudentCount: number
  initialStage: string
}

export type TeacherLessonData = ReadyData | { status: "error" | "permission" }

function TeacherDuringContent() {
  const t = useTranslations("teacherLesson.during")
  const [notes, setNotes] = useState(t("notesText"))
  return <section className="grid gap-4 lg:grid-cols-2"><div className="grid gap-4"><Card><CardHeader><CardTitle className="flex gap-2"><MessageCircleQuestion className="size-5" />{t("questions")}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{t("questionOne")}</CardContent></Card><Card><CardHeader><CardTitle className="flex gap-2"><NotebookPen className="size-5" />{t("notes")}</CardTitle></CardHeader><CardContent><Textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={7} /><p className="mt-2 text-end text-xs text-success-foreground">{t("autosaved")}</p></CardContent></Card></div><div className="grid content-start gap-4"><Card><CardHeader><CardTitle className="flex gap-2"><UsersRound className="size-5" />{t("readiness")}</CardTitle></CardHeader><CardContent className="grid gap-2 text-sm">{["devices", "materials", "joined", "support"].map((key) => <div className="flex items-center gap-2" key={key}><CircleCheck className="size-4 text-success-foreground" /><span>{t(key)}</span></div>)}</CardContent></Card><Card><CardHeader><CardTitle className="flex gap-2"><Video className="size-5" />{t("observation")}</CardTitle></CardHeader><CardContent className="rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">{t("demoDescription")}</CardContent></Card></div></section>
}

function PlaceholderStage({ kind }: { kind: "insights" | "after" }) {
  const t = useTranslations(`teacherLesson.${kind}`)
  return <Card><CardHeader><CardTitle className="flex items-center gap-2">{kind === "insights" ? <BarChart3 className="size-5 text-primary" /> : <Sparkles className="size-5 text-primary" />}{t("title")}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{t("description")}</p></CardContent></Card>
}

export function TeacherLessonPage({ data }: { data: TeacherLessonData }) {
  const t = useTranslations("teacherLesson")
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  const [tab, setTab] = useState(data.status === "ready" ? data.initialStage : "before")

  if (data.status !== "ready") return <div className="mx-auto grid min-h-72 max-w-xl place-items-center rounded-2xl border border-dashed bg-card p-8 text-center"><div><h1 className="font-heading text-section font-bold">{t(data.status === "permission" ? "permission.title" : "error.title")}</h1><p className="mt-2 text-sm text-muted-foreground">{t(data.status === "permission" ? "permission.description" : "error.description")}</p>{data.status === "error" && <Button className="mt-4" variant="outline" onClick={() => router.refresh()}>{t("error.retry")}</Button>}</div></div>

  const queryFor = (updates: Record<string, string>) => {
    const query = new URLSearchParams({
      grade: data.selectedGrade,
      subject_id: data.selectedSubjectId,
      chapter_id: data.selectedChapterId,
      lesson_id: data.selectedLesson?.id ?? "",
      stage: tab,
      ...updates,
    })
    for (const [key, value] of [...query.entries()]) if (!value) query.delete(key)
    startTransition(() => router.push(`${pathname}?${query.toString()}`, { scroll: false }))
  }

  const changeTab = (value: string) => {
    setTab(value)
    queryFor({ stage: value })
  }

  const context = {
    grade: data.selectedGrade,
    subjectId: data.selectedSubjectId,
    subjectTitle: data.subjects.find((subject) => subject.id === data.selectedSubjectId)?.title ?? "",
    chapterId: data.selectedChapterId,
    chapterTitle: data.chapters.find((chapter) => chapter.id === data.selectedChapterId)?.title ?? "",
    lessonId: data.selectedLesson?.id ?? "",
    lessonTitle: data.selectedLesson?.title ?? "",
    concepts: data.selectedLesson?.concept_refs.map((concept) => ({ id: concept.id, title: concept.title })) ?? [],
  }

  return <div className="mx-auto flex w-full max-w-300 flex-col gap-4 pb-24">
    <header className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label={t("back")}><ArrowLeft className="rtl:-scale-x-100" /></Button><div className="min-w-0 flex-1"><h1 className="truncate font-heading text-section font-bold">{data.selectedLesson ? t("lessonTitle", { lesson: data.selectedLesson.title }) : t("title")}</h1><p className="text-sm text-muted-foreground">{t("context", { grade: data.selectedGrade || t("noGrade"), subject: context.subjectTitle || t("noSubject") })}</p></div><Button variant="ghost" size="icon" aria-label={t("more")}><MoreHorizontal /></Button></header>
    <section className="grid gap-3 md:grid-cols-3" aria-label={t("selectorsLabel")}>
      {data.grades.length > 1 && <label className="grid gap-1 text-xs font-semibold text-muted-foreground">{t("grade")}<Select value={data.selectedGrade} onValueChange={(value) => value && queryFor({ grade: value })} disabled={pending}><SelectTrigger className="w-full"><span>{data.selectedGrade}</span></SelectTrigger><SelectContent>{data.grades.map((grade) => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}</SelectContent></Select></label>}
      <label className="grid gap-1 text-xs font-semibold text-muted-foreground">{t("subject")}<Select value={data.selectedSubjectId} onValueChange={(value) => value && queryFor({ subject_id: value, chapter_id: "", lesson_id: "", assignment_id: "" })} disabled={pending}><SelectTrigger className="w-full"><span>{context.subjectTitle}</span></SelectTrigger><SelectContent>{data.subjects.map((subject) => <SelectItem key={subject.id} value={subject.id}>{subject.title}</SelectItem>)}</SelectContent></Select></label>
      <label className="grid gap-1 text-xs font-semibold text-muted-foreground">{t("chapter")}<Select value={data.selectedChapterId} onValueChange={(value) => value && queryFor({ chapter_id: value, lesson_id: "", assignment_id: "" })} disabled={pending}><SelectTrigger className="w-full"><span>{context.chapterTitle}</span></SelectTrigger><SelectContent>{data.chapters.map((chapter) => <SelectItem key={chapter.id} value={chapter.id}>{chapter.title}</SelectItem>)}</SelectContent></Select></label>
      <label className="grid gap-1 text-xs font-semibold text-muted-foreground">{t("lesson")}<Select value={data.selectedLesson?.id ?? null} onValueChange={(value) => value && queryFor({ lesson_id: value, assignment_id: "" })} disabled={pending}><SelectTrigger className="w-full"><span>{data.selectedLesson?.title ?? t("chooseLesson")}</span></SelectTrigger><SelectContent>{data.lessons.map((lesson) => <SelectItem key={lesson.id} value={lesson.id}>{lesson.title}</SelectItem>)}</SelectContent></Select></label>
    </section>
    {pending && <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />{t("loading")}</p>}
    <LessonStageTabs active={tab} ariaLabel={t("stagesLabel")} onChange={changeTab} items={( ["before", "during", "insights", "after", "homework"] as const).map((value) => ({ value, label: t(`tabs.${value}`) }))} />
    {!data.selectedLesson ? <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">{t("chooseLesson")}</div> : tab === "during" ? <><TeacherLiveSessionPanel variant="during" /><TeacherDuringContent /></> : tab === "insights" ? <PlaceholderStage kind="insights" /> : tab === "after" ? <PlaceholderStage kind="after" /> : tab === "homework" ? <TeacherHomeworkStage context={context} assignments={data.assignments} assignment={data.assignment} submissions={data.submissions} activeStudentCount={data.activeStudentCount} onSelectAssignment={(assignmentId) => queryFor({ assignment_id: assignmentId, stage: "homework" })} /> : <><TeacherLiveSessionPanel variant="before" /><TeacherBeforeClassPreparation /></>}
  </div>
}
