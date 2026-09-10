"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "cn";

type Priority = "high" | "medium" | "low";

const taskKeys = ["review", "prepare", "respond", "rubric", "support"] as const;

export function TeacherTaskList() {
  const t = useTranslations("teacherToday.tasks");
  const [filter, setFilter] = useState<"all" | Priority>("all");
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const [extraTasks, setExtraTasks] = useState<string[]>([]);
  const priorities: Priority[] = ["high", "medium", "high", "low", "medium"];
  const tasks = [
    ...taskKeys.map((key, index) => ({
      id: key,
      label: t(key),
      priority: priorities[index],
      due: index < 3 ? t("today") : t("tomorrow"),
    })),
    ...extraTasks.map((label, index) => ({
      id: `extra-${index}`,
      label,
      priority: "medium" as const,
      due: t("today"),
    })),
  ];
  const visibleTasks = tasks.filter(
    (task) => filter === "all" || task.priority === filter,
  );

  function toggleTask(id: string) {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <Card className="gap-3 py-4 shadow-surface">
      <CardHeader className="flex-row items-center justify-between gap-3 px-4 sm:px-5">
        <CardTitle className="font-semibold">{t("title")}</CardTitle>
        <div
          className="flex flex-wrap justify-end gap-2"
          role="group"
          aria-label={t("filterLabel")}
        >
          {(["all", "high", "medium", "low"] as const).map((option) => (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={filter === option ? "secondary" : "outline"}
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
            >
              {t(option)}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-5">
        <ul className="flex flex-col gap-1">
          {visibleTasks.map((task) => (
            <li
              key={task.id}
              className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted"
            >
              <Checkbox
                checked={completed.has(task.id)}
                onCheckedChange={() => toggleTask(task.id)}
                aria-label={task.label}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  completed.has(task.id) &&
                    "text-muted-foreground line-through",
                )}
              >
                {task.label}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-medium",
                  task.priority === "high" &&
                    "bg-destructive/10 text-destructive",
                  task.priority === "medium" &&
                    "bg-secondary text-secondary-foreground",
                  task.priority === "low" &&
                    "bg-success text-success-foreground",
                )}
              >
                {t(task.priority)}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                {task.due}
              </span>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="ghost"
          className="mt-2 self-start text-secondary-foreground"
          onClick={() => setExtraTasks((items) => [...items, t("newTask")])}
        >
          <Plus data-icon="inline-start" />
          {t("add")}
        </Button>
      </CardContent>
    </Card>
  );
}
