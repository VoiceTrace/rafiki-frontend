"use client";

import { type FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { ScheduleDraft, ScheduleEvent } from "./types";

export function EventEditor({ date, value, close, save }: { date: string; value?: ScheduleEvent; close: () => void; save: (draft: ScheduleDraft) => void }) {
  const t = useTranslations("studentLearn.week");
  const [draft, setDraft] = useState<ScheduleDraft>(() => value ? { title: value.title, date: value.date, start: value.start, duration: String(value.duration), place: value.place, repeat: "none", end: value.date } : { title: "", date, start: "16:00", duration: "30", place: "", repeat: "none", end: date });
  const setField = (key: keyof ScheduleDraft, fieldValue: string) => setDraft((current) => ({ ...current, [key]: fieldValue }));
  const invalidRange = draft.repeat === "weekly" && draft.end < draft.date;
  return <Dialog open onOpenChange={(open) => !open && close()}><DialogContent><DialogHeader><DialogTitle>{value ? t("editTitle") : t("addTitle")}</DialogTitle><DialogDescription>{t("description")}</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={(event: FormEvent) => { event.preventDefault(); if (!invalidRange) save(draft); }}><label className="grid gap-1 text-sm">{t("name")}<Input required value={draft.title} onChange={(event) => setField("title", event.target.value)} /></label><div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1 text-sm">{t("eventDate")}<Input type="date" value={draft.date} onChange={(event) => setField("date", event.target.value)} /></label><label className="grid gap-1 text-sm">{t("time")}<Input type="time" value={draft.start} onChange={(event) => setField("start", event.target.value)} /></label><label className="grid gap-1 text-sm">{t("duration")}<Input type="number" min="15" step="15" value={draft.duration} onChange={(event) => setField("duration", event.target.value)} /></label><label className="grid gap-1 text-sm">{t("place")}<Input required value={draft.place} onChange={(event) => setField("place", event.target.value)} /></label><label className="grid gap-1 text-sm">{t("recurrence")}<select className="h-9 rounded-md border bg-background px-3" value={draft.repeat} onChange={(event) => setField("repeat", event.target.value)}><option value="none">{t("doesNotRepeat")}</option><option value="weekly">{t("weekly")}</option></select></label>{draft.repeat === "weekly" && <label className="grid gap-1 text-sm">{t("endDate")}<Input type="date" min={draft.date} value={draft.end} onChange={(event) => setField("end", event.target.value)} /></label>}</div>{draft.repeat === "weekly" && <p className={cn("rounded-lg bg-assistant/50 p-3 text-xs", invalidRange && "text-destructive")}>{invalidRange ? t("recurrenceError") : t("weeklyPreview", { date: draft.date, end: draft.end })}</p>}<DialogFooter><Button type="button" variant="outline" onClick={close}>{t("cancel")}</Button><Button disabled={invalidRange}>{t("save")}</Button></DialogFooter></form></DialogContent></Dialog>;
}
