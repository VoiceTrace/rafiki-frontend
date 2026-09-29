"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, ChevronDown, Download, File, FileText, Image as ImageIcon, Lightbulb, Link as LinkIcon, MessageCircleQuestion, NotebookPen, Play, Target, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewCompanion } from "./review-companion";
import type { ReviewData } from "../review-types";
import type { StudentMaterial } from "@/features/teacher-resources/server/resource-api";
import { updateMaterialCompletion } from "../actions/material-actions";

type Props = { review: ReviewData; notes: string; onNotesChange: (value: string) => void; assignedMaterials: StudentMaterial[] };
const questionKeys = ["cancel", "effect", "rest"] as const;

export function AfterClassReview({ notes, review, assignedMaterials }: Props) {
  const t = useTranslations("studyCave.afterClass");
  const hasLegacyDemo = review.lesson?.id === "newton-third-law";
  const [materials, setMaterials] = useState(assignedMaterials);
  const [pending, startTransition] = useTransition();
  const summary = useMemo(() => [
    t("download.documentTitle"), "", t("keyPoints.title"),
    ...(review.lesson?.key_points ?? []).map((point) => `• ${point}`),
    ...(hasLegacyDemo ? [
      "", t("materials.title"),
      ...materials.map((item) => `${item.completed ? "[x]" : "[ ]"} ${item.title}`),
      "", t("questions.title"), ...questionKeys.flatMap((key) => [`• ${t(`questions.${key}.question`)}`, `  ${t(`questions.${key}.answer`)}`]),
      "", t("notes.title"), notes, "", t("companion.misconception"), t("companion.correction"),
      "", t("feedback.title"), t("feedback.text"),
    ] : []),
  ].join("\n"), [hasLegacyDemo, materials, notes, review.lesson, t]);

  function downloadSummary() {
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${review.lesson?.id ?? "lesson"}-summary.txt`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(20rem,1fr)]" aria-label={t("workspaceLabel")}>
      {review.lesson && !review.error ? <ReviewCompanion key={review.lesson.id} lessonId={review.lesson.id} initialSession={review.session} /> : null}
      <Card className="min-w-0 shadow-surface">
        <CardHeader className="gap-1 border-b border-border pb-4">
          <CardTitle className="text-lg font-bold">{t("lessonSummary.title")}</CardTitle>
          <p className="text-sm leading-5 text-muted-foreground">{t("lessonSummary.description")}</p>
        </CardHeader>
        <CardContent className="grid gap-2 pt-0">
          <SummarySection icon={Target} title={t("lessonSummary.keyPoints")} tone="bg-secondary text-primary" open>
            <ul className="divide-y divide-border">
              {(review.lesson?.key_points ?? []).map((point) => <li className="flex gap-3 py-3 first:pt-1 last:pb-1" key={point}><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" /><span className="text-sm leading-6 text-muted-foreground">{point}</span></li>)}
            </ul>
          </SummarySection>
          {materials.length ? <SummarySection icon={Play} title={t("lessonSummary.materials")} tone="bg-assistant text-assistant-foreground" open>
            <span className="mb-2 inline-flex rounded-lg bg-success px-2.5 py-1 text-xs font-semibold text-success-foreground">{t("lessonSummary.materialProgress", { complete: materials.filter((item) => item.completed).length, total: materials.length })}</span>
            <ul className="overflow-hidden rounded-xl border border-border">{materials.map((material) => {
              const complete = material.completed;
              const MaterialIcon = material.type === "video" ? Play : material.type === "link" ? LinkIcon : material.type === "image" ? ImageIcon : material.type === "file" ? File : material.type === "question" ? MessageCircleQuestion : FileText;
              return <li className="flex items-center gap-2 border-b border-border px-2.5 py-2 last:border-b-0" key={material.id}>
                <button type="button" disabled={pending} className={complete ? "grid size-6 shrink-0 place-items-center rounded-full bg-success text-success-foreground" : "grid size-6 shrink-0 place-items-center rounded-full border border-border text-muted-foreground"} aria-label={t(complete ? "materials.markIncomplete" : "materials.markComplete")} onClick={() => { const next = !complete; startTransition(async () => { try { await updateMaterialCompletion(material.lesson_id, material.id, next); setMaterials((current) => current.map((item) => item.id === material.id ? { ...item, completed: next } : item)); } catch { /* Preserve the displayed persisted state when the update fails. */ } }); }}>{complete ? <Check className="size-3.5" aria-hidden="true" /> : null}</button>
                <MaterialIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className={complete ? "min-w-0 flex-1 truncate text-xs text-muted-foreground line-through" : "min-w-0 flex-1 truncate text-xs"}>{material.download_url ? <a href={material.download_url} className="underline" target="_blank">{material.title}</a> : material.source_url ? <a href={material.source_url} className="underline" target="_blank" rel="noreferrer">{material.title}</a> : material.title}</span>
                <span className="rounded-full bg-info px-2 py-1 text-[0.65rem] font-semibold text-info-foreground">{t(material.required ? "lessonSummary.required" : "lessonSummary.extra")}</span>
              </li>;
            })}</ul>
          </SummarySection> : null}
          {hasLegacyDemo ? <>
          <SummarySection icon={MessageCircleQuestion} title={t("lessonSummary.questions")}>
            <ul className="grid gap-3">{questionKeys.map((key) => <li className="text-sm leading-5" key={key}><strong className="block">{t(`questions.${key}.question`)}</strong><span className="mt-1 block text-muted-foreground">{t(`questions.${key}.answer`)}</span></li>)}</ul>
          </SummarySection>
          <SummarySection icon={NotebookPen} title={t("lessonSummary.notes")}><p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{notes}</p></SummarySection>
          <SummarySection icon={Lightbulb} title={t("lessonSummary.misconceptions")} tone="bg-success text-success-foreground"><p className="text-sm leading-6 text-muted-foreground">{t("companion.correction")}</p></SummarySection>
          <SummarySection icon={UserRound} title={t("lessonSummary.teacherNote")} tone="bg-secondary text-secondary-foreground"><p className="text-sm leading-6 text-muted-foreground">{t("feedback.text")}</p></SummarySection></> : null}
          <Button type="button" variant="outline" className="mt-1 w-full bg-card text-primary" onClick={downloadSummary}><Download aria-hidden="true" />{t("download.action")}</Button>
        </CardContent>
      </Card>
    </section>
  );
}

function SummarySection({ children, icon: Icon, open = false, title, tone = "bg-muted text-foreground" }: { children: React.ReactNode; icon: typeof Target; open?: boolean; title: string; tone?: string }) {
  return <details className="group overflow-hidden rounded-xl border border-border bg-card" open={open}>
    <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-3 font-semibold marker:content-none"><span className={`grid size-8 shrink-0 place-items-center rounded-lg ${tone}`}><Icon className="size-4" aria-hidden="true" /></span><span className="min-w-0 flex-1 text-sm">{title}</span><ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
    <div className="border-t border-border px-3 py-3">{children}</div>
  </details>;
}
