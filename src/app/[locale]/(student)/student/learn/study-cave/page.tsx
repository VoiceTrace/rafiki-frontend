import { redirect } from "next/navigation";
import type { StudyCaveSearchParams } from "@/features/study-cave/types";

/**
 * Retired route. Study Cave is served from /student/study-cave; this redirect keeps
 * older links working, including the subject/chapter/lesson deep links, rather than
 * duplicating the page in two places.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<StudyCaveSearchParams>;
}) {
  const query = await searchParams;
  const forwarded = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === "string") forwarded.set(key, value);
  }
  const suffix = forwarded.size ? `?${forwarded.toString()}` : "";
  redirect(`/student/study-cave${suffix}`);
}
