import { StudyCavePage } from "@/features/study-cave/components/study-cave-page";
import {
  parseHomeworkId,
  parseStudyCaveRouteState,
  type StudyCaveSearchParams,
} from "@/features/study-cave/types";
import { loadHomeworkWorkspace } from "@/features/study-cave/server/load-homework-workspace";
import { HomeworkLoadError } from "@/components/homework-load-error";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<StudyCaveSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const routeState = parseStudyCaveRouteState(resolvedSearchParams);
  if (routeState.initialPhase !== "homework") return <StudyCavePage {...routeState} />;
  const homework = await loadHomeworkWorkspace(parseHomeworkId(resolvedSearchParams));
  if (!homework) return <HomeworkLoadError />;

  return <StudyCavePage {...routeState} homeworkAssignments={homework.assignments} selectedHomework={homework.selectedHomework} initialHomeworkResult={homework.initialHomeworkResult} />;
}
