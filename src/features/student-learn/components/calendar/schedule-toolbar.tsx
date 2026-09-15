"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addDays, parseIsoDate, toIsoDate } from "./date-utils";
import type { CalendarView } from "./types";

export function ScheduleToolbar({
  view,
  date,
  onView,
  onDate,
}: {
  view: CalendarView;
  date: string;
  onView: (view: CalendarView) => void;
  onDate: (date: string) => void;
}) {
  const t = useTranslations("studentLearn.week");
  const move = (amount: number) => {
    if (view === "day") onDate(addDays(date, amount));
    else if (view === "week") onDate(addDays(date, amount * 7));
    else {
      const nextDate = parseIsoDate(date);
      nextDate.setMonth(nextDate.getMonth() + amount);
      onDate(toIsoDate(nextDate));
    }
  };

  return (
    <div className="flex flex-col gap-3 border-b p-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => onDate(toIsoDate(new Date()))}>
          {t("today")}
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label={t("previous")} onClick={() => move(-1)}>
          <ChevronLeft className="rtl:-scale-x-100" />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label={t("next")} onClick={() => move(1)}>
          <ChevronRight className="rtl:-scale-x-100" />
        </Button>
        <Input className="h-8 w-36 text-xs" type="date" value={date} aria-label={t("datePicker")} onChange={(event) => onDate(event.target.value)} />
      </div>
      <div className="flex rounded-lg bg-muted p-1" role="tablist">
        {(["day", "week", "month"] as CalendarView[]).map((calendarView) => (
          <button key={calendarView} type="button" role="tab" aria-selected={view === calendarView} onClick={() => onView(calendarView)} className={cn("min-h-8 flex-1 rounded-md px-4 text-xs font-semibold", view === calendarView && "bg-secondary text-secondary-foreground shadow-sm")}>
            {t(calendarView)}
          </button>
        ))}
      </div>
    </div>
  );
}
