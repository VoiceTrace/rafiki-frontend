"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, CircleAlert, LoaderCircle, LockKeyhole, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RafiqiConversation } from "@/components/shared/rafiqi-conversation";
import { StudyCaveCardTitle } from "./study-cave-card-title";

type WarmupState = "answering" | "checking" | "correct" | "retry" | "saved" | "locked";

export function StudyCaveWarmupPanel({ t, onContinue }: { t: (key: string, values?: Record<string, number>) => string; onContinue: () => void }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [state, setState] = useState<WarmupState>("answering");
  const total = 3;
  const options = ["car", "motorbike", "equal"] as const;
  const isCorrect = choice === 2;

  function submit() {
    if (choice === null) return;
    setState("checking");
    window.setTimeout(() => setState(isCorrect ? "correct" : "retry"), 650);
  }

  function save() {
    if (questionIndex + 1 === total) {
      setState("locked");
      return;
    }
    setState("saved");
  }

  function nextQuestion() {
    setQuestionIndex((index) => index + 1);
    setChoice(null);
    setState("answering");
  }

  return (
    <div className="grid content-start gap-4">
      <Card className="shadow-surface">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <StudyCaveCardTitle icon={CheckCircle2} tone="text-assistant-foreground">{t("warmup.quiz.title")}</StudyCaveCardTitle>
            <span className="shrink-0 text-xs font-semibold text-muted-foreground">{t("warmup.quiz.progress", { current: questionIndex + 1, total })}</span>
          </div>
          <p className="text-xs text-muted-foreground">{t("warmup.quiz.description")}</p>
        </CardHeader>
        <CardContent>
          <p className="rounded-xl bg-secondary/55 p-4 text-sm leading-6">{t(`warmup.quiz.questions.${questionIndex}`)}</p>
          <div className="mt-3 grid gap-2">
            {options.map((option, index) => (
              <button key={option} type="button" disabled={state === "checking" || state === "locked"} onClick={() => { setChoice(index); setState("answering"); }} className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2 text-start text-sm transition-colors ${choice === index ? "border-primary bg-secondary" : "border-border bg-card hover:bg-muted"} ${state === "correct" && index === 2 ? "border-success-foreground bg-success" : ""}`}>
                <span className={`size-4 shrink-0 rounded-full border ${choice === index ? "border-primary bg-primary ring-2 ring-primary/20" : "border-muted-foreground"}`} />
                {t(`warmup.options.${option}`)}
              </button>
            ))}
          </div>

          {state === "checking" ? <div className="mt-4 flex items-center gap-2 rounded-xl border border-assistant bg-assistant/35 p-3 text-sm"><LoaderCircle className="size-5 animate-spin text-assistant-foreground" />{t("warmup.quiz.checking")}</div> : null}
          {state === "correct" ? <div className="mt-4 rounded-xl border border-success-foreground/30 bg-success p-3 text-sm"><div className="flex gap-2 font-semibold text-success-foreground"><CheckCircle2 className="size-5 shrink-0" />{t("warmup.quiz.correctTitle")}</div><p className="mt-1 text-success-foreground">{t("warmup.quiz.correctBody")}</p></div> : null}
          {state === "retry" ? <div className="mt-4 rounded-xl border border-secondary-foreground/20 bg-secondary p-3 text-sm"><div className="flex gap-2 font-semibold"><CircleAlert className="size-5 shrink-0 text-primary" />{t("warmup.quiz.retryTitle")}</div><p className="mt-1">{t("warmup.quiz.retryBody")}</p><Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => { setChoice(null); setState("answering"); }}><RotateCcw />{t("warmup.quiz.tryAgain")}</Button></div> : null}
          {state === "saved" ? <div className="mt-4 flex gap-2 rounded-xl border border-success-foreground/30 bg-success p-3 text-sm text-success-foreground"><Save className="size-5 shrink-0" />{t("warmup.quiz.saved")}</div> : null}
          {state === "locked" ? <div className="mt-4 flex gap-2 rounded-xl border border-muted bg-muted p-3 text-sm"><LockKeyhole className="size-5 shrink-0 text-muted-foreground" />{t("warmup.quiz.locked")}</div> : null}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {state === "answering" ? <Button type="button" className="sm:ms-auto" disabled={choice === null} onClick={submit}>{t("warmup.quiz.check")}</Button> : null}
            {state === "correct" ? <Button type="button" className="sm:ms-auto" onClick={save}><Save />{t("warmup.quiz.save")}</Button> : null}
            {state === "saved" ? <Button type="button" className="sm:ms-auto" onClick={nextQuestion}>{t("warmup.quiz.next")}<ChevronRight className="rtl:-scale-x-100" /></Button> : null}
            {state === "locked" ? <Button type="button" className="sm:ms-auto" onClick={onContinue}>{t("warmup.quiz.continue")}<ChevronRight className="rtl:-scale-x-100" /></Button> : null}
          </div>
        </CardContent>
      </Card>
      <RafiqiConversation title={t("warmup.title")} context={t("warmup.context")} messages={[{ author: "rafiqi", text: t("warmup.wake") }, { author: "rafiqi", text: t("warmup.question") }]} suggestions={[]} placeholder={t("warmup.placeholder")} sendLabel={t("warmup.send")} response={t("warmup.response")} time={t("warmup.time")} />
    </div>
  );
}
