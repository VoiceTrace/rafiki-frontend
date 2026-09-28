import { Search, UsersRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeacherStudentsData } from "../types";

function percent(value: number | null) { return value === null ? "—" : `${Math.round(value * 100)}%`; }

export async function TeacherStudentsPage({ data, query }: { data: TeacherStudentsData; query: string }) {
  const t = await getTranslations("teacherStudents");
  if (data.error) return <State title={t("errorTitle")} description={t("errorDescription")} />;
  if (!data.selectedClass) return <State title={t("emptyClassesTitle")} description={t("emptyClassesDescription")} />;
  const masteryByStudent = new Map(data.mastery?.students.map((item) => [item.student_id, item]));
  const normalized = query.trim().toLocaleLowerCase();
  const students = normalized ? data.roster.filter((item) => `${item.full_name} ${item.email}`.toLocaleLowerCase().includes(normalized)) : data.roster;
  return <div className="mx-auto flex w-full max-w-295 flex-col gap-5" data-testid="teacher-students-page">
    <header><h1 className="font-heading text-page font-bold tracking-tight">{t("title")}</h1><p className="mt-1 text-muted-foreground">{t("subtitle")}</p></header>
    <Card><CardContent><form className="grid gap-3 md:grid-cols-[1fr_1fr_auto]" method="get">
      <label className="grid gap-1 text-sm font-medium">{t("classLabel")}<select name="class_id" defaultValue={data.selectedClass.id} className="h-10 rounded-lg border border-input bg-background px-3">{data.classes.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
      <label className="grid gap-1 text-sm font-medium">{t("searchLabel")}<span className="relative"><Search className="absolute start-3 top-3 size-4 text-muted-foreground"/><input name="q" defaultValue={query} className="h-10 w-full rounded-lg border border-input bg-background ps-10 pe-3" placeholder={t("searchPlaceholder")}/></span></label>
      <Button type="submit" className="self-end">{t("apply")}</Button>
    </form></CardContent></Card>
    <section className="grid gap-4 md:grid-cols-3">
      <Metric label={t("students")} value={String(data.mastery?.enrolled_student_count ?? data.roster.length)}/>
      <Metric label={t("withEvidence")} value={String(data.mastery?.students_with_evidence ?? 0)}/>
      <Metric label={t("averageMastery")} value={percent(data.mastery?.average_mastery ?? null)}/>
    </section>
    <Card><CardHeader><CardTitle>{data.selectedClass.name}</CardTitle><CardDescription>{t("rosterDescription")}</CardDescription></CardHeader><CardContent className="grid gap-2">
      {students.length ? students.map((student) => { const mastery = masteryByStudent.get(student.id); return <Link href={`/teacher/students/${student.id}?class_id=${data.selectedClass!.id}`} key={student.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border p-3 outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring">
        <span className="grid size-10 place-items-center rounded-full bg-secondary font-semibold text-secondary-foreground">{student.full_name.slice(0,1)}</span><span><strong className="block">{student.full_name}</strong><span className="text-xs text-muted-foreground">{student.email}</span></span><span className="text-end"><strong className="block">{percent(mastery?.mastery_score ?? null)}</strong><span className="text-xs text-muted-foreground">{mastery?.mastery_band ? t(`bands.${mastery.mastery_band}`) : t("noEvidence")}</span></span>
      </Link>; }) : <p className="py-8 text-center text-muted-foreground">{t("emptyStudents")}</p>}
    </CardContent></Card>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <Card><CardHeader><CardDescription>{label}</CardDescription><CardTitle className="text-3xl font-bold">{value}</CardTitle></CardHeader></Card>; }
function State({ title, description }: { title: string; description: string }) { return <Card className="mx-auto mt-12 max-w-xl"><CardHeader className="text-center"><UsersRound className="mx-auto size-10 text-muted-foreground"/><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader></Card>; }
