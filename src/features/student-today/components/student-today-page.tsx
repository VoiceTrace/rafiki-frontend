import { ArrowRight, BookOpenText, CalendarDays, Check, Circle, ClipboardList, Flame, Mountain } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSectionCard } from "@/features/today/components/dashboard-section-card";
import { ScheduleList } from "@/features/today/components/schedule-list";
import { RafiqiPrompt } from "./rafiqi-prompt";

function ActionArrow() {
  return <ArrowRight data-icon="inline-end" className="rtl:-scale-x-100" aria-hidden="true" />;
}

export async function StudentTodayPage() {
  const t = await getTranslations("studentToday");
  const homework = [
    { title: t("homework.physics"), detail: t("homework.physicsDetail"), due: t("homework.dueOne") },
    { title: t("homework.math"), detail: t("homework.mathDetail"), due: t("homework.dueTwo") },
    { title: t("homework.english"), detail: t("homework.englishDetail"), due: t("homework.dueThree") },
  ];
  const schedule = [
    { time: t("schedule.timeOne"), subject: t("schedule.math"), detail: t("schedule.roomOne") },
    { time: t("schedule.timeTwo"), subject: t("schedule.physics"), detail: t("schedule.physicsDetail"), current: true },
    { time: t("schedule.timeThree"), subject: t("schedule.english"), detail: t("schedule.roomTwo") },
    { time: t("schedule.timeFour"), subject: t("schedule.computerScience"), detail: t("schedule.roomThree") },
    { time: t("schedule.timeFive"), subject: t("schedule.pe"), detail: t("schedule.sportsHall") },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 sm:gap-5" data-testid="student-today-page">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-page font-bold tracking-tight">{t("greeting")}</h1>
          <p className="mt-1 text-base text-muted-foreground">{t("subtitle")}</p>
        </div>
        <time className="text-sm text-muted-foreground">{t("date")}</time>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.12fr_1fr_.78fr]" aria-label={t("prioritiesLabel")}>
        <Card className="min-h-50 gap-3 py-4 shadow-surface">
          <CardHeader className="px-4 sm:px-5">
            <CardDescription className="flex items-center gap-2 font-medium">
              <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary"><BookOpenText className="size-5" aria-hidden="true" /></span>
              {t("nextClass.eyebrow")}
            </CardDescription>
            <CardTitle className="text-card-title font-bold">{t("nextClass.title")}</CardTitle>
            <CardDescription>{t("nextClass.meta")}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto px-4 sm:px-5">
            <Button render={<Link href="/student/study-cave" />} nativeButton={false} size="lg" className="w-full">{t("nextClass.cta")}<ActionArrow /></Button>
          </CardContent>
        </Card>

        <Card className="gap-3 border-assistant bg-assistant/55 py-4 shadow-surface">
          <CardHeader className="px-4 sm:px-5">
            <CardDescription className="flex items-center gap-2 font-medium text-assistant-foreground">
              <span className="grid size-9 place-items-center rounded-xl bg-card/80"><Mountain className="size-5" aria-hidden="true" /></span>
              {t("studyCave.eyebrow")}
            </CardDescription>
            <CardTitle className="font-semibold">{t("studyCave.title")}</CardTitle>
            <CardDescription>{t("studyCave.lesson")}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto px-4 sm:px-5">
            <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span role="progressbar" aria-label={t("studyCave.progress")} aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-card">
                <span className="block h-full w-3/5 rounded-full bg-assistant-foreground" />
              </span>
              <span className="font-semibold text-foreground">60%</span>
            </div>
            <Button render={<Link href="/student/learn/study-cave" />} nativeButton={false} variant="outline" size="lg" className="w-full border-assistant-foreground/30 bg-card/55 text-assistant-foreground">{t("studyCave.cta")}<ActionArrow /></Button>
          </CardContent>
        </Card>

        <Card className="gap-3 border-success bg-success/65 py-4 shadow-surface md:col-span-2 xl:col-span-1">
          <CardHeader className="px-4 sm:px-5">
            <CardTitle className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-card text-primary"><Flame className="size-6" aria-hidden="true" /></span>
              <span><strong className="block text-2xl font-bold">7</strong><span className="text-sm font-medium">{t("streak.label")}</span></span>
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-auto px-4 sm:px-5">
            <div className="grid grid-cols-7 gap-1 text-center text-[0.68rem] text-muted-foreground">
              {(t.raw("streak.days") as string[]).map((day, index) => (
                <span className="grid gap-1.5" key={day + index}>{day}<span className="mx-auto grid size-5 place-items-center rounded-full border border-success-foreground/25 bg-card text-success-foreground">{index < 4 ? <Check className="size-3" aria-hidden="true" /> : <Circle className="size-2.5" aria-hidden="true" />}</span></span>
              ))}
            </div>
            <p className="mt-4 text-center text-sm font-medium">{t("streak.encouragement")}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <DashboardSectionCard icon={ClipboardList} title={t("homework.title")} action={<Button render={<Link href="/student/homework" />} nativeButton={false} variant="link" size="sm">{t("viewAll")}<ActionArrow /></Button>}>
          <ul className="flex flex-col gap-2">
            {homework.map((item) => (
              <li key={item.title} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-border px-3 py-3">
                <span className="size-4 rounded-full border border-input" aria-hidden="true" />
                <span className="min-w-0"><strong className="block truncate text-sm font-semibold">{item.title}</strong><span className="block truncate text-xs text-muted-foreground">{item.detail}</span></span>
                <span className="hidden text-xs text-muted-foreground sm:block">{item.due}</span>
              </li>
            ))}
          </ul>
        </DashboardSectionCard>

        <DashboardSectionCard icon={CalendarDays} title={t("schedule.title")} action={<Button render={<Link href="/student/schedule" />} nativeButton={false} variant="link" size="sm">{t("schedule.view")}<ActionArrow /></Button>}>
          <ScheduleList items={schedule} />
        </DashboardSectionCard>
      </section>
      <RafiqiPrompt />
    </div>
  );
}

