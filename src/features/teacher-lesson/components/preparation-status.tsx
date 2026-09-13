"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function DraftLabel() {
  const t = useTranslations("teacherLesson.preparation");
  return <span className="rounded-full bg-assistant px-2 py-0.5 text-[10px] font-medium text-assistant-foreground">{t("aiDraft")}</span>;
}

export function PreparationStatus({ tone, icon: Icon, title, text, actions, spinning = false }: { tone: "assistant" | "error" | "warning" | "success"; icon: LucideIcon; title: string; text: string; actions?: ReactNode; spinning?: boolean }) {
  const toneClasses = { assistant: "border-assistant bg-assistant/35", error: "border-destructive/30 bg-destructive/10", warning: "border-primary/30 bg-secondary", success: "border-success/30 bg-success/15" };
  return <div className={`flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 ${toneClasses[tone]}`} aria-live="polite"><Icon className={`size-5 shrink-0 ${spinning ? "animate-spin" : ""}`} /><div className="min-w-0 flex-1"><strong className="block text-sm">{title}</strong><span className="text-xs text-muted-foreground">{text}</span></div>{actions}</div>;
}
