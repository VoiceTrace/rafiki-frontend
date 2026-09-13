"use client";

import { cn } from "cn";
import { CalendarEventCard } from "./calendar-event-card";
import { formatHour, parseIsoDate, startOfWeek, toIsoDate, timeToMinutes } from "./date-utils";
import type { CalendarViewProps } from "./types";

const hours = Array.from({ length: 9 }, (_, index) => index + 8);

export function ScheduleDayView({ date, events, selected, select, locale }: CalendarViewProps) {
  return <div className="min-w-[34rem]"><div className="grid grid-cols-[4rem_1fr] border-b bg-muted/40 text-center text-xs font-semibold"><span /><span className="p-3">{new Intl.DateTimeFormat(locale, { weekday: "long", month: "long", day: "numeric" }).format(parseIsoDate(date))}</span></div><div className="relative h-[32rem] bg-[linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[length:100%_4rem]">{hours.map((hour) => <span key={hour} className="absolute start-1 text-[10px] text-muted-foreground" style={{ top: (hour - 8) * 64 + 4 }}>{formatHour(hour)}</span>)}<div className="absolute inset-y-0 start-16 end-0 border-s">{events.filter((event) => event.date === date).map((event) => <div key={event.id} className="absolute inset-x-3" style={{ top: ((timeToMinutes(event.start) - 480) / 60) * 64, minHeight: Math.max(44, (event.duration / 60) * 64) }}><CalendarEventCard event={event} active={selected === event.id} onClick={() => select(event.id)} /></div>)}</div></div></div>;
}

export function ScheduleWeekView({ date, events, selected, select, locale }: CalendarViewProps) {
  const firstDay = startOfWeek(date);
  const days = Array.from({ length: 7 }, (_, index) => { const day = new Date(firstDay); day.setDate(firstDay.getDate() + index); return day; });
  return <div className="w-full overflow-hidden"><div className="grid grid-cols-[4rem_repeat(7,1fr)] border-b bg-muted/40 text-center text-xs font-semibold"><span />{days.map((day) => <span key={toIsoDate(day)} className={cn("p-2", toIsoDate(day) === date && "bg-secondary")}>{new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric" }).format(day)}</span>)}</div><div className="relative h-[32rem] bg-[linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[length:100%_4rem]">{hours.map((hour) => <span key={hour} className="absolute start-1 text-[10px] text-muted-foreground" style={{ top: (hour - 8) * 64 + 4 }}>{formatHour(hour)}</span>)}<div className="absolute inset-y-0 start-16 end-0 grid grid-cols-7">{days.map((day) => <div key={toIsoDate(day)} className="relative border-s">{events.filter((event) => event.date === toIsoDate(day)).map((event) => <div key={event.id} className="absolute inset-x-1" style={{ top: ((timeToMinutes(event.start) - 480) / 60) * 64 }}><CalendarEventCard event={event} active={selected === event.id} onClick={() => select(event.id)} /></div>)}</div>)}</div></div></div>;
}

export function ScheduleMonthView({ date, events, selected, select, locale }: CalendarViewProps) {
  const focus = parseIsoDate(date);
  const firstDay = startOfWeek(toIsoDate(new Date(focus.getFullYear(), focus.getMonth(), 1)));
  const days = Array.from({ length: 42 }, (_, index) => { const day = new Date(firstDay); day.setDate(firstDay.getDate() + index); return day; });
  return <div className="min-w-[45rem]"><div className="grid grid-cols-7 bg-muted/40">{days.slice(0, 7).map((day) => <b key={toIsoDate(day)} className="p-2 text-center text-xs">{new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day)}</b>)}</div><div className="grid grid-cols-7">{days.map((day) => { const dayKey = toIsoDate(day); return <div key={dayKey} className={cn("min-h-24 border-s border-t p-1.5", day.getMonth() !== focus.getMonth() && "bg-muted/30 text-muted-foreground", dayKey === date && "bg-secondary/50")}><time className="text-xs font-semibold">{day.getDate()}</time><div className="mt-1 space-y-1">{events.filter((event) => event.date === dayKey).map((event) => <CalendarEventCard key={event.id} event={event} compact active={selected === event.id} onClick={() => select(event.id)} />)}</div></div>; })}</div></div>;
}
