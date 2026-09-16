"use client"

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Gamepad2,
  ShieldCheck,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const completionKeyPrefix = "rafiqi.first-login-onboarding:v1"
const profileStorageKey = "rafiqi.profile-onboarding:v1"

type Answer = { value: string; confidence: "confident" | "forming" }
type Answers = Record<"likes" | "dislikes" | "learning", Answer>

const emptyAnswers: Answers = {
  likes: { value: "", confidence: "forming" },
  dislikes: { value: "", confidence: "forming" },
  learning: { value: "", confidence: "forming" },
}


/** Preserved Board 34 form-step implementation for design rollback/reference. */
export function StudentOnboardingFormReference({
  locale,
  studentId,
  studentName,
}: {
  locale: "en" | "ar"
  studentId: string
  studentName: string
}) {
  const t = useTranslations("studentOnboarding")
  const router = useRouter()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [ready, setReady] = useState(false)
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState("")
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const firstName = studentName.trim().split(/\s+/)[0] || t("studentFallback")
  const completionKey = `${completionKeyPrefix}:${studentId}`
  const todayHref = `/${locale}/student/today`

  const questions = useMemo(
    () => [
      {
        id: "likes" as const,
        icon: Gamepad2,
        title: t("questions.likes.title"),
        description: t("questions.likes.description"),
        suggestions: [
          t("questions.likes.suggestions.one"),
          t("questions.likes.suggestions.two"),
          t("questions.likes.suggestions.three"),
        ],
      },
      {
        id: "dislikes" as const,
        icon: Brain,
        title: t("questions.dislikes.title"),
        description: t("questions.dislikes.description"),
        suggestions: [
          t("questions.dislikes.suggestions.one"),
          t("questions.dislikes.suggestions.two"),
          t("questions.dislikes.suggestions.three"),
        ],
      },
      {
        id: "learning" as const,
        icon: BookOpen,
        title: t("questions.learning.title"),
        description: t("questions.learning.description"),
        suggestions: [
          t("questions.learning.suggestions.one"),
          t("questions.learning.suggestions.two"),
          t("questions.learning.suggestions.three"),
        ],
      },
    ],
    [t],
  )

  useEffect(() => {
    try {
      if (window.localStorage.getItem(completionKey)) {
        router.replace(todayHref)
        return
      }
    } catch {
      // The flow remains usable when private browser storage is unavailable.
    }

    const frame = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(frame)
  }, [completionKey, router, todayHref])

  useEffect(() => {
    if (ready) headingRef.current?.focus()
  }, [ready, step])

  function finish(outcome: "completed" | "skipped") {
    try {
      window.localStorage.setItem(completionKey, outcome)
      if (outcome === "completed") {
        window.sessionStorage.setItem(
          profileStorageKey,
          JSON.stringify({
            version: 1,
            stage: 3,
            entries: Object.entries(answers).map(([id, answer]) => ({
              id,
              value: answer.value,
              confidence: answer.confidence,
            })),
          }),
        )
      }
    } catch {
      // Navigation should never be blocked by storage availability.
    }
    router.replace(todayHref)
  }

  function nextQuestion() {
    if (step === 0) {
      setStep(1)
      return
    }

    if (step >= 1 && step <= 3) {
      const question = questions[step - 1]
      const value = draft.trim()
      if (!value) return
      setAnswers((current) => ({
        ...current,
        [question.id]: {
          value,
          confidence: question.id === "dislikes" ? "forming" : "confident",
        },
      }))
      setDraft("")
      setStep(step + 1)
    }
  }

  function goBack() {
    if (step <= 1) {
      setStep(0)
      setDraft("")
      return
    }
    const previous = questions[step - 2]
    setStep(step - 1)
    setDraft(answers[previous.id].value)
  }

  if (!ready) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#fffdf9] px-6">
        <p className="text-sm font-medium text-muted-foreground" role="status">
          {t("loading")}
        </p>
      </main>
    )
  }

  const isWelcome = step === 0
  const isComplete = step === 4
  const activeQuestion = step >= 1 && step <= 3 ? questions[step - 1] : null

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#fffdf9] text-[#202236]">
      <header className="relative z-20 flex h-21 items-center justify-between border-b border-[#202236]/7 px-5 sm:px-10 lg:px-15">
        <Link href={todayHref} className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <span className="grid size-10 rotate-[-8deg] place-items-center rounded-[.85rem] bg-primary text-xl font-black text-white shadow-sm">R</span>
          <span className="font-heading text-2xl font-extrabold tracking-[-0.04em]">Rafiqi</span>
        </Link>
        <div className="flex items-center gap-5 sm:gap-8">
          <p className="hidden text-sm font-medium text-[#596074] sm:block">
            {isComplete ? t("progress.ready") : isWelcome ? t("progress.welcome") : t("progress.question", { current: step })}
          </p>
          <Link className="text-sm font-semibold text-[#596074] underline decoration-[#596074]/45 underline-offset-5 hover:text-foreground" href={`/${locale === "ar" ? "en" : "ar"}/onboarding`}>
            {locale === "ar" ? "EN" : "العربية"}
          </Link>
          {!isComplete ? (
            <button onClick={() => finish("skipped")} className="min-h-11 text-sm font-semibold text-[#596074] underline decoration-[#596074]/45 underline-offset-5 hover:text-foreground focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              {t("skip")}
            </button>
          ) : null}
        </div>
      </header>

      <div className="pointer-events-none absolute -end-24 top-36 size-130 rounded-[46%] bg-[#eee9ff] opacity-90 blur-[1px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-36 end-16 size-90 rounded-full bg-[#edf5e9] opacity-85" aria-hidden="true" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100dvh-5.25rem)] max-w-360 items-center gap-8 px-5 py-10 sm:px-10 lg:grid-cols-[minmax(0,.93fr)_minmax(32rem,1.07fr)] lg:px-15 lg:py-12">
        <div className="max-w-170">
          {isWelcome ? (
            <WelcomeContent firstName={firstName} headingRef={headingRef} onStart={nextQuestion} t={t} />
          ) : isComplete ? (
            <CompleteContent answers={answers} headingRef={headingRef} onFinish={() => finish("completed")} onReview={() => { setDraft(answers.likes.value); setStep(1) }} t={t} />
          ) : activeQuestion ? (
            <QuestionContent
              draft={draft}
              headingRef={headingRef}
              locale={locale}
              onBack={goBack}
              onChange={setDraft}
              onContinue={nextQuestion}
              question={activeQuestion}
              step={step}
              t={t}
            />
          ) : null}
        </div>

        <aside className="relative mx-auto flex w-full max-w-170 flex-col items-center self-stretch lg:justify-center" aria-label={t("preview.title")}>
          <div className="relative w-full overflow-hidden rounded-[2.25rem] bg-[#eee9ff]/72 px-5 pt-6 sm:px-9 sm:pt-9">
            <Image
              src="/images/rafiqi-onboarding-companion.png"
              alt={t("illustrationAlt")}
              width={1536}
              height={1024}
              priority
              className="mx-auto aspect-[3/2] w-full max-w-160 object-contain object-bottom"
            />
          </div>
          <JourneyPreview answers={answers} step={step} t={t} />
        </aside>
      </section>
    </main>
  )
}

