"use client";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpenCheck,
  FileText,
  FolderOpen,
  Link2,
  ListChecks,
  MoreHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LessonStageTabs } from "@/components/shared/lesson-stage-tabs";
export function TeacherLessonPage() {
  const t = useTranslations("teacherLesson");
  const [tab, setTab] = useState("before");
  const materials = [
    {
      icon: FileText,
      title: t("materials.slides"),
      detail: "Newton_Third_Law.pptx",
    },
    {
      icon: Link2,
      title: t("materials.simulation"),
      detail: "PhET – Forces and Motion",
    },
    {
      icon: FileText,
      title: t("materials.worksheet"),
      detail: "Action-Reaction_worksheet.pdf",
    },
  ];
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-3 pb-24">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label={t("back")}>
          <ArrowLeft className="rtl:-scale-x-100" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="font-heading text-section font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button variant="ghost" size="icon" aria-label={t("more")}>
          <MoreHorizontal />
        </Button>
      </header>
      <LessonStageTabs
        active={tab}
        ariaLabel={t("stagesLabel")}
        onChange={setTab}
        items={(["before", "during", "after"] as const).map((value) => ({
          value,
          label: t(`tabs.${value}`),
        }))}
      />
      <Card className="shadow-surface">
        <CardHeader>
          <CardTitle className="flex gap-2">
            <BookOpenCheck className="size-5 text-primary" />
            {t("objectives.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 ps-5 text-sm leading-6 text-muted-foreground">
            {[
              t("objectives.one"),
              t("objectives.two"),
              t("objectives.three"),
            ].map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="shadow-surface">
        <CardHeader className="flex-row items-center">
          <CardTitle className="flex gap-2">
            <FolderOpen className="size-5 text-primary" />
            {t("materials.title")}
          </CardTitle>
          <span className="ms-auto text-sm text-muted-foreground">
            {t("materials.count")}
          </span>
        </CardHeader>
        <CardContent className="divide-y rounded-lg border border-border">
          {materials.map(({ icon: Icon, title, detail }) => (
            <div className="flex items-center gap-3 p-3" key={title}>
              <span className="grid size-9 place-items-center rounded-lg bg-info text-info-foreground">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-sm">{title}</strong>
                <span className="block truncate text-xs text-muted-foreground">
                  {detail}
                </span>
              </span>
              <MoreHorizontal className="size-5 text-muted-foreground" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="shadow-surface">
        <CardHeader className="flex-row items-center">
          <CardTitle className="flex gap-2">
            <ListChecks className="size-5 text-primary" />
            {t("flow.title")}
          </CardTitle>
          <span className="ms-auto text-sm text-muted-foreground">
            {t("flow.count")}
          </span>
        </CardHeader>
        <CardContent className="grid gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div className="grid grid-cols-[2rem_1fr] gap-3" key={n}>
              <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {n}
              </span>
              <span>
                <strong className="block text-sm">{t(`flow.step${n}`)}</strong>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t(`flow.detail${n}`)}
                </p>
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
      <footer className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-border bg-card p-3 md:static md:border-0 md:bg-transparent">
        <Button variant="outline" className="flex-1">
          {t("save")}
        </Button>
        <Button className="flex-1">{t("prepare")}</Button>
      </footer>
    </div>
  );
}
