"use client";

import { type FormEvent, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Event = { title: string; time: string; place: string };
type View = "day" | "week" | "month";

export function LearningWeek() {
  const t = useTranslations("studentLearn.week");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("day");
  const [dateIndex, setDateIndex] = useState(1);
  const [event, setEvent] = useState<Event | null>({
    title: t("eventTitle"),
    time: t("eventTime"),
    place: t("eventPlace"),
  });
  const dates = [t("datePrevious"), t("date"), t("dateNext")];
  const schedule = [
    { time: t("timeOne"), subject: t("math"), detail: t("roomOne") },
    { time: t("timeTwo"), subject: t("physics"), detail: t("physicsDetail"), current: true },
    { time: t("timeThree"), subject: t("english"), detail: t("roomTwo") },
    { time: t("timeFour"), subject: t("computerScience"), detail: t("roomThree") },
    { time: t("timeFive"), subject: t("pe"), detail: t("sportsHall") },
  ];

  function saveEvent(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const form = new FormData(formEvent.currentTarget);
    setEvent({
      title: String(form.get("title") || t("eventTitle")),
      time: String(form.get("time") || t("eventTime")),
      place: String(form.get("place") || t("eventPlace")),
    });
    setOpen(false);
  }

  return (
    <Card className="self-start gap-3 py-4 shadow-surface" data-testid="learning-week">
      <CardHeader className="grid grid-cols-[1fr_auto] items-center px-4">
        <CardTitle className="font-semibold">{t("title")}</CardTitle>
        <div className="flex rounded-lg bg-muted p-1" role="tablist" aria-label={t("viewLabel")}>
          {(["day", "week", "month"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={view === option}
              className={cn(
                "min-h-7 rounded-md px-3 text-xs font-medium text-foreground/70 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                view === option && "bg-secondary text-secondary-foreground shadow-surface",
              )}
              onClick={() => setView(option)}
            >
              {t(option)}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-4">
        <div className="mb-3 grid grid-cols-[auto_1fr_auto] items-center gap-2">
          <Button type="button" variant="outline" size="icon-sm" aria-label={t("previous")} disabled={dateIndex === 0} onClick={() => setDateIndex((index) => Math.max(0, index - 1))}>
            <ChevronLeft className="rtl:-scale-x-100" />
          </Button>
          <strong className="text-center text-xs">{dates[dateIndex]}</strong>
          <Button type="button" variant="outline" size="icon-sm" aria-label={t("next")} disabled={dateIndex === dates.length - 1} onClick={() => setDateIndex((index) => Math.min(dates.length - 1, index + 1))}>
            <ChevronRight className="rtl:-scale-x-100" />
          </Button>
        </div>

        <ol className="flex flex-col gap-1.5">
          {schedule.map((item) => (
            <li key={item.time + item.subject} className="grid grid-cols-[3.6rem_1fr] items-stretch gap-2 text-xs">
              <time className="pt-2 font-medium text-muted-foreground">{item.time}</time>
              <div className={cn("relative rounded-md bg-muted px-3 py-2", item.current && "bg-secondary ps-4")}>
                {item.current ? <span className="absolute inset-y-0 start-0 w-1 rounded-full bg-primary" aria-hidden="true" /> : null}
                <strong className="block text-foreground">{item.subject}</strong>
                <span className="block text-foreground/70">{item.detail}</span>
              </div>
            </li>
          ))}
        </ol>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="mt-4 w-full bg-secondary-foreground hover:bg-secondary-foreground/90" size="lg" />}>
            <Plus data-icon="inline-start" />
            {t("add")}
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>{event ? t("editTitle") : t("addTitle")}</DialogTitle>
              <DialogDescription>{t("description")}</DialogDescription>
            </DialogHeader>
            <form key={`${event?.title}-${event?.time}-${event?.place}`} onSubmit={saveEvent}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="event-title">{t("name")}</FieldLabel>
                  <Input id="event-title" name="title" required defaultValue={event?.title} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="event-time">{t("time")}</FieldLabel>
                  <Input id="event-time" name="time" required defaultValue={event?.time} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="event-place">{t("place")}</FieldLabel>
                  <Input id="event-place" name="place" required defaultValue={event?.place} />
                </Field>
              </FieldGroup>
              <DialogFooter className="mt-5">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                <Button type="submit">{t("save")}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {event ? (
          <div className="mt-4 rounded-lg bg-assistant/45 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold">{t("personal")}</span>
                <strong className="mt-3 block text-sm">{event.title}</strong>
                <span className="block text-xs text-foreground/70">{event.time}</span>
                <span className="block text-xs text-foreground/70">{event.place}</span>
              </div>
              <Button type="button" variant="ghost" size="icon-sm" aria-label={t("edit")} onClick={() => setOpen(true)}><Pencil /></Button>
            </div>
            <Button type="button" variant="outline" className="mt-3 w-full border-destructive/60 text-destructive" onClick={() => setEvent(null)}>
              <Trash2 data-icon="inline-start" />
              {t("delete")}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
