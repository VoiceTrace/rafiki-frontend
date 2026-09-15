"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, RefreshCw, Signal, TriangleAlert, Users, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type StudentSessionState =
  | "ready"
  | "joining"
  | "connected"
  | "reconnecting"
  | "failed"
  | "locked";

export function StudentSessionGate({
  children,
  initialState = "ready",
}: {
  children: React.ReactNode;
  initialState?: StudentSessionState;
}) {
  const t = useTranslations("liveSession.student");
  const [state, setState] = useState<StudentSessionState>(initialState);

  useEffect(() => {
    if (state !== "joining") return;
    const timer = window.setTimeout(() => setState("connected"), 1200);
    return () => window.clearTimeout(timer);
  }, [state]);

  if (state === "ready" || state === "joining") {
    const joining = state === "joining";
    return (
      <div className="grid gap-4">
        <Card className="border-assistant bg-assistant/35 shadow-surface" data-testid="student-session-join">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="grid size-9 place-items-center rounded-full bg-card text-assistant-foreground">
                <Users className="size-5" aria-hidden="true" />
              </span>
              {joining ? t("joiningTitle") : t("readyTitle")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{joining ? t("joiningDescription") : t("readyDescription")}</p>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-success px-3 py-1 text-xs font-semibold text-success-foreground">{t("connectionReady")}</span>
            <span className="text-xs text-muted-foreground">{t("participants")}</span>
            {!joining ? <span className="basis-full text-xs text-muted-foreground">{t("privacy")}</span> : null}
            <Button className="ms-auto" disabled={joining} onClick={() => setState("joining")}>
              {joining ? <RefreshCw className="animate-spin" /> : <Signal />}
              {joining ? t("joining") : t("join")}
            </Button>
          </CardContent>
        </Card>
        {children}
      </div>
    );
  }

  if (state === "reconnecting" || state === "failed") {
    const failed = state === "failed";
    return (
      <div className="grid gap-4">
        <Card className="border-secondary bg-secondary/45 shadow-surface" data-testid="student-session-reconnect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <WifiOff className="size-5 text-secondary-foreground" aria-hidden="true" />
              {failed ? t("failedTitle") : t("reconnectingTitle")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{failed ? t("failedDescription") : t("reconnectingDescription")}</p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button onClick={() => setState("connected")}><RefreshCw />{t("retry")}</Button>
            {!failed ? <Button variant="outline" onClick={() => setState("failed")}>{t("stillOffline")}</Button> : null}
            <Button variant="ghost" onClick={() => setState("ready")}>{t("leave")}</Button>
          </CardContent>
        </Card>
        {children}
      </div>
    );
  }

  if (state === "locked") {
    return (
      <div className="grid gap-4">
        <Card className="border-success bg-success/15 shadow-surface" data-testid="student-session-locked">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><CheckCircle2 className="size-5 text-success-foreground" />{t("lockedTitle")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("lockedDescription")}</p>
          </CardHeader>
        </Card>
        {children}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-success/30 bg-success/15 px-4 py-3" aria-live="polite" data-testid="student-session-connected">
        <span className="flex items-center gap-2 text-sm font-semibold text-success-foreground"><Signal className="size-4" />{t("connected")}</span>
        <span className="text-xs text-muted-foreground">{t("connectedDescription")}</span>
        <Button className="ms-auto" size="sm" variant="ghost" onClick={() => setState("reconnecting")}><TriangleAlert />{t("connectionHelp")}</Button>
      </div>
      {children}
    </div>
  );
}
