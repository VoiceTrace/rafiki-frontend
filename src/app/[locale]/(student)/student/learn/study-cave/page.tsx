import { StudyCavePage } from "@/features/study-cave/components/study-cave-page";
import { parseStudyCaveRouteState, type StudyCaveSearchParams } from "@/features/study-cave/types";
import { loadReview } from "@/features/study-cave/server/review-api";
import { verifySession } from "@/features/auth/server/dal";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<StudyCaveSearchParams> }) {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  await verifySession(safeLocale, "student");
  const query = await searchParams;
  const routeState = parseStudyCaveRouteState(query);
  const review = await loadReview(safeLocale, typeof query.lesson_id === "string" ? query.lesson_id : undefined);
  return <StudyCavePage key={`${review.lesson?.id}:${routeState.initialPhase}`} {...routeState} review={review} />;
}
