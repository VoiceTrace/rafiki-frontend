import {
  StudyCavePage,
  type StudyCavePhase,
} from "@/features/study-cave/components/study-cave-page";
import type { StudentSessionState } from "@/features/live-session/components/student-session-gate";

const phases = new Set<StudyCavePhase>([
  "before",
  "during",
  "after",
  "homework",
]);
const sessionStates = new Set<StudentSessionState>([
  "ready",
  "joining",
  "connected",
  "reconnecting",
  "failed",
  "locked",
]);

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ phase?: string | string[]; session?: string | string[] }>;
}) {
  const { phase: requestedPhase, session: requestedSession } = await searchParams;
  const initialPhase =
    typeof requestedPhase === "string" &&
    phases.has(requestedPhase as StudyCavePhase)
      ? (requestedPhase as StudyCavePhase)
      : "before";

  const initialSessionState =
    typeof requestedSession === "string" &&
    sessionStates.has(requestedSession as StudentSessionState)
      ? (requestedSession as StudentSessionState)
      : undefined;

  return (
    <StudyCavePage
      initialPhase={initialPhase}
      initialSessionState={initialSessionState}
      showHomeworkState
    />
  );
}
