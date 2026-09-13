"use client";

import { Lightbulb, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type InsightState = "populated" | "empty" | "processing" | "failed" | "permission";

export function PreparationInsightCard({ state, onRefresh }: { state: InsightState; onRefresh: () => void }) {
  const t = useTranslations("teacherLesson.preparation");
  const body = state === "populated" ? <><div className="rounded-lg bg-card/80 p-3"><p className="font-semibold text-sm">{t("misconception")}</p><p className="mt-1 text-xs text-muted-foreground">{t("responses")}</p><ul className="mt-2 grid gap-1 text-xs"><li>“{t("evidenceOne")}”</li><li>“{t("evidenceTwo")}”</li></ul></div><div className="mt-3 flex gap-2 rounded-lg bg-success/20 p-3 text-sm"><Lightbulb className="size-4 shrink-0 text-success-foreground" />{t("suggestion")}</div></> : <p className="text-sm text-muted-foreground">{t(`insight.${state}`)}</p>;
  return <Card className="border-assistant bg-assistant/25 shadow-surface"><CardHeader className="flex-row items-center"><CardTitle className="flex gap-2"><Lightbulb className="size-5 text-assistant-foreground" />{t("insightTitle")}</CardTitle><Button className="ms-auto" size="icon-xs" variant="ghost" aria-label={t("refreshInsights")} onClick={onRefresh}><RefreshCw className={state === "processing" ? "animate-spin" : ""} /></Button></CardHeader><CardContent>{body}{state === "failed" ? <Button className="mt-3" size="sm" onClick={onRefresh}><RefreshCw />{t("retry")}</Button> : null}{state === "permission" ? <p className="mt-3 text-xs text-muted-foreground">{t("consent")}</p> : null}</CardContent></Card>;
}
