import { ArrowRight, Beaker, BookOpen, Check, ChevronDown, FlaskConical, Leaf, LockKeyhole, Sigma } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { GradePicker } from "./grade-picker";
import { LearningWeek } from "./learning-week";

function Arrow() {
  return <ArrowRight data-icon="inline-end" className="rtl:-scale-x-100" aria-hidden="true" />;
}

export async function StudentLearnPage() {
  const t = await getTranslations("studentLearn");
  const lessons = [
    { number: "1.1", title: t("lessons.one"), meta: t("lessons.oneMeta"), status: "done" },
    { number: "1.2", title: t("lessons.two"), meta: t("lessons.twoMeta"), status: "done" },
    { number: "1.3", title: t("lessons.three"), meta: t("lessons.current"), status: "current" },
    { number: "1.4", title: t("lessons.four"), meta: t("lessons.fourMeta"), status: "locked" },
    { number: "1.5", title: t("lessons.five"), meta: t("lessons.fiveMeta"), status: "locked" },
    { number: "1.6", title: t("lessons.six"), meta: t("lessons.sixMeta"), status: "locked" },
  ];
  const subjects = [
    { icon: Sigma, label: t("subjects.math") },
    { icon: FlaskConical, label: t("subjects.chemistry") },
    { icon: Leaf, label: t("subjects.biology") },
    { icon: BookOpen, label: t("subjects.english") },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 sm:gap-5" data-testid="student-learn-page">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-heading text-page font-bold tracking-tight">{t("title")}</h1><p className="mt-1 text-base text-muted-foreground">{t("subtitle")}</p></div>
        <GradePicker />
      </header>
      <nav className="grid w-full max-w-md grid-cols-2 rounded-xl border border-border bg-card p-1" aria-label={t("viewLabel")}>
        <span className="rounded-lg bg-secondary px-4 py-2 text-center text-sm font-semibold text-secondary-foreground">{t("learningMap")}</span>
        <Link href="/student/schedule" className="rounded-lg px-4 py-2 text-center text-sm font-medium text-muted-foreground hover:bg-muted">{t("schedule")}</Link>
      </nav>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="flex min-w-0 flex-col gap-3" aria-label={t("subjects.label")}>
          <details className="group rounded-xl border border-border bg-card shadow-surface">
            <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 font-semibold">
              <Sigma className="size-5 text-muted-foreground" aria-hidden="true" />{t("subjects.math")}<ChevronDown className="ms-auto size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="border-t border-border px-4 py-3 text-sm text-muted-foreground">{t("subjects.mathSummary")}</p>
          </details>

          <details open className="group overflow-hidden rounded-xl border border-border bg-card shadow-surface">
            <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 bg-secondary px-4 font-semibold text-secondary-foreground">
              <Beaker className="size-5" aria-hidden="true" />{t("subjects.physics")}<ChevronDown className="ms-auto size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="border-t border-border p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-border pb-3"><strong className="text-sm">{t("chapter")}</strong><span className="text-xs text-muted-foreground">{t("completedCount")}</span></div>
              <ol className="overflow-hidden rounded-lg border border-border">
                {lessons.map((lesson) => (
                  <li key={lesson.number} className={lesson.status === "current" ? "bg-secondary" : "border-b border-border last:border-b-0 hover:bg-muted"}>
                    <div className="grid min-h-12 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2">
                      <span className={lesson.status === "done" ? "grid size-5 place-items-center rounded-full bg-success-foreground text-primary-foreground" : lesson.status === "current" ? "size-5 rounded-full border-2 border-primary bg-card" : "grid size-5 place-items-center rounded-full bg-muted text-muted-foreground"}>
                        {lesson.status === "done" ? <Check className="size-3" aria-hidden="true" /> : lesson.status === "locked" ? <LockKeyhole className="size-3" aria-hidden="true" /> : null}
                      </span>
                      <span className="min-w-0">
                        <strong className="block text-sm"><span className={lesson.status === "current" ? "me-2 text-xs font-medium text-secondary-foreground" : "me-2 text-xs font-medium text-muted-foreground"}>{lesson.number}</span>{lesson.title}</strong>
                        {lesson.status === "current" ? <span className="mt-1 inline-flex rounded border border-primary px-1.5 py-0.5 text-[0.65rem] font-medium text-secondary-foreground">{lesson.meta}</span> : null}
                      </span>
                      {lesson.status === "current" ? (
                        <Button render={<Link href="/student/learn/lesson" />} nativeButton={false} size="sm" className="bg-secondary-foreground max-sm:px-2.5 hover:bg-secondary-foreground/90">{t("openLesson")}<Arrow /></Button>
                      ) : (
                        <span className="hidden whitespace-nowrap text-xs text-muted-foreground sm:block">{lesson.meta}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </details>

          {subjects.slice(1).map(({ icon: Icon, label }) => (
            <details key={label} className="group rounded-xl border border-border bg-card shadow-surface">
              <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 font-semibold"><Icon className="size-5 text-muted-foreground" aria-hidden="true" />{label}<ChevronDown className="ms-auto size-4 transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
              <p className="border-t border-border px-4 py-3 text-sm text-muted-foreground">{t("subjects.lockedSummary")}</p>
            </details>
          ))}
        </section>
        <LearningWeek />
      </div>
    </div>
  );
}
