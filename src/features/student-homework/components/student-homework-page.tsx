"use client";
import { useState } from "react";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  MoreHorizontal,
  Send,
  StepForward,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LessonStageTabs } from "@/components/shared/lesson-stage-tabs";
export function StudentHomeworkPage() {
  const t = useTranslations("studentHomework");
  const [hint, setHint] = useState(0);
  const [stage, setStage] = useState("question");
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [chat, setChat] = useState("");
  const hints = [t("hints.one"), t("hints.two"), t("hints.three")];
  return (
    <div
      className="mx-auto flex w-full max-w-[1080px] flex-col gap-4 pb-20"
      data-testid="student-homework-page"
    >
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label={t("back")}>
          <ArrowLeft className="rtl:-scale-x-100" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-primary">
            <StepForward className="size-4" />
            <span className="text-xs font-semibold">{t("eyebrow")}</span>
          </div>
          <h1 className="font-heading text-section font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button variant="ghost" size="icon" aria-label={t("more")}>
          <MoreHorizontal />
        </Button>
      </header>
      <LessonStageTabs
        active={stage}
        ariaLabel={t("stagesLabel")}
        onChange={setStage}
        items={(["question", "hints", "review"] as const).map((value) => ({
          value,
          label: t(`stages.${value}`),
        }))}
      />
      <div
        className={
          stage === "question"
            ? "grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]"
            : "hidden"
        }
      >
        <Card className="shadow-surface">
          <CardHeader>
            <CardTitle>{t("problemTitle")}</CardTitle>
            <CardDescription>{t("problemIntro")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="rounded-xl border border-secondary bg-secondary/45 p-4 text-base leading-7 font-medium">
              {t("problem")}
            </p>
            <div className="mt-4 grid gap-2">
              {hints.slice(0, hint).map((item, index) => (
                <div
                  className="rounded-lg border border-assistant bg-assistant/35 p-3 text-sm"
                  key={item}
                >
                  <strong>{t("hintLabel", { number: index + 1 })}</strong>
                  <p className="mt-1 text-muted-foreground">{item}</p>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                disabled={hint === hints.length}
                onClick={() => setHint((v) => Math.min(v + 1, hints.length))}
              >
                <Lightbulb className="text-assistant-foreground" />
                {hint === hints.length ? t("allHints") : t("nextHint")}
              </Button>
            </div>
            <label className="mt-5 block text-sm font-semibold">
              {t("answerLabel")}
            </label>
            <Textarea
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setChecked(false);
              }}
              className="mt-2 min-h-32 bg-card"
              placeholder={t("answerPlaceholder")}
            />
            {checked && (
              <div className="mt-4 flex gap-3 rounded-xl border border-success bg-success p-4">
                <CheckCircle2 className="size-6 shrink-0 text-success-foreground" />
                <div>
                  <strong>{t("correct.title")}</strong>
                  <p className="mt-1 text-sm text-success-foreground">
                    {t("correct.text")}
                  </p>
                </div>
              </div>
            )}
            <Button
              size="lg"
              className="mt-5 w-full"
              disabled={!answer.trim()}
              onClick={() => setChecked(true)}
            >
              {t("check")}
              <ChevronRight className="rtl:-scale-x-100" />
            </Button>
          </CardContent>
        </Card>
        <aside className="grid content-start gap-4">
          <Card className="border-assistant bg-assistant/45">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="size-5 text-assistant-foreground" />
                {t("rafiqi.title")}
              </CardTitle>
              <CardDescription>{t("rafiqi.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="rounded-xl bg-card p-3 text-sm">
                {t("rafiqi.opening")}
              </p>
              <div className="mt-3 flex gap-2">
                <Input
                  value={chat}
                  onChange={(e) => setChat(e.target.value)}
                  placeholder={t("rafiqi.placeholder")}
                />
                <Button
                  type="button"
                  size="icon"
                  disabled={!chat.trim()}
                  onClick={() => setChat("")}
                >
                  <Send />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("progress.title")}</CardTitle>
              <CardDescription>{t("progress.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <span className="block h-full w-3/5 rounded-full bg-primary" />
              </div>
              <p className="mt-3 text-sm font-medium">{t("progress.value")}</p>
            </CardContent>
          </Card>
        </aside>
      </div>
      {stage === "hints" ? (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Card className="shadow-surface">
            <CardHeader>
              <CardTitle>{t("hints.title")}</CardTitle>
              <CardDescription>{t("hints.description")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {hints.map((item, index) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setHint(index + 1)}
                  className={`rounded-xl border p-4 text-start ${hint > index ? "border-assistant bg-assistant/40" : "border-border bg-card"}`}
                >
                  <strong>{t("hintLabel", { number: index + 1 })}</strong>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {hint > index ? item : t("hints.locked")}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>
          <Card className="border-assistant bg-assistant/45">
            <CardHeader>
              <CardTitle>{t("rafiqi.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{t("rafiqi.opening")}</p>
            </CardContent>
          </Card>
        </section>
      ) : stage === "review" ? (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Card className="shadow-surface">
            <CardHeader>
              <CardTitle>{t("review.title")}</CardTitle>
              <CardDescription>{t("review.description")}</CardDescription>
            </CardHeader>
            <CardContent className="rounded-xl bg-success/70 text-sm leading-6">
              <CheckCircle2 className="mb-2 size-6 text-success-foreground" />
              <p>{t("review.answer")}</p>
            </CardContent>
          </Card>
          <Card className="shadow-surface">
            <CardHeader>
              <CardTitle>{t("progress.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{t("review.next")}</p>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
