"use client";

import { useMemo, useState } from "react";
import {
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
  Target,
  UserRoundCheck,
  Video,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ReviewCompanion } from "./review-companion";
import type { ReviewData } from "../review-types";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  review: ReviewData;
  notes: string;
  onNotesChange: (value: string) => void;
};

const selfCheckKeys = ["pairs", "objects", "apply", "explain"] as const;
const timelineKeys = ["examples", "pairs", "scenarios", "problems"] as const;
const questionKeys = ["cancel", "effect", "rest"] as const;
const materialKeys = ["slides", "reading", "video", "practice"] as const;
const materialIcons = [FileText, FileText, Video, ListChecks] as const;

export function AfterClassReview({ notes, onNotesChange, review }: Props) {
  const t = useTranslations("studyCave.afterClass");
  const hasLegacyDemo = review.lesson?.id === "newton-third-law";
  const [selfChecks, setSelfChecks] = useState([true, true, false, false]);
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
  const [materials, setMaterials] = useState([true, true, false, false]);
  const [openedMaterial, setOpenedMaterial] = useState<number | null>(null);

  const summary = useMemo(
    () =>
      [
        t("download.documentTitle"),
        "",
        t("objective.title"),
        review.lesson?.objective ?? "",
        "",
        t("keyPoints.title"),
        ...(review.lesson?.key_points ?? []).map((point) => `• ${point}`),
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
        t("selfCheck.title"),
        ...selfCheckKeys.map(
          (key, index) => `${selfChecks[index] ? "[x]" : "[ ]"} ${t(`selfCheck.${key}`)}`,
        ),
        "",
        t("materials.title"),
        ...materialKeys.map(
          (key, index) => `${materials[index] ? "[x]" : "[ ]"} ${t(`materials.${key}.title`)}`,
        ),
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
    [materials, notes, selfChecks, t, review.lesson],
  );

  function downloadSummary() {
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "newtons-third-law-review.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="grid gap-4" aria-label={t("workspaceLabel")}>
      <div className="grid gap-4 lg:grid-cols-2">
        <ReviewCard icon={Target} title={t("objective.title")} tone="text-info-foreground">
          <p className="leading-6 text-muted-foreground">{review.lesson?.objective ?? "—"}</p>
        </ReviewCard>

        <ReviewCard icon={FileText} title={t("keyPoints.title")} tone="text-info-foreground">
          <ul className="grid gap-2">
            {(review.lesson?.key_points ?? []).map((point) => (
              <li className="flex gap-2 leading-5" key={point}>
                <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-success text-success-foreground">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </ReviewCard>

        {hasLegacyDemo && <>
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
                    aria-expanded={openedMaterial === index}
                    onClick={() => setOpenedMaterial(openedMaterial === index ? null : index)}
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
          {openedMaterial === null ? (
            <p className="mt-3 text-xs text-muted-foreground">{t("materials.helper")}</p>
          ) : (
            <div className="mt-3 rounded-xl border border-info bg-info/50 p-4" aria-live="polite">
              <div className="flex items-start justify-between gap-3">
                <strong className="text-sm">{t(`materials.${materialKeys[openedMaterial]}.previewTitle`)}</strong>
                <button
                  type="button"
                  className="rounded-md p-1 text-muted-foreground hover:bg-card focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={t("materials.closePreview")}
                  onClick={() => setOpenedMaterial(null)}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 text-sm leading-6">{t(`materials.${materialKeys[openedMaterial]}.preview`)}</p>
              <p className="mt-3 text-xs text-info-foreground">{t("materials.attachmentPending")}</p>
            </div>
          )}
        </ReviewCard>
        </>}
      </div>

      <div className={hasLegacyDemo ? "grid items-start gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,.95fr)]" : "grid gap-4"}>
        {hasLegacyDemo && (
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

        )}

        {review.lesson && !review.error && <ReviewCompanion key={review.lesson.id} lessonId={review.lesson.id} initialSession={review.session} />}
      </div>

      {hasLegacyDemo && <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-surface sm:flex-row sm:items-center sm:justify-between">
        <div>
          <strong className="text-sm">{t("download.title")}</strong>
          <p className="text-xs text-muted-foreground">{t("download.description")}</p>
        </div>
        <Button type="button" variant="outline" className="bg-card" onClick={downloadSummary}>
          <Download aria-hidden="true" />
          {t("download.action")}
        </Button>
      </div>}
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
