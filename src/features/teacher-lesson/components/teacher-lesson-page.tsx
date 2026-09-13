"use client";

import { useState } from "react";
import { ArrowLeft, CircleCheck, MessageCircleQuestion, MoreHorizontal, NotebookPen, Sparkles, UsersRound, Video } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LessonStageTabs } from "@/components/shared/lesson-stage-tabs";
import { TeacherLiveSessionPanel } from "@/features/live-session/components/teacher-live-session-panel";
import { TeacherBeforeClassPreparation } from "./teacher-before-class-preparation";

function TeacherDuringContent() {
  const t = useTranslations("teacherLesson.during");
  const [notes, setNotes] = useState(t("notesText"));
  const [observation, setObservation] = useState<"demo" | "permission">("demo");
  return <section className="grid gap-4 lg:grid-cols-2" data-testid="teacher-during-content">
    <div className="grid gap-4">
      <Card className="shadow-surface"><CardHeader className="flex-row items-center"><CardTitle className="flex gap-2"><MessageCircleQuestion className="size-5 text-info-foreground" />{t("questions")}</CardTitle><Button className="ms-auto" size="xs" variant="outline">{t("markAnswered")}</Button></CardHeader><CardContent className="grid gap-3">{["questionOne", "questionTwo", "questionThree"].map((key) => <div className="flex gap-2 border-b border-border pb-3 text-sm last:border-0 last:pb-0" key={key}><span className="grid size-7 shrink-0 place-items-center rounded-full bg-assistant text-xs font-semibold text-assistant-foreground">A</span><div><p>{t(key)}</p><span className="text-xs text-muted-foreground">{t("unresolved")}</span></div></div>)}</CardContent></Card>
      <Card className="shadow-surface"><CardHeader><CardTitle className="flex gap-2"><NotebookPen className="size-5 text-primary" />{t("notes")}</CardTitle></CardHeader><CardContent><Textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-28 bg-card" /><p className="mt-2 text-end text-xs text-success-foreground">{t("autosaved")}</p></CardContent></Card>
      <Card className="shadow-surface"><CardHeader className="flex-row items-center"><CardTitle className="flex gap-2"><Sparkles className="size-5 text-primary" />{t("highlights")}</CardTitle><Button className="ms-auto" size="xs" variant="outline">{t("sendAll")}</Button></CardHeader><CardContent><ul className="grid gap-2 text-sm">{["highlightOne", "highlightTwo"].map((key) => <li className="flex gap-2" key={key}><CircleCheck className="size-4 shrink-0 text-primary" />{t(key)}</li>)}</ul></CardContent></Card>
    </div>
    <div className="grid content-start gap-4">
      <Card className="shadow-surface"><CardHeader><CardTitle className="flex gap-2"><UsersRound className="size-5 text-success-foreground" />{t("readiness")}</CardTitle></CardHeader><CardContent className="grid gap-2 text-sm">{["devices", "materials", "joined", "support"].map((key) => <div className="flex items-center gap-2" key={key}><CircleCheck className="size-4 text-success-foreground" /><span className="flex-1">{t(key)}</span><strong>{key === "support" ? "2" : "28/30"}</strong></div>)}</CardContent></Card>
      <Card className="shadow-surface"><CardHeader><CardTitle className="flex gap-2"><UsersRound className="size-5 text-info-foreground" />{t("participation")}</CardTitle></CardHeader><CardContent className="grid gap-3">{["Ahmed", "Laila", "Youssef", "Noor"].map((name, index) => <div className="flex items-center gap-2 text-sm" key={name}><span className="grid size-7 place-items-center rounded-full bg-info text-xs text-info-foreground">{name[0]}</span><span className="flex-1">{name}</span><span className="text-success-foreground">{index < 2 ? t("active") : t("someParticipation")}</span></div>)}</CardContent></Card>
      <Card className="shadow-surface"><CardHeader className="flex-row items-center"><CardTitle className="flex gap-2"><Video className="size-5 text-assistant-foreground" />{t("observation")}</CardTitle><span className="ms-auto rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">{observation === "demo" ? t("demo") : t("permissionDenied")}</span></CardHeader><CardContent><div className="grid min-h-32 place-items-center rounded-lg bg-muted text-center text-sm text-muted-foreground"><div><Video className="mx-auto mb-2 size-6" />{observation === "demo" ? t("demoDescription") : t("permissionDescription")}</div></div><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => setObservation(observation === "demo" ? "permission" : "demo")}>{observation === "demo" ? t("testPermission") : t("retryPermission")}</Button><span className="self-center text-xs text-muted-foreground">{t("consent")}</span></div></CardContent></Card>
    </div>
  </section>;
}

export function TeacherLessonPage() {
  const t = useTranslations("teacherLesson");
  const [tab, setTab] = useState("before");
  return <div className="mx-auto flex w-full max-w-300 flex-col gap-4 pb-24"><header className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label={t("back")}><ArrowLeft className="rtl:-scale-x-100" /></Button><div className="min-w-0 flex-1"><h1 className="font-heading text-section font-bold">{t("title")}</h1><p className="text-sm text-muted-foreground">{t("subtitle")}</p></div><Button variant="ghost" size="icon" aria-label={t("more")}><MoreHorizontal /></Button></header><LessonStageTabs active={tab} ariaLabel={t("stagesLabel")} onChange={setTab} items={(["before", "during", "after"] as const).map((value) => ({ value, label: t(`tabs.${value}`) }))} />
    {tab === "during" ? <><TeacherLiveSessionPanel variant="during" /><TeacherDuringContent /></> : <><TeacherLiveSessionPanel variant="before" /><TeacherBeforeClassPreparation /></>}
    <footer className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-border bg-card p-3 md:static md:border-0 md:bg-transparent"><Button variant="outline" className="flex-1">{t("save")}</Button><Button className="flex-1">{t("prepare")}</Button></footer></div>;
}
