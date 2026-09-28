import { AlertTriangle, BarChart3, BookOpenCheck, UsersRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MasteryBand } from "@/features/teacher-students/types";
import type { TeacherInsightsData } from "../server/teacher-insights-api";

type Filters = { from?: string; to?: string };
const bands: MasteryBand[] = ["secure", "developing", "needs_support"];
function percent(value: number | null) { return value === null ? "—" : `${Math.round(value * 100)}%`; }

export async function TeacherInsightsPage({ data, filters }: { data: TeacherInsightsData; filters: Filters }) {
  const t = await getTranslations("teacherInsights");
  if (data.error) return <State icon={AlertTriangle} title={t("errorTitle")} description={t("errorDescription")}/>;
  if (!data.selectedClass || !data.mastery) return <State icon={UsersRound} title={t("emptyTitle")} description={t("emptyDescription")}/>;
  const selectedClass = data.selectedClass;
  const mastery = data.mastery;
  const totalEvidence = mastery.students.reduce((sum, item) => sum + item.evidence_count, 0);
  const assistedEvidence = mastery.students.reduce((sum, item) => sum + item.assisted_evidence_count, 0);
  const assistanceRate = totalEvidence ? assistedEvidence / totalEvidence : null;
  const counts = mastery.band_counts as Record<MasteryBand | "no_evidence", number> | undefined;
  return <div className="mx-auto flex w-full max-w-295 flex-col gap-5" data-testid="teacher-insights-page">
    <header><h1 className="font-heading text-page font-bold tracking-tight">{t("title")}</h1><p className="mt-1 text-muted-foreground">{t("subtitle")}</p></header>
    <Card><CardContent><form method="get" className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">
      <label className="grid gap-1 text-sm font-medium">{t("classLabel")}<select name="class_id" defaultValue={selectedClass.id} className="h-10 rounded-lg border border-input bg-background px-3">{data.classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label className="grid gap-1 text-sm font-medium">{t("from")}<input name="from" type="date" defaultValue={filters.from} className="h-10 rounded-lg border border-input bg-background px-3"/></label>
      <label className="grid gap-1 text-sm font-medium">{t("to")}<input name="to" type="date" defaultValue={filters.to} className="h-10 rounded-lg border border-input bg-background px-3"/></label>
      <Button type="submit" className="self-end">{t("apply")}</Button>
    </form></CardContent></Card>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric icon={UsersRound} label={t("reviewCoverage")} value={`${mastery.students_with_evidence}/${mastery.enrolled_student_count}`}/>
      <Metric icon={BarChart3} label={t("averageMastery")} value={percent(mastery.average_mastery)}/>
      <Metric icon={BookOpenCheck} label={t("assistanceRate")} value={percent(assistanceRate)}/>
      <Metric icon={AlertTriangle} label={t("misconceptions")} value={String(data.misconceptions?.items.length ?? 0)}/>
    </section>
    <section className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
      <Card><CardHeader><CardTitle>{t("studentMastery")}</CardTitle><CardDescription>{t("studentMasteryDescription")}</CardDescription></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-140 text-sm"><thead><tr className="border-b text-start text-muted-foreground"><th className="p-3 text-start">{t("student")}</th><th className="p-3 text-start">{t("mastery")}</th><th className="p-3 text-start">{t("evidence")}</th><th className="p-3 text-end">{t("action")}</th></tr></thead><tbody>{mastery.students.map((student) => <tr className="border-b last:border-0" key={student.student_id}><td className="p-3 font-medium">{student.full_name}</td><td className="p-3">{percent(student.mastery_score)} <span className="ms-2 text-xs text-muted-foreground">{student.mastery_band ? t(`bands.${student.mastery_band}`) : t("noEvidence")}</span></td><td className="p-3">{student.evidence_count}</td><td className="p-3 text-end"><Link className="font-medium text-primary hover:underline" href={`/teacher/students/${student.student_id}?class_id=${selectedClass.id}`}>{t("viewStudent")}</Link></td></tr>)}</tbody></table></CardContent></Card>
      <Card><CardHeader><CardTitle>{t("distribution")}</CardTitle><CardDescription>{t("distributionDescription")}</CardDescription></CardHeader><CardContent className="grid gap-4">{bands.map((band) => { const count = counts?.[band] ?? mastery.students.filter((item) => item.mastery_band === band).length; const width = mastery.enrolled_student_count ? count / mastery.enrolled_student_count * 100 : 0; return <div key={band}><div className="mb-1 flex justify-between text-sm"><span>{t(`bands.${band}`)}</span><strong>{count}</strong></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }}/></div></div>; })}</CardContent></Card>
    </section>
    <Card><CardHeader><CardTitle>{t("commonMisconceptions")}</CardTitle><CardDescription>{t("commonMisconceptionsDescription")}</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">{data.misconceptions?.items.length ? data.misconceptions.items.map((item) => <div key={`${item.error_type}-${item.concept_ref}`} className="rounded-xl border p-4"><div className="flex items-start justify-between gap-3"><strong>{item.label}</strong><span className="rounded-full bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">{Math.round(item.percentage)}%</span></div><p className="mt-2 text-sm text-muted-foreground">{t("affected", { students: item.student_count, attempts: item.attempt_count })}</p></div>) : <p className="text-muted-foreground">{t("noMisconceptions")}</p>}</CardContent></Card>
  </div>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof UsersRound; label: string; value: string }) { return <Card><CardHeader><CardDescription className="flex items-center gap-2"><Icon className="size-4"/>{label}</CardDescription><CardTitle className="text-3xl font-bold">{value}</CardTitle></CardHeader></Card>; }
function State({ icon: Icon, title, description }: { icon: typeof UsersRound; title: string; description: string }) { return <Card className="mx-auto mt-12 max-w-xl"><CardHeader className="text-center"><Icon className="mx-auto size-10 text-muted-foreground"/><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader></Card>; }
