import { ArrowLeft, BookOpenCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MasteryBand, TeacherStudentDetailData } from "../types";

function percent(value: number | null) { return value === null ? "—" : `${Math.round(value * 100)}%`; }

export async function TeacherStudentDetailPage({ data }: { data: TeacherStudentDetailData }) {
  const t = await getTranslations("teacherStudents");
  if (data.error || !data.mastery || !data.selectedClass) return <Card><CardHeader><CardTitle>{t("detailUnavailable")}</CardTitle><CardDescription>{t("detailUnavailableDescription")}</CardDescription></CardHeader></Card>;
  const { student } = data.mastery;
  return <div className="mx-auto flex w-full max-w-295 flex-col gap-5">
    <header><Link href={`/teacher/students?class_id=${data.selectedClass.id}`} className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4 rtl:-scale-x-100"/>{t("back")}</Link><h1 className="font-heading text-page font-bold">{student.full_name}</h1><p className="text-muted-foreground">{data.selectedClass.name}</p></header>
    <section className="grid gap-4 sm:grid-cols-3"><Metric label={t("mastery")} value={percent(student.mastery_score)}/><Metric label={t("concepts")} value={String(student.concept_count)}/><Metric label={t("attempts")} value={String(student.attempt_count)}/></section>
    <section className="grid gap-4 lg:grid-cols-2">
      <Card><CardHeader><CardTitle>{t("conceptMastery")}</CardTitle><CardDescription>{t("conceptMasteryDescription")}</CardDescription></CardHeader><CardContent className="grid gap-3">{data.mastery.concepts.length ? data.mastery.concepts.map((concept) => <div key={concept.concept_ref} className="rounded-xl border p-4"><div className="flex items-center justify-between gap-3"><strong>{concept.title}</strong><Band band={concept.mastery_band} label={t(`bands.${concept.mastery_band}`)}/></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${concept.mastery_score * 100}%` }}/></div><p className="mt-2 text-xs text-muted-foreground">{t("evidence", { evidence: concept.evidence_count, attempts: concept.attempt_count })}</p></div>) : <p className="text-muted-foreground">{t("noEvidence")}</p>}</CardContent></Card>
      <Card><CardHeader><CardTitle>{t("recentReviews")}</CardTitle><CardDescription>{t("recentReviewsDescription")}</CardDescription></CardHeader><CardContent className="grid gap-3">{data.sessions?.items.length ? data.sessions.items.map((session) => <div key={session.session_id} className="rounded-xl border p-4"><div className="flex items-start gap-3"><BookOpenCheck className="mt-0.5 size-5 text-primary"/><span className="min-w-0"><strong className="block">{session.lesson_title}</strong><span className="text-xs text-muted-foreground">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(session.completed_at))} · {t("attemptCount", { count: session.total_attempts })}</span></span></div></div>) : <p className="text-muted-foreground">{t("noReviews")}</p>}</CardContent></Card>
    </section>
  </div>;
}
function Metric({ label, value }: { label: string; value: string }) { return <Card><CardHeader><CardDescription>{label}</CardDescription><CardTitle className="text-3xl font-bold">{value}</CardTitle></CardHeader></Card>; }
function Band({ band, label }: { band: MasteryBand; label: string }) { const tone = band === "secure" ? "bg-success text-success-foreground" : band === "developing" ? "bg-assistant text-assistant-foreground" : "bg-destructive/10 text-destructive"; return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{label}</span>; }
