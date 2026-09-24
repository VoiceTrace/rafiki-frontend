"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Lightbulb, Sparkles, Target } from "lucide-react";
import type { MasteryOutcome, ReviewSummary } from "../review-types";

const outcomeStyles: Record<MasteryOutcome, string> = {
  secure: "border-success/35 bg-success/25",
  developing: "border-assistant bg-assistant/35",
  needs_support: "border-primary/30 bg-secondary/55",
};

export function ReviewCompletionSummary({ summary }: { summary: ReviewSummary }) {
  const t = useTranslations("reviewChat.summary");

  return (
    <section className="col-span-full grid min-w-0 gap-4 rounded-2xl border border-success/35 bg-card p-4 shadow-sm sm:p-5" aria-labelledby="review-summary-title" data-testid="review-completion-summary">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-success text-success-foreground">
            <CheckCircle2 className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 id="review-summary-title" className="font-heading text-lg font-bold">{t("title")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("description", { lesson: summary.lesson_title })}</p>
          </div>
        </div>
        <span className="w-fit shrink-0 whitespace-nowrap rounded-full bg-success/60 px-3 py-1 text-xs font-semibold text-success-foreground">
          {t("attempts", { count: summary.total_attempts })}
        </span>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-3">
        {summary.concepts.map((concept) => (
          <article key={concept.concept_ref} className={`rounded-xl border p-4 ${outcomeStyles[concept.outcome]}`}>
            <div className="flex flex-wrap items-center gap-2">
              <Target className="size-4 shrink-0 text-assistant-foreground" aria-hidden="true" />
              <h4 className="font-semibold">{concept.title}</h4>
              <span className="ms-auto rounded-full bg-card/80 px-2.5 py-1 text-xs font-semibold">
                {t(`outcomes.${concept.outcome}`)}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6">{concept.message}</p>
            {concept.completed_with_support ? (
              <p className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Lightbulb className="size-4 shrink-0" aria-hidden="true" />
                {t("withSupport")}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      <div className="flex gap-3 rounded-xl border border-assistant bg-assistant/30 p-4">
        <Sparkles className="mt-0.5 size-5 shrink-0 text-assistant-foreground" aria-hidden="true" />
        <div>
          <h4 className="text-sm font-semibold">{t("nextStep")}</h4>
          <p className="mt-1 text-sm leading-6">{summary.next_step}</p>
        </div>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">{t("notGrade")}</p>
    </section>
  );
}
