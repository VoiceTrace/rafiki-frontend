"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, ChevronDown, Download, ExternalLink, File, FileText, Image as ImageIcon, Lightbulb, Link as LinkIcon, MessageCircleQuestion, NotebookPen, Play, Target, UserRound } from "lucide-react";
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
            <ul className="grid gap-3">{materials.map((material) => {
              const complete = material.completed;
              const MaterialIcon = material.type === "video" ? Play : material.type === "link" ? LinkIcon : material.type === "image" ? ImageIcon : material.type === "file" ? File : material.type === "question" ? MessageCircleQuestion : FileText;
              const inlineUrl = material.download_url ? `${material.download_url}?inline=true` : null;
              return <li className="min-w-0 rounded-xl border border-border p-3" key={material.id}>
                <div className="flex min-w-0 items-start gap-2"><MaterialIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /><div className="min-w-0 flex-1"><h3 className="break-words text-sm font-semibold">{material.title}</h3><p className="mt-1 text-xs text-muted-foreground">{t(`materials.types.${material.type}`)}{material.original_filename ? ` · ${material.original_filename}` : ""}</p></div><span className="shrink-0 rounded-full bg-info px-2 py-1 text-[0.65rem] font-semibold text-info-foreground">{t(material.required ? "lessonSummary.required" : "lessonSummary.extra")}</span></div>
                {material.type === "question" && material.question && <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm"><strong>{t("materials.questionLabel")}</strong><p className="mt-1 whitespace-pre-wrap">{material.question}</p></div>}
                {material.description && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{material.description}</p>}
                {material.type === "image" && inlineUrl && <img src={inlineUrl} alt={material.title} loading="lazy" className="mt-3 max-h-80 w-full rounded-lg border object-contain" />}
                {material.type === "video" && inlineUrl && <video controls preload="metadata" src={inlineUrl} className="mt-3 max-h-80 w-full rounded-lg bg-black" />}
                {material.type === "file" && inlineUrl && material.media_type === "application/pdf" && <iframe title={material.title} src={inlineUrl} className="mt-3 h-80 w-full rounded-lg border" />}
                {material.source_url && <a className="mt-3 inline-flex items-center gap-2 text-sm text-primary underline" href={material.source_url} target="_blank" rel="noreferrer">{t("materials.openLink")}<ExternalLink className="size-3" /></a>}
                {material.download_url && <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 p-2"><span className="min-w-0 break-all text-xs text-muted-foreground">{material.original_filename ?? material.title}{material.byte_size ? ` · ${(material.byte_size / 1024 / 1024).toFixed(2)} MB` : ""}</span><a className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-lg border bg-card px-3 text-xs font-semibold text-primary" href={material.download_url} download><Download className="size-3.5" />{t("materials.download")}</a></div>}
                <button type="button" disabled={pending} className={`mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold ${complete ? "bg-success text-success-foreground" : "border border-border"}`} aria-label={t(complete ? "materials.markIncomplete" : "materials.markComplete")} onClick={() => { const next = !complete; startTransition(async () => { try { await updateMaterialCompletion(material.lesson_id, material.id, next); setMaterials((current) => current.map((item) => item.id === material.id ? { ...item, completed: next } : item)); } catch { /* Preserve the displayed persisted state when the update fails. */ } }); }}>{complete ? <Check className="size-3.5" aria-hidden="true" /> : null}{t(complete ? "materials.markIncomplete" : "materials.markComplete")}</button>
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
