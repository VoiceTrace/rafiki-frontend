"use client";

import { cn } from "cn";
import type { ScheduleEvent } from "./types";

export function CalendarEventCard({
  event,
  active,
  onClick,
  compact = false,
}: {
  event: ScheduleEvent;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-md border-s-4 p-2 text-start text-[11px]",
        event.tone === "orange" && "border-primary bg-secondary",
        event.tone === "blue" && "border-sky-500 bg-sky-50",
        event.tone === "purple" && "border-violet-500 bg-assistant/60",
        active && "ring-2 ring-primary",
        compact && "truncate px-1 py-1",
      )}
    >
      {!compact && <small className="block opacity-70">{event.start}</small>}
      <strong className="block truncate">{event.title}</strong>
      {!compact && <small className="block truncate opacity-70">{event.place}</small>}
    </button>
  );
}
