"use client";

import { BookOpen, ClipboardCheck, LockKeyhole, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import type { StudyCavePhase } from "@/features/study-cave/types";

const icons: Record<StudyCavePhase, LucideIcon> = { before: BookOpen, after: ClipboardCheck, homework: LockKeyhole };

export function StudyCavePhaseTabs({ phases, activePhase, onSelect, t, lessonId }: { lessonId?: string; phases: readonly StudyCavePhase[]; activePhase: StudyCavePhase; onSelect: (phase: StudyCavePhase) => void; t: (key: string) => string }) {
  return <nav className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-card p-2 shadow-surface sm:grid-cols-3" aria-label={t("phasesLabel")}>{phases.map((phase) => { const Icon = icons[phase]; const active = phase === activePhase; return <a href={`?phase=${phase}${lessonId ? `&lesson_id=${encodeURIComponent(lessonId)}` : ""}`} key={phase} onClick={() => onSelect(phase)} aria-current={active ? "step" : undefined} className={cn("flex min-h-14 items-center gap-3 rounded-xl px-3 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring", active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-muted")}><span className={cn("grid size-9 shrink-0 place-items-center rounded-full border", active ? "border-primary/20 bg-card text-primary" : "border-border bg-muted")}><Icon className="size-4" /></span><span><strong className="block text-sm">{t(`tabs.${phase}`)}</strong><small className="hidden text-xs opacity-75 lg:block">{t(`tabDescriptions.${phase}`)}</small></span></a>; })}</nav>;
}
