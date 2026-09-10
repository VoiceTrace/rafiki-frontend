"use client";

import { cn } from "cn";

type LessonStageTabsProps<T extends string> = {
  active: T;
  ariaLabel: string;
  items: ReadonlyArray<{ value: T; label: string; disabled?: boolean }>;
  onChange: (value: T) => void;
};

/** Shared lesson-loop stage rail for student and teacher workspaces. */
export function LessonStageTabs<T extends string>({
  active,
  ariaLabel,
  items,
  onChange,
}: LessonStageTabsProps<T>) {
  return (
    <nav
      className="grid grid-flow-col auto-cols-fr rounded-xl border border-border bg-card p-1"
      aria-label={ariaLabel}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          disabled={item.disabled}
          aria-current={active === item.value ? "step" : undefined}
          className={cn(
            "min-h-10 rounded-lg px-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55",
            active === item.value
              ? "bg-secondary text-secondary-foreground shadow-surface"
              : "text-muted-foreground hover:bg-muted",
          )}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
