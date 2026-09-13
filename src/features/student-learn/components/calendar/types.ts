export type CalendarView = "day" | "week" | "month";

export type ScheduleEvent = {
  id: string;
  title: string;
  date: string;
  start: string;
  duration: number;
  place: string;
  kind: "school" | "personal";
  tone: "orange" | "blue" | "purple";
  subject?: string;
};

export type ScheduleDraft = {
  title: string;
  date: string;
  start: string;
  duration: string;
  place: string;
  repeat: "none" | "weekly";
  end: string;
};

export type CalendarViewProps = {
  date: string;
  events: ScheduleEvent[];
  selected: string | null;
  select: (id: string) => void;
  locale: string;
};