type Translator = ReturnType<typeof useTranslations<"studentOnboarding">>

function WelcomeContent({ firstName, headingRef, onStart, t }: { firstName: string; headingRef: React.RefObject<HTMLHeadingElement | null>; onStart: () => void; t: Translator }) {
  return (
    <div>
      <p className="mb-6 text-xs font-bold uppercase tracking-[.34em] text-[#6d7184]">{t("eyebrow")}</p>
      <h1 ref={headingRef} tabIndex={-1} className="font-heading text-5xl font-extrabold leading-[.98] tracking-[-.055em] outline-none sm:text-6xl xl:text-7xl">
        {t("welcome", { name: firstName })}
      </h1>
      <h2 className="mt-8 font-heading text-2xl font-bold tracking-[-.025em] sm:text-3xl">{t("intro")}</h2>
      <p className="mt-5 max-w-145 text-lg leading-8 text-[#62697d]">{t("description")}</p>
      <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button size="lg" onClick={onStart} className="h-14 rounded-xl px-7 text-base font-bold shadow-[0_10px_28px_rgba(245,116,54,.22)]">
          {t("start")}
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
        </Button>
      </div>
      <div className="mt-10 flex max-w-155 items-start gap-3 rounded-2xl bg-[#edf5e9] px-5 py-4 text-sm font-medium leading-6 text-[#315f40]">
        <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <p>{t("trust")}</p>
      </div>
    </div>
  )
}

