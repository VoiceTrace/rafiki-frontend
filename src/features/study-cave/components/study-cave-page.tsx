"use client";

import { type FormEvent, useRef, useState } from "react";
import {
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  FileText,
  HelpCircle,
  Lightbulb,
  LockKeyhole,
  Pencil,
  Play,
  Plus,
  Radio,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Phase = "before" | "during" | "after" | "homework";
type Question = { id: number; text: string; status: "sent" | "pending" };
const phases: Phase[] = ["before", "during", "after", "homework"];
const icons: Record<Phase, LucideIcon> = {
  before: BookOpen,
  during: Play,
  after: LockKeyhole,
  homework: LockKeyhole,
};

function Title({
  icon: Icon,
  children,
  tone = "text-primary",
}: {
  icon: LucideIcon;
  children: React.ReactNode;
  tone?: string;
}) {
  return (
    <CardTitle className="flex items-center gap-2 text-base font-bold">
      <Icon className={cn("size-5", tone)} aria-hidden="true" />
      {children}
    </CardTitle>
  );
}

export function StudyCavePage() {
  const t = useTranslations("studyCave");
  const [phase, setPhase] = useState<Phase>("before");
  const [checks, setChecks] = useState([true, true, false, false]);
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: t("questions.one"), status: "sent" },
    { id: 2, text: t("questions.two"), status: "pending" },
    { id: 3, text: t("questions.three"), status: "pending" },
  ]);
  const [notes, setNotes] = useState(
    () =>
      `${t("notes.heading")}\n\n• ${t("notes.one")}\n• ${t("notes.two")}\n• ${t("notes.three")}\n\n${t("notes.examples")}\n\n• ${t("notes.exampleOne")}\n• ${t("notes.exampleTwo")}`,
  );
  const [added, setAdded] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const progress = Math.round(
    (checks.filter(Boolean).length / checks.length) * 100,
  );
  const values = {
    subject: ["physics", "chemistry"],
    chapter: ["forces", "energy"],
    lesson: ["newton", "balanced"],
  } as const;

  function addQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = question.trim();
    if (!value) return;
    setQuestions((items) => [
      ...items,
      { id: Date.now(), text: value, status: "pending" },
    ]);
    setQuestion("");
  }
  function addToNotes(text: string) {
    if (!notes.includes(text)) setNotes((current) => `${current}\n\n• ${text}`);
    setAdded(true);
    notesRef.current?.focus();
  }

  return (
    <div
      className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 pb-8"
      data-testid="study-cave-page"
    >
      <header>
        <h1 className="font-heading text-page font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          {phase === "during" ? t("duringSubtitle") : t("beforeSubtitle")}
        </p>
      </header>
      <section
        className="grid gap-3 md:grid-cols-3"
        aria-label={t("selectorsLabel")}
      >
        {(["subject", "chapter", "lesson"] as const).map((key) => (
          <label
            className="grid gap-1.5 text-xs font-medium text-muted-foreground"
            key={key}
          >
            {t(key)}
            <Select defaultValue={values[key][0]}>
              <SelectTrigger className="h-10 w-full bg-card px-3 text-foreground">
                <span>{t(`values.${values[key][0]}`)}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {values[key].map((value) => (
                    <SelectItem value={value} key={value}>
                      {t(`values.${value}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>
        ))}
      </section>
      <nav
        className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-card p-2 shadow-surface sm:grid-cols-4"
        aria-label={t("phasesLabel")}
      >
        {phases.map((item) => {
          const Icon = icons[item];
          const active = phase === item;
          return (
            <button
              type="button"
              key={item}
              onClick={() => setPhase(item)}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex min-h-14 items-center gap-3 rounded-xl px-3 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full border",
                  active
                    ? "border-primary/20 bg-card text-primary"
                    : "border-border bg-muted",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span>
                <strong className="block text-sm">{t(`tabs.${item}`)}</strong>
                <small className="hidden text-xs opacity-75 lg:block">
                  {t(`tabDescriptions.${item}`)}
                </small>
              </span>
            </button>
          );
        })}
      </nav>
      {phase === "before" ? (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,.95fr)_minmax(20rem,1.05fr)]">
          <div className="grid content-start gap-4">
            <Card className="shadow-surface">
              <CardHeader>
                <Title icon={Target}>{t("goal.title")}</Title>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6">{t("goal.text")}</p>
                <div className="mt-4 flex gap-3 rounded-xl bg-success p-3">
                  <CheckCircle2 className="size-5 shrink-0 text-success-foreground" />
                  <div>
                    <strong className="text-sm text-success-foreground">
                      {t("goal.status")}
                    </strong>
                    <p className="mt-0.5 text-xs text-success-foreground">
                      {t("phasePanels.before.description")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-surface">
              <CardHeader>
                <Title icon={FileText} tone="text-info-foreground">
                  {t("material.title")}
                </Title>
                <p className="text-xs text-muted-foreground">
                  {t("phasePanels.before.description")}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="overflow-hidden rounded-xl border border-border">
                  {["one", "two", "three", "four"].map((key, index) => (
                    <li
                      key={key}
                      className="flex items-center gap-3 border-b border-border px-3 py-3 last:border-b-0"
                    >
                      <Checkbox
                        checked={checks[index]}
                        onCheckedChange={() =>
                          setChecks((current) =>
                            current.map((value, item) =>
                              item === index ? !value : value,
                            ),
                          )
                        }
                        aria-label={t(`material.${key}`)}
                      />
                      <span className="min-w-0 flex-1 text-sm">
                        {t(`material.${key}`)}
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground rtl:-scale-x-100" />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-surface">
              <CardHeader>
                <CardTitle className="text-sm">
                  {t("phasePanels.before.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-5">
                  <span className="grid size-16 place-items-center rounded-full border-8 border-success bg-card text-sm font-bold">
                    {progress}%
                  </span>
                  <div>
                    <strong className="text-sm">
                      {checks.filter(Boolean).length} / {checks.length}
                    </strong>
                    <p className="text-xs text-muted-foreground">
                      {t("goal.status")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid content-start gap-4">
            <Card className="border-assistant bg-assistant/35 shadow-surface">
              <CardHeader>
                <Title icon={Bot} tone="text-assistant-foreground">
                  {t("guided.title")}
                </Title>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl bg-card p-4 text-sm leading-6 shadow-surface">
                  <p className="text-xs text-muted-foreground">{t("title")}</p>
                  {t("guided.text")}
                </div>
                <div className="mt-4 grid gap-2">
                  {["one", "two", "three"].map((key) => (
                    <Button
                      key={key}
                      type="button"
                      variant="outline"
                      className="justify-start bg-card text-start"
                      onClick={() => setPhase("during")}
                    >
                      <FileText className="text-assistant-foreground" />
                      {t(`guided.${key}`)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <QuestionCard
              t={t}
              question={question}
              setQuestion={setQuestion}
              questions={questions}
              onSubmit={addQuestion}
            />
          </div>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,.9fr)]">
          <div className="grid content-start gap-4">
            <Card className="shadow-surface">
              <CardHeader>
                <Title icon={Pencil}>{t("notes.title")}</Title>
                <p className="text-xs text-muted-foreground">
                  {t("notes.description")}
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  ref={notesRef}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="min-h-70 bg-card text-sm leading-6"
                  aria-label={t("notes.editorLabel")}
                />
                <p className="mt-2 text-end text-xs text-muted-foreground">
                  {t("notes.saved")}
                </p>
              </CardContent>
            </Card>
            <QuestionCard
              t={t}
              question={question}
              setQuestion={setQuestion}
              questions={questions}
              onSubmit={addQuestion}
            />
          </div>
          <div className="grid content-start gap-4">
            <Card className="border-assistant bg-assistant/35 shadow-surface">
              <CardHeader>
                <Title icon={Bot} tone="text-assistant-foreground">
                  {t("noticed.title")}
                </Title>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 text-sm">
                  {["one", "two", "three"].map((key) => (
                    <li className="flex gap-2" key={key}>
                      <CheckCircle2 className="size-4 shrink-0 text-success-foreground" />
                      {t(`noticed.${key}`)}
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5 w-full bg-card text-secondary-foreground"
                  onClick={() => addToNotes(t("noticed.highlightText"))}
                >
                  <Sparkles />
                  {added ? t("noticed.highlighted") : t("noticed.highlight")}
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-surface">
              <CardHeader>
                <Title icon={FileText} tone="text-info-foreground">
                  {t("matching.title")}
                </Title>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl bg-secondary p-4 text-sm">
                  <ul className="list-disc space-y-1 ps-5">
                    <li>{t("matching.one")}</li>
                    <li>{t("matching.two")}</li>
                    <li>{t("matching.three")}</li>
                  </ul>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-2 text-secondary-foreground"
                  onClick={() => addToNotes(t("matching.text"))}
                >
                  <Plus />
                  {t("matching.add")}
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-surface">
              <CardHeader>
                <Title icon={Radio} tone="text-assistant-foreground">
                  {t("context.title")}
                </Title>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6">{t("context.text")}</p>
                <div className="mt-4 border-t pt-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <Lightbulb className="size-4 text-primary" />
                    {t("support.title")}
                  </div>
                  <ul className="mt-2 list-disc ps-5 text-sm">
                    <li>{t("support.one")}</li>
                    <li>{t("support.two")}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}

function QuestionCard({
  t,
  question,
  setQuestion,
  questions,
  onSubmit,
}: {
  t: ReturnType<typeof useTranslations>;
  question: string;
  setQuestion: (value: string) => void;
  questions: Question[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Card className="shadow-surface">
      <CardHeader>
        <Title icon={HelpCircle} tone="text-info-foreground">
          {t("questions.title")}
        </Title>
        <p className="text-xs text-muted-foreground">
          {t("questions.description")}
        </p>
      </CardHeader>
      <CardContent>
        <form className="flex gap-2" onSubmit={onSubmit}>
          <Input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={t("questions.placeholder")}
          />
          <Button
            type="submit"
            disabled={!question.trim()}
            className="shrink-0 bg-secondary-foreground hover:bg-secondary-foreground/90"
          >
            <Plus />
            {t("questions.add")}
          </Button>
        </form>
        <ul className="mt-3 overflow-hidden rounded-xl border border-border">
          {questions.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 border-b border-border px-3 py-3 text-sm last:border-b-0"
            >
              <span className="size-3 rounded-full border border-info-foreground" />
              <span className="min-w-0 flex-1">{item.text}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-medium",
                  item.status === "sent"
                    ? "bg-success text-success-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {t(`questions.${item.status}`)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
