export const studyCavePhases = ["before", "after", "homework"] as const;
export type StudyCavePhase = (typeof studyCavePhases)[number];
export type StudyCaveSearchParams = { phase?: string | string[]; subject_id?: string | string[]; chapter_id?: string | string[]; lesson_id?: string | string[]; session?: string | string[] };
export function parseStudyCaveRouteState(params: StudyCaveSearchParams): { initialPhase: StudyCavePhase } {
  return { initialPhase: params.phase === "during" || params.phase === "after" ? "after" : params.phase === "homework" ? "homework" : "before" };
}
