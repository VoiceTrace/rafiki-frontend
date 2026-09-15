import { StudyCavePage } from "@/features/study-cave/components/study-cave-page";
import {
  parseStudyCaveRouteState,
  type StudyCaveSearchParams,
} from "@/features/study-cave/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<StudyCaveSearchParams>;
}) {
  const routeState = parseStudyCaveRouteState(await searchParams);

  return <StudyCavePage {...routeState} showHomeworkState />;
}
