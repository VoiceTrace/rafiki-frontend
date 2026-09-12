"use client";

import { type FormEvent, useMemo, useState } from "react";
import {
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Download,
  FileText,
  ListChecks,
  MessageCircleQuestion,
  NotebookPen,
  Play,
  SendHorizontal,
  Target,
  UserRoundCheck,
  Video,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  notes: string;
  onNotesChange: (value: string) => void;
};

const selfCheckKeys = ["pairs", "objects", "apply", "explain"] as const;
const timelineKeys = ["examples", "pairs", "scenarios", "problems"] as const;
const questionKeys = ["cancel", "effect", "rest"] as const;
const materialKeys = ["slides", "reading", "video", "practice"] as const;
const materialIcons = [FileText, FileText, Video, ListChecks] as const;

export function AfterClassReview({ notes, onNotesChange }: Props) {
  const t = useTranslations("studyCave.afterClass");
  const [selfChecks, setSelfChecks] = useState([true, true, false, false]);
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
  const [materials, setMaterials] = useState([true, true, false, false]);
  const [openedMaterial, setOpenedMaterial] = useState<number | null>(null);
  const [reviewChecks, setReviewChecks] = useState([true, false, false]);
  const [draft, setDraft] = useState("");
  const [studentReply, setStudentReply] = useState<string | null>(null);
  const reviewProgress = reviewChecks.filter(Boolean).length;

  const summary = useMemo(
    () =>
      [
        t("download.documentTitle"),
        "",
        t("objective.title"),
        t("objective.text"),
        "",
        t("keyPoints.title"),
        ...(["one", "two", "three", "four"] as const).map(
          (key) => `• ${t(`keyPoints.${key}`)}`,
        ),
        "",
        t("timeline.title"),
        ...timelineKeys.map(
          (key, index) => `${index + 1}. ${t(`timeline.${key}`)}`,
        ),
        "",
        t("questions.title"),
        ...questionKeys.flatMap((key) => [
          `• ${t(`questions.${key}.question`)}`,
          `  ${t(`questions.${key}.answer`)}`,
        ]),
        "",
        t("notes.title"),
        notes,
        "",
        t("feedback.title"),
        t("feedback.text"),
        "",
        t("companion.misconception"),
        t("companion.correction"),
      ].join("\n"),
    [notes, t],
  );

  function downloadSummary() {
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "newtons-third-law-review.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;
    setStudentReply(value);
    setDraft("");
    setReviewChecks((current) => current.map(() => true));
  }

  return (
    <section className="grid gap-4" aria-label={t("workspaceLabel")}>
      <div className="grid gap-4 lg:grid-cols-2">
        <ReviewCard icon={Target} title={t("objective.title")} tone="text-info-foreground">
          <p className="leading-6 text-muted-foreground">{t("objective.text")}</p>
        </ReviewCard>

        <ReviewCard icon={FileText} title={t("keyPoints.title")} tone="text-info-foreground">
          <ul className="grid gap-2">
            {(["one", "two", "three", "four"] as const).map((key) => (
              <li className="flex gap-2 leading-5" key={key}>
                <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-success text-success-foreground">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                {t(`keyPoints.${key}`)}
              </li>
            ))}
          </ul>
        </ReviewCard>

        <ReviewCard icon={ListChecks} title={t("timeline.title")} tone="text-assistant-foreground">
          <ol className="grid gap-3">
            {timelineKeys.map((key, index) => (
              <li className="grid grid-cols-[1.75rem_1fr] items-start gap-2" key={key}>
                <span className="grid size-7 place-items-center rounded-full bg-assistant text-xs font-bold text-assistant-foreground">
                  {index + 1}
                </span>
                <span className="pt-1 leading-5">{t(`timeline.${key}`)}</span>
              </li>
            ))}
          </ol>
        </ReviewCard>

        <ReviewCard icon={CheckCircle2} title={t("selfCheck.title")} tone="text-success-foreground">
          <ul className="grid gap-3">
            {selfCheckKeys.map((key, index) => (
              <li key={key}>
                <label className="flex cursor-pointer items-start gap-3 leading-5">
                  <Checkbox
                    checked={selfChecks[index]}
                    onCheckedChange={() =>
                      setSelfChecks((current) =>
                        current.map((value, item) => (item === index ? !value : value)),
                      )
                    }
                  />
                  <span>{t(`selfCheck.${key}`)}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-medium text-muted-foreground" aria-live="polite">
            {t("selfCheck.progress", {
              complete: selfChecks.filter(Boolean).length,
              total: selfChecks.length,
            })}
          </p>
        </ReviewCard>

        <ReviewCard icon={MessageCircleQuestion} title={t("questions.title")} tone="text-assistant-foreground">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-muted p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary font-semibold text-secondary-foreground">
              A
            </span>
            <div>
              <strong className="text-sm">{t("questions.teacher")}</strong>
              <p className="text-xs text-muted-foreground">{t("questions.description")}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            {questionKeys.map((key, index) => {
              const open = openQuestion === index;
              return (
                <div className="border-b border-border last:border-b-0" key={key}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-3 py-3 text-start text-sm font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    aria-expanded={open}
                    onClick={() => setOpenQuestion(open ? null : index)}
                  >
                    <span>{t(`questions.${key}.question`)}</span>
                    <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
                  </button>
                  {open ? (
                    <p className="border-t border-border bg-muted/60 px-3 py-3 text-sm leading-6 text-muted-foreground">
                      {t(`questions.${key}.answer`)}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </ReviewCard>

        <ReviewCard icon={FileText} title={t("materials.title")} tone="text-info-foreground">
          <ul className="overflow-hidden rounded-xl border border-border">
            {materialKeys.map((key, index) => {
              const Icon = materialIcons[index];
              const complete = materials[index];
              return (
                <li className="flex items-center gap-3 border-b border-border px-3 py-2.5 last:border-b-0" key={key}>
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-info text-info-foreground">
                    {key === "video" ? <Play className="size-4 fill-current" /> : <Icon className="size-4" />}
                  </span>
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-start outline-none focus-visible:underline"
                    onClick={() => setOpenedMaterial(index)}
                  >
                    <strong className="block truncate text-sm">{t(`materials.${key}.title`)}</strong>
                    <span className="text-xs text-muted-foreground">{t(`materials.${key}.meta`)}</span>
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      complete ? "bg-success text-success-foreground" : "border border-border text-muted-foreground",
                    )}
                    aria-label={t(complete ? "materials.markIncomplete" : "materials.markComplete")}
                    onClick={() =>
                      setMaterials((current) =>
                        current.map((value, item) => (item === index ? !value : value)),
                      )
                    }
                  >
                    {complete ? <Check className="size-4" /> : <Circle className="size-3" />}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
            {openedMaterial === null
              ? t("materials.helper")
              : t("materials.opened", { title: t(`materials.${materialKeys[openedMaterial]}.title`) })}
          </p>
        </ReviewCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,.95fr)]">
        <Card className="shadow-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <NotebookPen className="size-5 text-primary" aria-hidden="true" />
              {t("notes.title")}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{t("notes.description")}</p>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Textarea
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
              className="min-h-36 bg-card text-sm leading-6"
              aria-label={t("notes.editorLabel")}
            />
            <div className="rounded-xl border border-success bg-success/70 p-3">
              <div className="flex items-center gap-2 font-semibold text-success-foreground">
                <UserRoundCheck className="size-4" aria-hidden="true" />
                {t("feedback.title")}
              </div>
              <p className="mt-1 text-sm leading-6 text-foreground">{t("feedback.text")}</p>
              <p className="mt-1 text-xs text-success-foreground">{t("feedback.private")}</p>
            </div>
            <p className="text-end text-xs text-muted-foreground">{t("notes.saved")}</p>
          </CardContent>
        </Card>

        <Card className="border-assistant bg-assistant/25 shadow-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Bot className="size-5 text-assistant-foreground" aria-hidden="true" />
              {t("companion.title")}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{t("companion.description")}</p>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl rounded-ss-sm bg-card p-3 text-sm leading-6 shadow-surface">
              {t("companion.prompt")}
            </div>
            <div className="mt-3 grid gap-2">
              {(["understood", "watched", "retained"] as const).map((key, index) => (
                <button
                  type="button"
                  key={key}
                  onClick={() =>
                    setReviewChecks((current) =>
                      current.map((value, item) => (item === index ? !value : value)),
                    )
                  }
                  className={cn(
                    "flex min-h-10 items-center gap-2 rounded-lg border px-3 text-start text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                    reviewChecks[index]
                      ? "border-success bg-success text-success-foreground"
                      : "border-border bg-card hover:bg-muted",
                  )}
                >
                  {reviewChecks[index] ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
                  {t(`companion.${key}`)}
                </button>
              ))}
            </div>
            {studentReply ? (
              <div className="ms-auto mt-3 max-w-[88%] rounded-xl rounded-se-sm bg-secondary p-3 text-sm leading-5">
                {studentReply}
              </div>
            ) : null}
            <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
              {reviewProgress === reviewChecks.length
                ? t("companion.complete")
                : t("companion.progress", { complete: reviewProgress, total: reviewChecks.length })}
            </p>
            <form className="mt-3 flex gap-2" onSubmit={sendReply}>
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t("companion.placeholder")}
                aria-label={t("companion.placeholder")}
                className="bg-card"
              />
              <Button type="submit" size="icon" disabled={!draft.trim()} aria-label={t("companion.send")}>
                <SendHorizontal className="rtl:-scale-x-100" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-surface sm:flex-row sm:items-center sm:justify-between">
        <div>
          <strong className="text-sm">{t("download.title")}</strong>
          <p className="text-xs text-muted-foreground">{t("download.description")}</p>
        </div>
        <Button type="button" variant="outline" className="bg-card" onClick={downloadSummary}>
          <Download aria-hidden="true" />
          {t("download.action")}
        </Button>
      </div>
    </section>
  );
}

function ReviewCard({
  icon: Icon,
  title,
  tone,
  children,
}: {
  icon: typeof Target;
  title: string;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="shadow-surface">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <span className="grid size-8 place-items-center rounded-lg bg-muted">
            <Icon className={cn("size-4", tone)} aria-hidden="true" />
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
