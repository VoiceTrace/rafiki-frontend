import { StudentLearnPage } from "@/features/student-learn/components/student-learn-page";

export default async function Page({ searchParams }: { searchParams: Promise<{ view?: string; calendar?: string }> }) {
  const { view, calendar } = await searchParams;
  const calendarView = calendar === "week" || calendar === "month" ? calendar : "day";
  return <StudentLearnPage view={view === "schedule" ? "schedule" : "map"} calendarView={calendarView} />;
}
