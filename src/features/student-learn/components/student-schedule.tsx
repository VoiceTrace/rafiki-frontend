"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EventEditor } from "./calendar/event-editor";
import { addDays } from "./calendar/date-utils";
import { ScheduleDayView, ScheduleMonthView, ScheduleWeekView } from "./calendar/calendar-views";
import { ScheduleToolbar } from "./calendar/schedule-toolbar";
import type { CalendarView, ScheduleDraft, ScheduleEvent } from "./calendar/types";

export type { CalendarView } from "./calendar/types";

const initialEvents: ScheduleEvent[] = [
  { id: "physics", title: "Newton's Third Law", subject: "Grade 10 Physics", date: "2026-09-09", start: "10:00", duration: 45, place: "Room B2", kind: "school", tone: "orange" },
  { id: "forces", title: "Forces and Motion", subject: "Physics", date: "2026-09-08", start: "12:00", duration: 45, place: "Room A1", kind: "school", tone: "blue" },
  { id: "momentum", title: "Momentum and Collisions", subject: "Physics", date: "2026-09-10", start: "14:00", duration: 45, place: "Room C3", kind: "school", tone: "purple" },
];

function EventDetails({ event, onEdit, onDelete }: { event?: ScheduleEvent; onEdit: () => void; onDelete: () => void }) {
  const t = useTranslations("studentLearn.week");
  if (!event) return <aside className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">{t("selectEvent")}</p></aside>;
  return <aside className="rounded-xl border bg-card p-4"><span className="rounded-full bg-assistant px-2 py-1 text-xs">{event.kind === "school" ? t("prepared") : t("personal")}</span><p className="mt-4 text-xs text-muted-foreground">{event.subject}</p><h3 className="text-lg font-bold">{event.title}</h3><div className="mt-4 space-y-2 text-sm"><p className="flex gap-2"><CalendarDays className="size-4" />{event.date}</p><p className="flex gap-2"><Clock className="size-4" />{event.start}</p><p className="flex gap-2"><MapPin className="size-4" />{event.place}</p></div>{event.kind === "personal" && <div className="mt-4 grid grid-cols-2 gap-2"><Button variant="outline" onClick={onEdit}><Pencil />{t("edit")}</Button><Button variant="outline" className="text-destructive" onClick={onDelete}><Trash2 />{t("delete")}</Button></div>}</aside>;
}

export function StudentSchedule({ initialView = "day" }: { initialView?: CalendarView }) {
  const t = useTranslations("studentLearn.week");
  const locale = useLocale();
  const [view, setView] = useState<CalendarView>(initialView);
  const [date, setDate] = useState("2026-09-09");
  const [events, setEvents] = useState(initialEvents);
  const [selected, setSelected] = useState<string | null>("physics");
  const [mode, setMode] = useState<"add" | "edit" | null>(null);
  const currentEvent = useMemo(() => events.find((event) => event.id === selected), [events, selected]);

  const saveEvent = (draft: ScheduleDraft) => {
    if (mode === "edit" && currentEvent?.kind === "personal") {
      setEvents((current) => current.map((event) => event.id === currentEvent.id ? { ...event, title: draft.title, date: draft.date, start: draft.start, duration: Number(draft.duration), place: draft.place } : event));
    } else {
      const created: ScheduleEvent[] = [];
      for (let eventDate = draft.date; eventDate <= (draft.repeat === "weekly" ? draft.end : draft.date) && created.length < 53; eventDate = addDays(eventDate, 7)) {
        created.push({ id: `personal-${Date.now()}-${created.length}`, title: draft.title, date: eventDate, start: draft.start, duration: Number(draft.duration), place: draft.place, kind: "personal", tone: "purple" });
        if (draft.repeat === "none") break;
      }
      setEvents((current) => [...current, ...created]);
      setSelected(created[0]?.id ?? null);
    }
    setMode(null);
  };

  const removeEvent = () => {
    if (currentEvent?.kind === "personal" && confirm(t("deleteConfirm", { title: currentEvent.title }))) {
      setEvents((current) => current.filter((event) => event.id !== currentEvent.id));
      setSelected(null);
    }
  };

  const viewProps = { date, events, selected, select: setSelected, locale };
  const calendar = view === "day" ? <ScheduleDayView {...viewProps} /> : view === "week" ? <ScheduleWeekView {...viewProps} /> : <ScheduleMonthView {...viewProps} />;

  return <section><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-bold">{t("title")}</h2><p className="text-sm text-muted-foreground">{t("subtitle")}</p></div><Button onClick={() => setMode("add")}><Plus data-icon="inline-start" />{t("add")}</Button></div><div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]"><Card className="gap-0 overflow-hidden py-0"><ScheduleToolbar view={view} date={date} onView={setView} onDate={setDate} /><div className="overflow-x-auto">{calendar}</div></Card><EventDetails event={currentEvent} onEdit={() => setMode("edit")} onDelete={removeEvent} /></div>{mode && <EventEditor key={mode + (currentEvent?.id ?? date)} date={date} value={mode === "edit" ? currentEvent : undefined} close={() => setMode(null)} save={saveEvent} />}</section>;
}
