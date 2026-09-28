"use client";

import {useState} from "react";
import {AlertTriangle, BarChart3, BookOpenCheck, CircleHelp, UsersRound} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import type {MasteryBand, ReviewSessionItem} from "@/features/teacher-students/types";
import type {TeacherLessonReviewData} from "../server/teacher-lesson-review-api";

const bands: MasteryBand[] = ["secure", "developing", "needs_support"];
const percent = (value: number | null) => value === null ? "—" : `${Math.round(value * 100)}%`;

export function TeacherAfterClassReview({data}: {data: TeacherLessonReviewData}) {
  const t = useTranslations("teacherLesson.after");
  const locale = useLocale();
  const [selectedSession, setSelectedSession] = useState<ReviewSessionItem | null>(null);
  if (data.error) return <ReviewState icon={AlertTriangle} title={t("errorTitle")} description={t("errorDescription")}/>;
  if (!data.selectedClass || !data.mastery || !data.sessions) {
    return <ReviewState icon={UsersRound} title={t("emptyClassTitle")} description={t("emptyClassDescription")}/>;
  }
  const {mastery, sessions} = data;
  const completedWithSupport = sessions.items.filter((session) =>
    session.concepts.some((concept) => concept.completed_with_support)).length;
  const needsSupport = mastery.students.filter((student) => student.mastery_band === "needs_support").length;
  const counts = mastery.band_counts;
  return <section className="grid gap-4" data-testid="teacher-after-class-review">
    <Card>
      <CardContent>
        <form method="get" className="grid items-end gap-3 sm:grid-cols-[1fr_auto]">
          <label className="grid gap-1 text-sm font-medium">{t("classLabel")}
            <select name="class_id" defaultValue={data.selectedClass.id} className="h-10 rounded-lg border border-input bg-background px-3">
              {data.classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <input type="hidden" name="lesson_id" value={data.lessonId}/>
          <input type="hidden" name="phase" value="after"/>
          <Button type="submit">{t("apply")}</Button>
        </form>
      </CardContent>
    </Card>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric icon={BookOpenCheck} label={t("completedReviews")} value={`${sessions.total}/${mastery.enrolled_student_count}`}/>
      <Metric icon={BarChart3} label={t("averageMastery")} value={percent(mastery.average_mastery)}/>
      <Metric icon={UsersRound} label={t("needsSupport")} value={String(needsSupport)}/>
      <Metric icon={CircleHelp} label={t("supportedReviews")} value={String(completedWithSupport)}/>
    </section>
    <section className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
      <Card>
        <CardHeader><CardTitle>{t("studentResults")}</CardTitle><CardDescription>{t("studentResultsDescription")}</CardDescription></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-170 text-sm">
            <thead><tr className="border-b text-muted-foreground">
              <th className="p-3 text-start">{t("student")}</th><th className="p-3 text-start">{t("mastery")}</th>
              <th className="p-3 text-start">{t("attempts")}</th><th className="p-3 text-start">{t("support")}</th>
              <th className="p-3 text-end">{t("action")}</th>
            </tr></thead>
            <tbody>{mastery.students.map((student) => {
              const session = sessions.items.find((item) => item.student_id === student.student_id);
              return <tr className="border-b last:border-0" key={student.student_id}>
                <td className="p-3 font-medium">{student.full_name}</td>
                <td className="p-3">{percent(student.mastery_score)} <span className="ms-2 text-xs text-muted-foreground">{student.mastery_band ? t(`bands.${student.mastery_band}`) : t("noEvidence")}</span></td>
                <td className="p-3">{session?.total_attempts ?? "—"}</td>
                <td className="p-3">{session ? t(session.concepts.some((item) => item.completed_with_support) ? "used" : "independent") : "—"}</td>
                <td className="p-3 text-end"><span className="inline-flex gap-3">
                  {session ? <button className="font-medium text-primary hover:underline" type="button" onClick={() => setSelectedSession(session)}>{t("summary")}</button> : null}
                  <Link className="font-medium text-primary hover:underline" href={`/teacher/students/${student.student_id}?class_id=${data.selectedClass!.id}`}>{t("viewStudent")}</Link>
                </span></td>
              </tr>;
            })}</tbody>
          </table>
        </CardContent>
      </Card>
      <div className="grid content-start gap-4">
        <Card><CardHeader><CardTitle>{t("distribution")}</CardTitle></CardHeader><CardContent className="grid gap-4">
          {bands.map((band) => <div key={band}><div className="mb-1 flex justify-between text-sm"><span>{t(`bands.${band}`)}</span><strong>{counts[band]}</strong></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{width: `${mastery.enrolled_student_count ? counts[band] / mastery.enrolled_student_count * 100 : 0}%`}}/></div></div>)}
          {counts.no_evidence ? <p className="text-xs text-muted-foreground">{t("studentsWithoutEvidence", {count: counts.no_evidence})}</p> : null}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>{t("conceptsNeedingSupport")}</CardTitle></CardHeader><CardContent className="grid gap-3">
          {mastery.concepts.filter((concept) => concept.mastery_band !== "secure").map((concept) =>
            <div className="rounded-lg border p-3" key={concept.concept_ref}><div className="flex justify-between gap-3"><strong>{concept.title}</strong><span>{percent(concept.mastery_score)}</span></div><p className="mt-1 text-xs text-muted-foreground">{t("conceptEvidence", {students: concept.student_count, attempts: concept.attempt_count})}</p></div>
          )}
          {mastery.concepts.every((concept) => concept.mastery_band === "secure") ? <p className="text-muted-foreground">{t("noSupportConcepts")}</p> : null}
        </CardContent></Card>
      </div>
    </section>
    <Card><CardHeader><CardTitle>{t("misconceptions")}</CardTitle><CardDescription>{t("misconceptionsDescription")}</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">
      {data.misconceptions?.items.length ? data.misconceptions.items.map((item) => <div className="rounded-xl border p-4" key={item.error_type}><div className="flex items-start justify-between gap-3"><strong>{item.label}</strong><span className="rounded-full bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">{Math.round(item.percentage)}%</span></div><p className="mt-2 text-sm text-muted-foreground">{t("affected", {students: item.student_count, attempts: item.attempt_count})}</p></div>) : <p className="text-muted-foreground">{t("noMisconceptions")}</p>}
    </CardContent></Card>
    <Dialog open={selectedSession !== null} onOpenChange={(open) => {if (!open) setSelectedSession(null);}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>{t("reviewSummary")}</DialogTitle><DialogDescription>{selectedSession ? `${selectedSession.student_name} · ${selectedSession.lesson_title}` : ""}</DialogDescription></DialogHeader>
        {selectedSession ? <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted p-4"><div><span className="text-xs text-muted-foreground">{t("completed")}</span><strong className="block">{new Intl.DateTimeFormat(locale, {dateStyle: "medium"}).format(new Date(selectedSession.completed_at))}</strong></div><div><span className="text-xs text-muted-foreground">{t("attempts")}</span><strong className="block">{selectedSession.total_attempts}</strong></div></div>
          {selectedSession.concepts.map((concept) => <div className="rounded-xl border p-4" key={concept.concept_ref}><div className="flex justify-between gap-3"><strong>{concept.title}</strong><span>{t(`bands.${concept.outcome}`)}</span></div><p className="mt-2 text-sm text-muted-foreground">{t(concept.completed_with_support ? "completedWithSupport" : "completedIndependently")}</p></div>)}
          <Button render={<Link href={`/teacher/students/${selectedSession.student_id}?class_id=${data.selectedClass.id}`}/>}>{t("openStudent")}</Button>
        </div> : null}
      </DialogContent>
    </Dialog>
  </section>;
}

function Metric({icon: Icon, label, value}: {icon: typeof UsersRound; label: string; value: string}) {
  return <Card><CardHeader><CardDescription className="flex items-center gap-2"><Icon className="size-4"/>{label}</CardDescription><CardTitle className="text-3xl font-bold">{value}</CardTitle></CardHeader></Card>;
}

function ReviewState({icon: Icon, title, description}: {icon: typeof UsersRound; title: string; description: string}) {
  return <Card><CardHeader className="text-center"><Icon className="mx-auto size-9 text-muted-foreground"/><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader></Card>;
}
