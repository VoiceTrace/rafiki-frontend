"use client";

import type { FormEvent } from "react";
import { HelpCircle, Plus } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StudyCaveCardTitle } from "./study-cave-card-title";

export type StudyCaveQuestion = { id: number; text: string; status: "sent" | "pending" };

export function StudyCaveQuestionCard({ t, question, setQuestion, questions, onSubmit }: { t: (key: string) => string; question: string; setQuestion: (value: string) => void; questions: StudyCaveQuestion[]; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Card className="shadow-surface"><CardHeader><StudyCaveCardTitle icon={HelpCircle} tone="text-info-foreground">{t("questions.title")}</StudyCaveCardTitle><p className="text-xs text-muted-foreground">{t("questions.description")}</p></CardHeader><CardContent><form className="flex gap-2" onSubmit={onSubmit}><Input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t("questions.placeholder")} /><Button type="submit" disabled={!question.trim()} className="shrink-0 bg-secondary-foreground hover:bg-secondary-foreground/90"><Plus />{t("questions.add")}</Button></form><ul className="mt-3 overflow-hidden rounded-xl border border-border">{questions.map((item) => <li key={item.id} className="flex items-center gap-3 border-b border-border px-3 py-3 text-sm last:border-b-0"><span className="size-3 rounded-full border border-info-foreground" /><span className="min-w-0 flex-1">{item.text}</span><span className={cn("rounded-full px-2 py-1 text-xs font-medium", item.status === "sent" ? "bg-success text-success-foreground" : "bg-secondary text-secondary-foreground")}>{t(`questions.${item.status}`)}</span></li>)}</ul></CardContent></Card>;
}
