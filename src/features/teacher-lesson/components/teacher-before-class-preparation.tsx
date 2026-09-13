"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Bot, CheckCircle2, CircleAlert, FileText, GripVertical, ListChecks, MessageCircleQuestion, Pencil, Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PreparationInsightCard, type InsightState } from "./preparation-insight-card";
import { DraftLabel, PreparationStatus } from "./preparation-status";

type GenerationState = "idle" | "generating" | "review" | "failed";
type Item = { id: number; text: string; enabled?: boolean };

function move<T>(items: T[], index: number, direction: -1 | 1) {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= next.length) return items;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function TeacherBeforeClassPreparation() {
  const t = useTranslations("teacherLesson.preparation");
  const initialQuestions = useMemo<Item[]>(() => [
    { id: 1, text: t("questionOne"), enabled: true }, { id: 2, text: t("questionTwo"), enabled: true }, { id: 3, text: t("questionThree"), enabled: false },
  ], [t]);
  const initialFlow = useMemo<Item[]>(() => [
    { id: 1, text: t("flowOne") }, { id: 2, text: t("flowTwo") }, { id: 3, text: t("flowThree") }, { id: 4, text: t("flowFour") }, { id: 5, text: t("flowFive") },
  ], [t]);
  const initialChecks = useMemo<Item[]>(() => [
    { id: 1, text: t("checkOne") }, { id: 2, text: t("checkTwo") },
  ], [t]);
  const [generation, setGeneration] = useState<GenerationState>("idle");
  const [editing, setEditing] = useState(false);
  const [objective, setObjective] = useState(t("objectiveText"));
  const [questions, setQuestions] = useState(initialQuestions);
  const [flow, setFlow] = useState(initialFlow);
  const [checks, setChecks] = useState(initialChecks);
  const [insight, setInsight] = useState<InsightState>("populated");
  const [saveState, setSaveState] = useState<"idle" | "success" | "failed">("idle");
  const [discardOpen, setDiscardOpen] = useState(false);
  const dirty = editing && (objective !== t("objectiveText") || questions !== initialQuestions || flow !== initialFlow || checks !== initialChecks);

  useEffect(() => {
    if (generation !== "generating") return;
    const timer = window.setTimeout(() => setGeneration("review"), 900);
    return () => window.clearTimeout(timer);
  }, [generation]);

  useEffect(() => {
    if (insight !== "processing") return;
    const timer = window.setTimeout(() => setInsight("populated"), 800);
    return () => window.clearTimeout(timer);
  }, [insight]);

  const hasValidationError = useMemo(() => editing && objective.trim().length < 10, [editing, objective]);
  const updateItem = (setter: React.Dispatch<React.SetStateAction<Item[]>>, id: number, text: string) => setter((items) => items.map((item) => item.id === id ? { ...item, text } : item));
  const discard = () => {
    setObjective(t("objectiveText")); setQuestions(initialQuestions); setFlow(initialFlow); setChecks(initialChecks); setEditing(false); setSaveState("idle"); setDiscardOpen(false);
  };
  const save = () => {
    if (hasValidationError) { setSaveState("failed"); return; }
    setSaveState("success"); setEditing(false);
  };

  return <section className="grid gap-4" data-testid="teacher-before-class-preparation">
    {generation === "generating" ? <PreparationStatus tone="assistant" icon={RefreshCw} title={t("generatingTitle")} text={t("generatingText")} spinning /> : null}
    {generation === "review" ? <PreparationStatus tone="assistant" icon={Bot} title={t("reviewTitle")} text={t("reviewText")} actions={<><Button size="sm" onClick={() => setGeneration("idle")}><CheckCircle2 />{t("keepDraft")}</Button><Button size="sm" variant="outline" onClick={() => setGeneration("generating")}><RefreshCw />{t("regenerate")}</Button></>} /> : null}
    {generation === "failed" ? <PreparationStatus tone="error" icon={CircleAlert} title={t("generationFailedTitle")} text={t("generationFailedText")} actions={<Button size="sm" onClick={() => setGeneration("generating")}><RefreshCw />{t("retry")}</Button>} /> : null}
    {dirty ? <PreparationStatus tone="warning" icon={CircleAlert} title={t("unsavedTitle")} text={t("unsavedText")} actions={<><Button size="sm" variant="outline" onClick={() => setDiscardOpen(true)}>{t("cancel")}</Button><Button size="sm" onClick={save}>{t("saveChanges")}</Button></>} /> : null}
    {saveState === "success" ? <PreparationStatus tone="success" icon={CheckCircle2} title={t("savedTitle")} text={t("savedText")} /> : null}
    {saveState === "failed" ? <PreparationStatus tone="error" icon={CircleAlert} title={t("validationTitle")} text={t("validationText")} actions={<Button size="sm" onClick={save}>{t("retry")}</Button>} /> : null}

    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="shadow-surface"><CardHeader className="flex-row items-center"><CardTitle className="flex gap-2"><Sparkles className="size-5 text-primary" />{t("objectiveTitle")}{generation === "review" ? <DraftLabel /> : null}</CardTitle><Button className="ms-auto" size="xs" variant="ghost" onClick={() => setEditing(true)}><Pencil />{t("edit")}</Button></CardHeader><CardContent>{editing ? <><Textarea value={objective} onChange={(event) => setObjective(event.target.value)} aria-invalid={hasValidationError} className="min-h-24" />{hasValidationError ? <p className="mt-2 text-xs text-destructive">{t("objectiveError")}</p> : null}</> : <p className="text-sm leading-6">{objective}</p>}<Button className="mt-4" onClick={() => setGeneration("generating")}><Sparkles />{t("generate")}</Button></CardContent></Card>
      <Card className="shadow-surface"><CardHeader className="flex-row items-center"><CardTitle className="flex gap-2"><MessageCircleQuestion className="size-5 text-assistant-foreground" />{t("warmupTitle")}{generation === "review" ? <DraftLabel /> : null}</CardTitle><Button className="ms-auto" size="xs" variant="outline" onClick={() => { setEditing(true); setQuestions((items) => [...items, { id: Date.now(), text: "", enabled: true }]); }}><Plus />{t("add")}</Button></CardHeader><CardContent className="grid gap-2">{questions.map((item) => <div className="rounded-lg border border-border p-3" key={item.id}><div className="flex items-start gap-2"><Button size="icon-xs" variant={item.enabled ? "default" : "outline"} aria-label={t("toggle")} onClick={() => { setEditing(true); setQuestions((items) => items.map((question) => question.id === item.id ? { ...question, enabled: !question.enabled } : question)); }}><CheckCircle2 /></Button>{editing ? <Input value={item.text} onChange={(event) => updateItem(setQuestions, item.id, event.target.value)} /> : <p className="flex-1 text-sm">{item.text}</p>}<Button size="icon-xs" variant="ghost" aria-label={t("remove")} onClick={() => { setEditing(true); setQuestions((items) => items.filter((question) => question.id !== item.id)); }}><Trash2 /></Button></div></div>)}</CardContent></Card>
      <PreparationInsightCard state={insight} onRefresh={() => setInsight("processing")} />
      <Card className="shadow-surface"><CardHeader><CardTitle className="flex gap-2"><FileText className="size-5 text-primary" />{t("materialsTitle")}</CardTitle></CardHeader><CardContent className="grid gap-2 text-sm">{["materialsOne", "materialsTwo", "materialsThree"].map((key) => <p className="flex gap-2" key={key}><FileText className="size-4 text-info-foreground" />{t(key)}</p>)}</CardContent></Card>
      <Card className="shadow-surface"><CardHeader className="flex-row items-center"><CardTitle className="flex gap-2"><ListChecks className="size-5 text-primary" />{t("flowTitle")}{generation === "review" ? <DraftLabel /> : null}</CardTitle><Button className="ms-auto" size="xs" variant="outline" onClick={() => { setEditing(true); setFlow((items) => [...items, { id: Date.now(), text: "" }]); }}><Plus />{t("add")}</Button></CardHeader><CardContent className="grid gap-2">{flow.map((item, index) => <div className="flex items-center gap-1 rounded-lg border border-border p-2" key={item.id}><GripVertical className="size-4 text-muted-foreground" />{editing ? <Input value={item.text} onChange={(event) => updateItem(setFlow, item.id, event.target.value)} /> : <p className="flex-1 text-sm">{index + 1}. {item.text}</p>}<Button size="icon-xs" variant="ghost" onClick={() => { setEditing(true); setFlow((items) => move(items, index, -1)); }}><ArrowUp /></Button><Button size="icon-xs" variant="ghost" onClick={() => { setEditing(true); setFlow((items) => move(items, index, 1)); }}><ArrowDown /></Button><Button size="icon-xs" variant="ghost" aria-label={t("remove")} onClick={() => { setEditing(true); setFlow((items) => items.filter((segment) => segment.id !== item.id)); }}><Trash2 /></Button></div>)}</CardContent></Card>
      <Card className="shadow-surface"><CardHeader className="flex-row items-center"><CardTitle className="flex gap-2"><CheckCircle2 className="size-5 text-success-foreground" />{t("checksTitle")}{generation === "review" ? <DraftLabel /> : null}</CardTitle><Button className="ms-auto" size="xs" variant="outline" onClick={() => { setEditing(true); setChecks((items) => [...items, { id: Date.now(), text: "" }]); }}><Plus />{t("add")}</Button></CardHeader><CardContent className="grid gap-2">{checks.map((item) => <div className="flex gap-2" key={item.id}>{editing ? <Input value={item.text} onChange={(event) => updateItem(setChecks, item.id, event.target.value)} /> : <p className="flex-1 rounded-lg bg-secondary/40 p-3 text-sm">{item.text}</p>}<Button size="icon-xs" variant="ghost" aria-label={t("remove")} onClick={() => { setEditing(true); setChecks((items) => items.filter((check) => check.id !== item.id)); }}><Trash2 /></Button></div>)}</CardContent></Card>
    </div>
    <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => dirty ? setDiscardOpen(true) : setEditing(true)}>{editing ? t("cancel") : t("editPreparation")}</Button><Button onClick={editing ? save : () => setGeneration("generating")}>{editing ? t("saveChanges") : t("generate")}</Button></div>
    <Dialog open={discardOpen} onOpenChange={setDiscardOpen}><DialogContent showCloseButton={false}><DialogHeader><DialogTitle>{t("discardTitle")}</DialogTitle><DialogDescription>{t("discardText")}</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setDiscardOpen(false)}>{t("keepEditing")}</Button><Button variant="destructive" onClick={discard}>{t("discard")}</Button></DialogFooter></DialogContent></Dialog>
  </section>;
}
