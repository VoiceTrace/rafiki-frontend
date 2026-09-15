"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleAlert, Play, RefreshCw, Signal, Users, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SessionState = "ready" | "joining" | "connected" | "reconnecting" | "failed" | "locked";

/** Compact, frontend-only lifecycle layer for the existing T03/T04 workspace. */
export function TeacherLiveSessionPanel({ variant }: { variant: "before" | "during" }) {
  const t = useTranslations("liveSession.teacher");
  const [state, setState] = useState<SessionState>("ready");
  const [confirmEnd, setConfirmEnd] = useState(false);
  useEffect(() => {
    if (state !== "joining") return;
    const timer = window.setTimeout(() => setState("connected"), 1000);
    return () => window.clearTimeout(timer);
  }, [state]);
  const title = variant === "before" ? t("scheduledTitle") : t("lobbyTitle");
  const description = variant === "before" ? t("scheduledDescription") : t("lobbyDescription");
  const isRecovery = state === "reconnecting" || state === "failed";
  const status = state === "connected" ? t("connected") : state === "joining" ? t("joiningTitle") : state === "locked" ? t("lockedTitle") : state === "failed" ? t("failedTitle") : state === "reconnecting" ? t("reconnectingTitle") : title;
  const detail = state === "ready" ? description : state === "joining" ? t("joiningDescription") : state === "connected" ? t("connectedDescription") : state === "locked" ? t("lockedDescription") : state === "failed" ? t("failedDescription") : t("reconnectingDescription");
  const tone = state === "connected" || state === "locked" ? "border-success/30 bg-success/15" : isRecovery ? "border-secondary bg-secondary/45" : "border-assistant bg-assistant/35";
  return <><section className={`flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 shadow-surface ${tone}`} data-testid={`teacher-session-${state}`} aria-live="polite">
    {state === "connected" ? <Signal className="size-5 text-success-foreground" /> : state === "locked" ? <CheckCircle2 className="size-5 text-success-foreground" /> : isRecovery ? <WifiOff className="size-5 text-secondary-foreground" /> : <Users className="size-5 text-assistant-foreground" />}
    <div className="min-w-36 flex-1"><p className="text-sm font-semibold">{status}</p><p className="text-xs text-muted-foreground">{detail}</p></div>
    <span className="rounded-full bg-card px-2.5 py-1 text-xs font-semibold">{state === "ready" ? t("participants") : state === "joining" ? t("joiningParticipants") : t("liveParticipants")}</span>
    {state === "ready" && <Button onClick={() => setState("joining")}><Play />{t("startClass")}</Button>}
    {state === "joining" && <Button disabled><RefreshCw className="animate-spin" />{t("joining")}</Button>}
    {state === "connected" && <><Button size="sm" variant="ghost" onClick={() => setState("reconnecting")}><CircleAlert />{t("connectionHelp")}</Button><Button variant="destructive" onClick={() => setConfirmEnd(true)}>{t("endClass")}</Button></>}
    {isRecovery && <><Button onClick={() => setState("connected")}><RefreshCw />{t("retry")}</Button>{state === "reconnecting" && <Button variant="outline" onClick={() => setState("failed")}>{t("stillOffline")}</Button>}</>}
    {state === "locked" && <Button variant="outline" onClick={() => setState("ready")}>{t("viewSummary")}</Button>}
  </section><Dialog open={confirmEnd} onOpenChange={setConfirmEnd}><DialogContent><DialogHeader><DialogTitle>{t("endTitle")}</DialogTitle><DialogDescription>{t("endDescription")}</DialogDescription></DialogHeader><DialogFooter><DialogClose render={<Button variant="outline" />}>{t("keepTeaching")}</DialogClose><Button variant="destructive" onClick={() => { setConfirmEnd(false); setState("locked"); }}>{t("endClass")}</Button></DialogFooter></DialogContent></Dialog></>;
}
