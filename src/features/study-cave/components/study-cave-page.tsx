"use client";

import { type FormEvent, useState } from "react";
import {
  CheckCircle2,
  FileText,
  ChevronRight,
  Target,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { ReviewData } from "../review-types";
import { usePathname, useRouter } from "@/i18n/navigation";
import { AfterClassReview } from "./after-class-review";
import { StudyCaveHomeworkPanel } from "./study-cave-homework-panel";
import { StudyCaveCardTitle } from "./study-cave-card-title";
import { StudyCavePhaseTabs } from "./study-cave-phase-tabs";
import { StudyCaveQuestionCard, type StudyCaveQuestion } from "./study-cave-question-card";
import { StudyCaveWarmupPanel } from "./study-cave-warmup-panel";
import {
  studyCavePhases,
  type StudyCavePhase,
} from "@/features/study-cave/types";

const phases = studyCavePhases;

export function StudyCavePage({
  initialPhase = "before",
  review,
}: {
  initialPhase?: StudyCavePhase;
  review: ReviewData;
}) {
  const t = useTranslations("studyCave");
  const r = useTranslations("reviewChat");
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<StudyCavePhase>(initialPhase);
  const [checks, setChecks] = useState([true, true, false, false]);
  const [question, setQuestion] = useState("");
  const [questionSuccess, setQuestionSuccess] = useState(false);
  const [questions, setQuestions] = useState<StudyCaveQuestion[]>([
    { id: 1, text: t("questions.one"), status: "sent", time: t("questions.timeOne") },
    { id: 2, text: t("questions.two"), status: "pending", time: t("questions.timeTwo") },
    { id: 3, text: t("questions.three"), status: "draft" },
    { id: 4, text: t("questions.failedExample"), status: "failed" },
  ]);
  const [notes, setNotes] = useState(
    () =>
      `${t("notes.heading")}\n\n• ${t("notes.one")}\n• ${t("notes.two")}\n• ${t("notes.three")}\n\n${t("notes.examples")}\n\n• ${t("notes.exampleOne")}\n• ${t("notes.exampleTwo")}`,
  );
  const progress = Math.round(
    (checks.filter(Boolean).length / checks.length) * 100,
  );
  const subtitles: Record<StudyCavePhase, string> = {
    before: t("beforeSubtitle"),
    after: t("afterSubtitle"),
    homework: t("homeworkSubtitle"),
  };

  function addQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = question.trim();
    if (!value) return;
    const id = Date.now();
    const shouldFail = questions.filter((item) => item.id > 4).length % 3 === 2;
    setQuestionSuccess(false);
    setQuestions((items) => [...items, { id, text: value, status: "sending" }]);
    setQuestion("");
    window.setTimeout(() => {
      setQuestions((items) => items.map((item) => item.id === id ? { ...item, status: shouldFail ? "failed" : "sent", time: shouldFail ? undefined : t("questions.now") } : item));
      setQuestionSuccess(!shouldFail);
    }, 700);
  }
  function updateQuestion(id: number, text: string) {
    const value = text.trim();
    if (value) setQuestions((items) => items.map((item) => item.id === id ? { ...item, text: value } : item));
  }
  function deleteQuestion(id: number) {
    setQuestions((items) => items.filter((item) => item.id !== id));
  }
  function retryQuestion(id: number) {
    setQuestionSuccess(false);
    setQuestions((items) => items.map((item) => item.id === id ? { ...item, status: "sending" } : item));
    window.setTimeout(() => {
      setQuestions((items) => items.map((item) => item.id === id ? { ...item, status: "sent", time: t("questions.now") } : item));
      setQuestionSuccess(true);
    }, 700);
  }

  return (
    <div
      className="mx-auto flex w-full max-w-300 flex-col gap-4 pb-8"
      data-testid="study-cave-page"
    >
      <header>
        <h1 className="font-heading text-page font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          {subtitles[phase]}
        </p>
      </header>
      <section
        className="grid gap-3 md:grid-cols-3"
        aria-label={t("selectorsLabel")}
      >
        {(["subject", "chapter", "lesson"] as const).map((key) => {
          const field = key === "lesson" ? "id" : key;
          const options = review.lessons.filter((item) => key === "subject" || item.subject === review.lesson?.subject).filter((item) => key !== "lesson" || item.chapter === review.lesson?.chapter);
          const unique = options.filter((item, index) => options.findIndex((other) => other[field] === item[field]) === index);
          return <label className="grid gap-1.5 text-xs font-medium text-muted-foreground" key={key}>{t(key)}
            <Select value={review.lesson?.[field] ?? null} disabled={!unique.length} onValueChange={(value) => {
              const lesson = unique.find((item) => item[field] === value);
              if (lesson) router.push(`${pathname}?phase=${phase}&lesson_id=${encodeURIComponent(lesson.id)}`);
            }}>
              <SelectTrigger aria-label={t(key)} className="h-10 w-full bg-card px-3 text-foreground"><span>{key === "lesson" ? review.lesson?.title ?? "—" : review.lesson?.[key] ?? "—"}</span></SelectTrigger>
              <SelectContent><SelectGroup>{unique.map((item) => <SelectItem value={item[field]} key={item[field]}>{key === "lesson" ? item.title : item[field]}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </label>;
        })}
      </section>
      {review.error && <div role="alert" className="rounded-xl border border-destructive/30 bg-card p-4 text-sm"><p>{r("loadError")}</p><Button variant="outline" className="mt-2" onClick={() => router.refresh()}>{r("reload")}</Button></div>}
      {!review.error && !review.lesson && <p className="rounded-xl bg-card p-4">{r("empty")}</p>}
      <StudyCavePhaseTabs phases={phases} activePhase={phase} lessonId={review.lesson?.id} onSelect={setPhase} t={t} />
      {phase === "before" ? (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,.95fr)_minmax(20rem,1.05fr)]">
          <div className="grid content-start gap-4">
            <Card className="shadow-surface">
              <CardHeader>
                <StudyCaveCardTitle icon={Target}>{t("goal.title")}</StudyCaveCardTitle>
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
                <StudyCaveCardTitle icon={FileText} tone="text-info-foreground">
                  {t("material.title")}
                </StudyCaveCardTitle>
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
            <StudyCaveWarmupPanel t={t} onContinue={() => setChecks((current) => current.map(() => true))} />
            <StudyCaveQuestionCard
              t={t}
              question={question}
              setQuestion={setQuestion}
              questions={questions}
              onSubmit={addQuestion}
              onUpdate={updateQuestion}
              onDelete={deleteQuestion}
              onRetry={retryQuestion}
              success={questionSuccess}
            />
          </div>
        </section>
      ) : phase === "after" ? (
        <AfterClassReview key={review.lesson?.id ?? "empty"} notes={notes} onNotesChange={setNotes} review={review} />
      ) : (
        <StudyCaveHomeworkPanel />
      )}
    </div>
  );
}

