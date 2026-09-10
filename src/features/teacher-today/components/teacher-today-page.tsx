import Image from "next/image";
import { ArrowRight, CalendarDays, Clock3, FileCheck2, MapPin, MessageCircleQuestion, UsersRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSectionCard } from "@/features/today/components/dashboard-section-card";
import { ScheduleList } from "@/features/today/components/schedule-list";
import { TeacherTaskList } from "./teacher-task-list";

function ActionArrow() {
  return <ArrowRight data-icon="inline-end" className="rtl:-scale-x-100" aria-hidden="true" />;
}

export async function TeacherTodayPage() {
  const t = await getTranslations("teacherToday");
  const classes = [
    { time: t("schedule.timeOne"), subject: t("schedule.physicsTen"), detail: t("schedule.newton"), current: true },
    { time: t("schedule.timeTwo"), subject: t("schedule.physicsNine"), detail: t("schedule.forces") },
    { time: t("schedule.timeThree"), subject: t("schedule.physicsEleven"), detail: t("schedule.momentum") },
  ];
  const attention = [
    { icon: FileCheck2, value: "6", title: t("attention.homework"), detail: t("attention.homeworkDetail"), href: "/teacher/teaching" },
    { icon: MessageCircleQuestion, value: "4", title: t("attention.questions"), detail: t("attention.questionsDetail"), href: "/teacher/connect" },
    { icon: UsersRound, value: "3", title: t("attention.support"), detail: t("attention.supportDetail"), href: "/teacher/students" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 sm:gap-5" data-testid="teacher-today-page">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-page font-bold tracking-tight">{t("greeting")}</h1>
          <p className="mt-1 text-base text-muted-foreground">{t("date")}</p>
        </div>
        <div className="flex max-w-52 items-center gap-3 rounded-xl border border-info-foreground/15 bg-info px-4 py-3 text-sm text-info-foreground shadow-surface">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-card/80"><CalendarDays className="size-4" aria-hidden="true" /></span>
          {t("productive")}
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.45fr_.95fr]">
        <Card className="relative min-h-56 overflow-hidden border-primary bg-gradient-to-br from-secondary-foreground to-primary py-5 text-primary-foreground shadow-surface">
          <Image src="/images/lessons/newtons-third-law.png" alt="" width={480} height={240} loading="eager" className="pointer-events-none absolute end-4 top-12 hidden h-auto w-[44%] object-contain opacity-95 sm:block rtl:-scale-x-100" aria-hidden="true" />
          <CardHeader className="relative max-w-[62%] px-5 max-sm:max-w-full">
            <CardDescription className="flex items-center gap-2 text-primary-foreground/90"><Clock3 className="size-4" aria-hidden="true" />{t("nextClass.eyebrow")}</CardDescription>
            <CardTitle className="text-2xl font-bold sm:text-3xl">{t("nextClass.grade")}</CardTitle>
            <CardDescription className="text-lg font-semibold text-primary-foreground">{t("nextClass.lesson")}</CardDescription>
            <CardDescription className="mt-2 flex items-center gap-2 text-primary-foreground"><Clock3 className="size-4" aria-hidden="true" />{t("nextClass.meta")}</CardDescription>
            <CardDescription className="flex items-center gap-2 text-primary-foreground"><MapPin className="size-4" aria-hidden="true" />{t("nextClass.room")}</CardDescription>
          </CardHeader>
          <CardContent className="relative mt-auto flex justify-end px-5">
            <Button render={<Link href="/teacher/teaching/lesson" />} nativeButton={false} variant="secondary" size="lg" className="bg-card text-secondary-foreground shadow-overlay hover:bg-card/90">{t("nextClass.cta")}<ActionArrow /></Button>
          </CardContent>
        </Card>
        <DashboardSectionCard title={t("schedule.title")} className="h-full" action={<Button render={<Link href="/teacher/schedule" />} nativeButton={false} variant="link" size="sm" className="text-secondary-foreground">{t("schedule.view")}</Button>}>
          <ScheduleList items={classes} showIcons={false} label={t("schedule.title")} />
          <Button render={<Link href="/teacher/schedule" />} nativeButton={false} variant="link" size="sm" className="mt-1 px-3 text-secondary-foreground">{t("schedule.seeFull")}<ActionArrow /></Button>
        </DashboardSectionCard>
      </section>

      <DashboardSectionCard title={t("attention.title")} action={<Button render={<Link href="/teacher/teaching" />} nativeButton={false} variant="link" size="sm" className="text-secondary-foreground">{t("attention.view")}</Button>}>
        <div className="grid gap-3 md:grid-cols-3">
          {attention.map(({ icon: Icon, ...item }, index) => (
            <Link key={item.title} href={item.href} className={`group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-transparent p-4 outline-none transition-colors hover:border-border focus-visible:ring-2 focus-visible:ring-ring ${index === 1 ? "bg-info text-info-foreground" : "bg-assistant/55 text-assistant-foreground"}`}>
              <Icon className="size-7" aria-hidden="true" />
              <span><strong className="block text-2xl font-bold text-foreground">{item.value}</strong><span className="block text-sm font-semibold text-foreground">{item.title}</span><span className="block text-xs text-foreground/70">{item.detail}</span></span>
              <ActionArrow />
            </Link>
          ))}
        </div>
      </DashboardSectionCard>

      <TeacherTaskList />
    </div>
  );
}
