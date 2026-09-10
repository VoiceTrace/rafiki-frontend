import { Clock3 } from "lucide-react";
import { cn } from "cn";

export type ScheduleItem = {
  time: string;
  subject: string;
  detail: string;
  current?: boolean;
};

export function ScheduleList({ items, showIcons = true, label }: { items: ScheduleItem[]; showIcons?: boolean; label?: string }) {
  return (
    <ol className="flex flex-col gap-1" aria-label={label}>
      {items.map((item) => (
        <li
          key={item.time + item.subject}
          className={cn(
            "grid grid-cols-[5.75rem_1fr] items-center gap-3 rounded-lg px-3 py-1.5 text-sm sm:grid-cols-[6.5rem_1fr]",
            item.current ? "bg-secondary" : "hover:bg-muted",
            !showIcons && "grid-cols-[4.25rem_1fr] sm:grid-cols-[4.25rem_1fr]",
          )}
        >
          <time className={cn("flex items-center gap-1.5 font-medium text-muted-foreground", item.current && "text-foreground/70")}>
            {!showIcons ? null : item.current ? (
              <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
            ) : (
              <Clock3 className="size-3.5 opacity-50" aria-hidden="true" />
            )}
            {item.time}
          </time>
          <span className="min-w-0">
            <strong className="block truncate font-semibold">{item.subject}</strong>
            <span className={cn("block truncate text-xs text-muted-foreground", item.current && "text-foreground/70")}>
              {item.detail}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