function QuestionContent({ draft, headingRef, locale, onBack, onChange, onContinue, question, step, t }: { draft: string; headingRef: React.RefObject<HTMLHeadingElement | null>; locale: "en" | "ar"; onBack: () => void; onChange: (value: string) => void; onContinue: () => void; question: { title: string; description: string; suggestions: string[] }; step: number; t: Translator }) {
  const BackIcon = locale === "ar" ? ArrowRight : ArrowLeft
  const ContinueIcon = locale === "ar" ? ArrowLeft : ArrowRight
  return (
    <div>
      <p className="mb-5 text-xs font-bold uppercase tracking-[.28em] text-primary">{t("progress.question", { current: step })}</p>
      <h1 ref={headingRef} tabIndex={-1} className="max-w-160 font-heading text-4xl font-extrabold leading-[1.08] tracking-[-.045em] outline-none sm:text-5xl">{question.title}</h1>
      <p className="mt-5 max-w-145 text-base leading-7 text-[#62697d]">{question.description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {question.suggestions.map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => onChange(suggestion)} aria-pressed={draft === suggestion} className={cn("min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary", draft === suggestion ? "border-primary bg-secondary text-secondary-foreground" : "border-[#dfe1e7] bg-white text-[#41475a] hover:border-primary/45 hover:bg-secondary/35")}>{suggestion}</button>
        ))}
      </div>
      <div className="mt-6">
        <label htmlFor="onboarding-answer" className="sr-only">{t("answerLabel")}</label>
        <Textarea id="onboarding-answer" value={draft} onChange={(event) => onChange(event.target.value.slice(0, 300))} placeholder={t("placeholder")} className="min-h-32 resize-none rounded-2xl border-[#dfe1e7] bg-white px-5 py-4 text-base shadow-none focus-visible:ring-primary/30" />
        <p className="mt-2 text-end text-xs text-muted-foreground">{draft.length} / 300</p>
      </div>
      <div className="mt-7 flex items-center justify-between gap-4">
        <Button type="button" variant="outline" size="lg" onClick={onBack} className="h-13 rounded-xl px-5">
          <BackIcon className="size-4" aria-hidden="true" />{t("back")}
        </Button>
        <Button type="button" size="lg" onClick={onContinue} disabled={!draft.trim()} className="h-13 rounded-xl px-7 font-bold">
          {t("continue")}<ContinueIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

function CompleteContent({ answers, headingRef, onFinish, onReview, t }: { answers: Answers; headingRef: React.RefObject<HTMLHeadingElement | null>; onFinish: () => void; onReview: () => void; t: Translator }) {
  return (
    <div>
      <p className="mb-5 text-xs font-bold uppercase tracking-[.3em] text-[#39734b]">{t("complete.eyebrow")}</p>
      <h1 ref={headingRef} tabIndex={-1} className="font-heading text-5xl font-extrabold leading-[1.02] tracking-[-.05em] outline-none sm:text-6xl">{t("complete.title")}</h1>
      <p className="mt-6 max-w-145 text-lg leading-8 text-[#62697d]">{t("complete.description")}</p>
      <div className="mt-8 divide-y divide-[#e4e5e9] border-y border-[#e4e5e9]">
        {(["likes", "dislikes", "learning"] as const).map((id) => (
          <div key={id} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
            <p className="text-sm font-bold text-[#555c70]">{t(`profile.${id}`)}</p>
            <p className="text-sm leading-6">{answers[id].value || t("profile.empty")}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={onFinish} className="h-14 rounded-xl px-7 text-base font-bold">{t("complete.action")}<ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" /></Button>
        <Button size="lg" variant="outline" onClick={onReview} className="h-14 rounded-xl px-7">{t("complete.review")}</Button>
      </div>
    </div>
  )
}

function JourneyPreview({ answers, step, t }: { answers: Answers; step: number; t: Translator }) {
  const items = [
    { id: "likes" as const, icon: Gamepad2, label: t("preview.likes") },
    { id: "dislikes" as const, icon: Brain, label: t("preview.dislikes") },
    { id: "learning" as const, icon: BookOpen, label: t("preview.learning") },
  ]
  return (
    <div className="mt-7 grid w-full grid-cols-3 gap-2 sm:gap-5">
      {items.map((item, index) => {
        const Icon = item.icon
        const answered = Boolean(answers[item.id].value)
        const active = step === index + 1
        return (
          <div key={item.id} className="text-center">
            <div className={cn("mx-auto grid size-12 place-items-center rounded-full border transition-colors", answered ? "border-[#bcd9c4] bg-[#edf5e9] text-[#39734b]" : active ? "border-primary bg-secondary text-primary" : "border-[#dedfe5] bg-white text-[#777d8e]")}>
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <p className="mt-3 text-xs font-bold leading-5 text-[#34394b] sm:text-sm">{item.label}</p>
          </div>
        )
      })}
    </div>
  )
}
