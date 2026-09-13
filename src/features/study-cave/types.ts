import type { StudentSessionState } from "@/features/live-session/components/student-session-gate";

export const studyCavePhases = ["before", "during", "after", "homework"] as const;
export type StudyCavePhase = (typeof studyCavePhases)[number];

const studentSessionStates = [
  "ready",
  "joining",
  "connected",
  "reconnecting",
  "failed",
  "locked",
] as const satisfies readonly StudentSessionState[];

export type StudyCaveRouteState = {
  initialPhase: StudyCavePhase;
  initialSessionState?: StudentSessionState;
};

export type StudyCaveSearchParams = {
  phase?: string | string[];
  session?: string | string[];
};

const phaseSet = new Set<string>(studyCavePhases);
const sessionStateSet = new Set<string>(studentSessionStates);

export function parseStudyCaveRouteState(
  searchParams: StudyCaveSearchParams,
): StudyCaveRouteState {
  const initialPhase =
    typeof searchParams.phase === "string" && phaseSet.has(searchParams.phase)
      ? (searchParams.phase as StudyCavePhase)
      : "before";
  const initialSessionState =
    typeof searchParams.session === "string" &&
    sessionStateSet.has(searchParams.session)
      ? (searchParams.session as StudentSessionState)
      : undefined;

  return { initialPhase, initialSessionState };
}
