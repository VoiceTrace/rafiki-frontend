"use client"

import { useState, useTransition } from "react"
import {
  Bot,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Loader2,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type {
  AttemptResult,
  MasteryRecord,
  Question,
  StudySession,
  SummaryCard,
} from "@/types/study-session"
import {
  advanceConcept,
  advanceStage,
  closeStudySession,
  getNextQuestion,
  getMyMastery,
  planStudySession,
  submitAttempt,
} from "@/lib/api"

type Phase =
  | "setup"
  | "review"
  | "check_in"
  | "deepen"
  | "wrap_up"
  | "closed"  // derived from status=closed

const STAGE_LABELS: Record<Phase, string> = {
  setup: "Setting up...",
  review: "Review",
  check_in: "Check-In",
  deepen: "Deepen",
  wrap_up: "Wrap Up",
  closed: "Session Complete",
}

function MasteryBadge({ level }: { level: number }) {
  const pct = Math.round(level * 100)
  const color =
    level >= 0.75 ? "bg-success text-success-foreground" :
    level >= 0.4  ? "bg-primary/20 text-primary" :
                    "bg-destructive/20 text-destructive"
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>
      {pct}%
    </span>
  )
}

export function StudySessionShell({
  accessToken,
  lessonId,
  lessonContent,
  initialSession,
}: {
  accessToken: string
  lessonId: string
  lessonContent: Record<string, unknown>
  initialSession: StudySession
}) {
  const [session, setSession] = useState<StudySession>(initialSession)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [lastResult, setLastResult] = useState<AttemptResult | null>(null)
  const [response, setResponse] = useState("")
  const [masteryRecords, setMasteryRecords] = useState<MasteryRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const concepts = session.concepts_order ?? []
  const currentConcept = concepts[session.current_concept_index] ?? null

  function handleError(e: unknown) {
    setError(e instanceof Error ? e.message : "Something went wrong")
  }

  function handlePlan() {
    startTransition(async () => {
      try {
        const updated = await planStudySession(accessToken, session.id, lessonContent)
        setSession(updated)
        setError(null)
      } catch (e) { handleError(e) }
    })
  }

  function handleAdvanceStage(toStage: string) {
    startTransition(async () => {
      try {
        const updated = await advanceStage(accessToken, session.id, toStage)
        setSession(updated)
        setCurrentQuestion(null)
        setLastResult(null)
        setError(null)
      } catch (e) { handleError(e) }
    })
  }

  function handleGetQuestion() {
    startTransition(async () => {
      try {
        const q = await getNextQuestion(accessToken, session.id)
        setCurrentQuestion(q)
        setLastResult(null)
        setResponse("")
        setError(null)
      } catch (e) { handleError(e) }
    })
  }

  function handleSubmit() {
    if (!currentQuestion || !response.trim()) return
    startTransition(async () => {
      try {
        const result = await submitAttempt(
          accessToken,
          session.id,
          currentQuestion.id,
          response,
        )
        setLastResult(result)
        setError(null)
      } catch (e) { handleError(e) }
    })
  }

  function handleNextConcept() {
    startTransition(async () => {
      try {
        const updated = await advanceConcept(accessToken, session.id)
        setSession(updated)
        setCurrentQuestion(null)
        setLastResult(null)
        setResponse("")
        setError(null)
      } catch (e) {
        // No more concepts — advance to wrap_up
        handleAdvanceStage("wrap_up")
      }
    })
  }

  function handleClose() {
    startTransition(async () => {
      try {
        const updated = await closeStudySession(accessToken, session.id)
        setSession(updated)
        const records = await getMyMastery(accessToken, lessonId)
        setMasteryRecords(records)
        setError(null)
      } catch (e) { handleError(e) }
    })
  }

  const stage: Phase =
    session.status === "closed" ? "closed" : (session.current_stage as Phase)

  return (
    <div className="grid gap-4">
      {/* Stage indicator */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {(["review", "check_in", "deepen", "wrap_up"] as Phase[]).map((s, i, arr) => {
          const stageOrder = ["review", "check_in", "deepen", "wrap_up"]
          const active = s === stage
          const done = stageOrder.indexOf(s) < stageOrder.indexOf(stage)
          return (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <span className={[
                "flex size-7 items-center justify-center rounded-full text-xs font-bold",
                active ? "bg-primary text-primary-foreground" :
                done   ? "bg-success text-success-foreground" :
                         "bg-muted text-muted-foreground",
              ].join(" ")}>
                {done ? <CheckCircle2 className="size-4" /> : i + 1}
              </span>
              <span className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
                {STAGE_LABELS[s]}
              </span>
              {i < arr.length - 1 && <ChevronRight className="size-4 text-muted-foreground rtl:-scale-x-100" />}
            </div>
          )
        })}
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* SETUP phase */}
      {stage === "setup" && (
        <Card className="shadow-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="size-5 text-assistant-foreground" />
              Ready to study?
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              Rafiqi will analyse this lesson and build a personalised study plan for you.
            </p>
            <Button onClick={handlePlan} disabled={isPending}>
              {isPending ? <Loader2 className="me-2 size-4 animate-spin" /> : <Brain className="me-2 size-4" />}
              {isPending ? "Planning..." : "Start session with Rafiqi"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* REVIEW phase */}
      {stage === "review" && (
        <Card className="shadow-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-info-foreground" />
              Review your concepts
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              You'll be working through <strong>{concepts.length} concept{concepts.length !== 1 ? "s" : ""}</strong> today:
            </p>
            <ol className="grid gap-2">
              {concepts.map((c, i) => (
                <li key={c} className="flex items-center gap-2 text-sm">
                  <span className="grid size-6 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  {c}
                </li>
              ))}
            </ol>
            <Button onClick={() => handleAdvanceStage("check_in")} disabled={isPending}>
              {isPending ? <Loader2 className="me-2 size-4 animate-spin" /> : null}
              Begin Check-In →
            </Button>
          </CardContent>
        </Card>
      )}

      {/* CHECK-IN / DEEPEN phases */}
      {(stage === "check_in" || stage === "deepen") && (
        <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <div className="grid content-start gap-4">
            {/* Concept progress */}
            {currentConcept && (
              <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
                <span className="font-semibold text-muted-foreground">
                  Concept {session.current_concept_index + 1} / {concepts.length}:
                </span>{" "}
                {currentConcept}
              </div>
            )}

            {/* Question card */}
            {!currentQuestion ? (
              <Card className="shadow-surface">
                <CardContent className="pt-6">
                  <Button onClick={handleGetQuestion} disabled={isPending} className="w-full">
                    {isPending
                      ? <><Loader2 className="me-2 size-4 animate-spin" />Generating question...</>
                      : <><Bot className="me-2 size-4" />Get next question</>
                    }
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Bot className="size-5 text-assistant-foreground" />
                    Rafiqi asks:
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <p className="rounded-xl bg-assistant/20 p-4 text-sm leading-6">
                    {currentQuestion.question_text}
                  </p>

                  {!lastResult ? (
                    <>
                      <Textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Type your answer here..."
                        className="min-h-28 bg-card"
                        aria-label="Your answer"
                        disabled={isPending}
                      />
                      <Button
                        onClick={handleSubmit}
                        disabled={isPending || !response.trim()}
                      >
                        {isPending
                          ? <><Loader2 className="me-2 size-4 animate-spin" />Scoring...</>
                          : "Submit answer"
                        }
                      </Button>
                    </>
                  ) : (
                    <AttemptResultPanel
                      result={lastResult}
                      onNextQuestion={handleGetQuestion}
                      onNextConcept={handleNextConcept}
                      onRetry={() => { setLastResult(null); setResponse("") }}
                      hasMoreConcepts={session.current_concept_index + 1 < concepts.length}
                      isPending={isPending}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Stage advance sidebar */}
          <div className="grid content-start gap-4">
            {stage === "check_in" && (
              <Card className="shadow-surface">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    When you've covered all concepts in Check-In, move to Deepen.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleAdvanceStage("deepen")}
                    disabled={isPending}
                  >
                    Advance to Deepen →
                  </Button>
                </CardContent>
              </Card>
            )}
            <Card className="shadow-surface">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Done with all concepts? Wrap up the session.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAdvanceStage("wrap_up")}
                  disabled={isPending}
                >
                  Wrap Up →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* WRAP_UP phase */}
      {stage === "wrap_up" && (
        <Card className="shadow-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-primary" />
              Wrap Up
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              You've worked through {concepts.length} concept{concepts.length !== 1 ? "s" : ""}.
              Rafiqi will now compute your mastery and generate your summary card.
            </p>
            <Button onClick={handleClose} disabled={isPending}>
              {isPending
                ? <><Loader2 className="me-2 size-4 animate-spin" />Generating summary...</>
                : "Close session & see results"
              }
            </Button>
          </CardContent>
        </Card>
      )}

      {/* CLOSED — summary card */}
      {stage === "closed" && session.summary_card && (
        <SessionSummaryPanel summary={session.summary_card} mastery={masteryRecords} />
      )}
    </div>
  )
}

function AttemptResultPanel({
  result,
  onNextQuestion,
  onNextConcept,
  onRetry,
  hasMoreConcepts,
  isPending,
}: {
  result: AttemptResult
  onNextQuestion: () => void
  onNextConcept: () => void
  onRetry: () => void
  hasMoreConcepts: boolean
  isPending: boolean
}) {
  const correct = result.attempt.correctness_score >= 0.8
  return (
    <div className="grid gap-3">
      <div className={[
        "rounded-xl p-4 text-sm leading-6",
        correct ? "bg-success/20 text-success-foreground" : "bg-muted",
      ].join(" ")}>
        <div className="flex items-center gap-2 font-semibold mb-1">
          {correct
            ? <CheckCircle2 className="size-4 text-success-foreground" />
            : <Lightbulb className="size-4 text-primary" />
          }
          {correct ? "Correct!" : `Score: ${Math.round(result.attempt.correctness_score * 100)}%`}
        </div>
        {result.feedback}
      </div>

      {result.hint_text && (
        <div className="rounded-xl border border-assistant bg-assistant/10 p-4 text-sm leading-6">
          <div className="flex items-center gap-2 font-semibold mb-1 text-assistant-foreground">
            <Lightbulb className="size-4" />
            Hint (level {result.hint_level + 1}):
          </div>
          {result.hint_text}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {!correct && !result.max_attempts_reached && (
          <Button variant="outline" onClick={onRetry} disabled={isPending}>
            Try again
          </Button>
        )}
        {result.concept_confirmed || result.max_attempts_reached ? (
          <>
            <Button onClick={onNextQuestion} disabled={isPending}>
              {isPending ? <Loader2 className="me-2 size-4 animate-spin" /> : null}
              Next question
            </Button>
            {hasMoreConcepts && (
              <Button variant="outline" onClick={onNextConcept} disabled={isPending}>
                Next concept →
              </Button>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}

function SessionSummaryPanel({
  summary,
  mastery,
}: {
  summary: SummaryCard
  mastery: MasteryRecord[]
}) {
  return (
    <div className="grid gap-4">
      <Card className="border-success shadow-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-success-foreground" />
            Session Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm leading-6">{summary.summary_text}</p>
          <p className="text-sm italic text-muted-foreground">{summary.encouragement}</p>

          {summary.strong_concepts.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-success-foreground mb-2">Strong on:</p>
              <div className="flex flex-wrap gap-2">
                {summary.strong_concepts.map((c) => (
                  <span key={c} className="rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-success-foreground">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {summary.gap_concepts.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-destructive mb-2">Needs more work:</p>
              <div className="flex flex-wrap gap-2">
                {summary.gap_concepts.map((c) => (
                  <span key={c} className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {mastery.length > 0 && (
        <Card className="shadow-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="size-5 text-primary" />
              Mastery Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 font-medium">Concept</th>
                  <th className="py-2 font-medium">Attempts</th>
                  <th className="py-2 font-medium">Mastery</th>
                  <th className="py-2 font-medium">Level</th>
                </tr>
              </thead>
              <tbody>
                {mastery.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">{r.concept_ref}</td>
                    <td className="py-2 text-muted-foreground">{r.attempt_count}</td>
                    <td className="py-2"><MasteryBadge level={r.mastery_level} /></td>
                    <td className="py-2 capitalize text-muted-foreground">{r.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
