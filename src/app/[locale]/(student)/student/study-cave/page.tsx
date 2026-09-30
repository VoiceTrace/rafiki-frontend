import { StudyCavePage } from "@/features/study-cave/components/study-cave-page";
import {
  parseHomeworkId,
  parseStudyCaveRouteState,
  type StudyCaveSearchParams,
} from "@/features/study-cave/types";
import { loadReview } from "@/features/study-cave/server/review-api";
import { loadHomeworkWorkspace } from "@/features/study-cave/server/load-homework-workspace";
import { HomeworkLoadError } from "@/components/homework-load-error";
import { verifySession } from "@/features/auth/server/dal";

const one = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : undefined;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<StudyCaveSearchParams>;
}) {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  await verifySession(safeLocale, "student");

  const query = await searchParams;
  const routeState = parseStudyCaveRouteState(query);
  const review = await loadReview(
    safeLocale,
    one(query.lesson_id),
    one(query.subject_id),
    one(query.chapter_id),
  );
  const key = `${review.subjectId}:${review.chapterId}:${review.lesson?.id}:${routeState.initialPhase}`;

  if (routeState.initialPhase !== "homework") {
    return <StudyCavePage key={key} {...routeState} review={review} />;
  }

  const homework = await loadHomeworkWorkspace(parseHomeworkId(query));
  if (!homework) return <HomeworkLoadError />;

  return (
    <StudyCavePage
      key={key}
      {...routeState}
      review={review}
      homeworkAssignments={homework.assignments}
      selectedHomework={homework.selectedHomework}
      initialHomeworkResult={homework.initialHomeworkResult}
    />
  );
}
