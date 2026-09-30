export const studyCavePhases = ["before", "after", "homework"] as const;
export type StudyCavePhase = (typeof studyCavePhases)[number];

export type StudyCaveRouteState = {
  initialPhase: StudyCavePhase;
};

export type StudyCaveSearchParams = {
  phase?: string | string[];
  session?: string | string[];
  homeworkId?: string | string[];
  subject_id?: string | string[];
  chapter_id?: string | string[];
  lesson_id?: string | string[];
};

const phaseSet = new Set<string>(studyCavePhases);

export function parseStudyCaveRouteState(
  searchParams: StudyCaveSearchParams,
): StudyCaveRouteState {
  // "during" is a retired phase name kept working for older links.
  const initialPhase =
    searchParams.phase === "during"
      ? "after"
      : typeof searchParams.phase === "string" && phaseSet.has(searchParams.phase)
        ? (searchParams.phase as StudyCavePhase)
        : "before";
  return { initialPhase };
}

export function parseHomeworkId(searchParams: StudyCaveSearchParams): string | undefined {
  return typeof searchParams.homeworkId === "string" ? searchParams.homeworkId : undefined;
}
