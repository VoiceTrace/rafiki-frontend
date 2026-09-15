"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { CheckCircle2, Clock3, HelpCircle, LoaderCircle, LockKeyhole, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StudyCaveCardTitle } from "./study-cave-card-title";

export type StudyCaveQuestion = { id: number; text: string; status: "sent" | "pending" | "draft" | "sending" | "failed"; time?: string };

type Props = {
  t: (key: string) => string;
  question: string;
  setQuestion: (value: string) => void;
  questions: StudyCaveQuestion[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdate: (id: number, text: string) => void;
  onDelete: (id: number) => void;
  onRetry: (id: number) => void;
  success: boolean;
};

export function StudyCaveQuestionCard({ t, question, setQuestion, questions, onSubmit, onUpdate, onDelete, onRetry, success }: Props) {
  const [locked, setLocked] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  return <Card className="shadow-surface"><CardHeader><div className="flex items-start gap-2"><StudyCaveCardTitle icon={HelpCircle} tone="text-info-foreground">{t("questions.title")}</StudyCaveCardTitle><span className="ms-auto rounded-full bg-secondary px-2 py-1 text-[0.65rem] font-medium text-secondary-foreground">{t("questions.demo")}</span></div><p className="text-xs text-muted-foreground">{locked ? t("questions.lockedDescription") : t("questions.description")}</p></CardHeader><CardContent>
    {locked ? <div className="flex gap-2 rounded-xl border border-primary/20 bg-secondary p-3 text-sm"><LockKeyhole className="size-5 shrink-0 text-primary" />{t("questions.locked")}</div> : <form className="flex flex-col gap-2 sm:flex-row" onSubmit={onSubmit}><Input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t("questions.placeholder")} /><Button type="submit" disabled={!question.trim()} className="shrink-0 bg-secondary-foreground hover:bg-secondary-foreground/90"><Plus />{t("questions.add")}</Button></form>}
    {success ? <div className="mt-3 flex gap-2 rounded-xl border border-success-foreground/30 bg-success p-3 text-sm text-success-foreground"><CheckCircle2 className="size-5 shrink-0" />{t("questions.sentSuccess")}</div> : null}
    {questions.length === 0 ? <div className="mt-3 rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">{t("questions.empty")}</div> : <ul className="mt-3 overflow-hidden rounded-xl border border-border">{questions.map((item) => <li key={item.id} className="border-b border-border px-3 py-3 text-sm last:border-b-0"><div className="flex items-center gap-2"><span className={cn("size-3 shrink-0 rounded-full border", item.status === "sent" ? "border-success-foreground bg-success" : item.status === "failed" ? "border-destructive bg-destructive" : "border-info-foreground")} />{editing === item.id ? <Input autoFocus value={drafts[item.id] ?? item.text} onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: event.target.value }))} onBlur={() => { onUpdate(item.id, drafts[item.id] ?? item.text); setEditing(null); }} className="h-8 min-w-0 flex-1" /> : <span className="min-w-0 flex-1">{item.text}</span>}{item.status === "sending" ? <LoaderCircle className="size-4 animate-spin text-info-foreground" aria-label={t("questions.sending")} /> : null}{item.time ? <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex"><Clock3 className="size-3" />{item.time}</span> : null}<span className={cn("rounded-full px-2 py-1 text-xs font-medium", item.status === "sent" ? "bg-success text-success-foreground" : item.status === "failed" ? "bg-destructive/10 text-destructive" : "bg-secondary text-secondary-foreground")}>{t(`questions.${item.status}`)}</span>{item.status === "draft" && !locked ? <><Button type="button" size="icon-xs" variant="ghost" aria-label={t("questions.edit")} onClick={() => setEditing(item.id)}><Pencil /></Button><Button type="button" size="icon-xs" variant="ghost" className="text-destructive" aria-label={t("questions.delete")} onClick={() => onDelete(item.id)}><Trash2 /></Button></> : null}</div>{item.status === "failed" ? <Button type="button" variant="outline" size="xs" className="mt-2" onClick={() => onRetry(item.id)}><RotateCcw />{t("questions.retry")}</Button> : null}</li>)}</ul>}
    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-assistant/25 p-3 text-xs text-muted-foreground"><span>{t("questions.localOnly")}</span>{!locked ? <Button type="button" variant="ghost" size="xs" onClick={() => setLocked(true)}><LockKeyhole />{t("questions.startClass")}</Button> : null}</div>
  </CardContent></Card>;
}
