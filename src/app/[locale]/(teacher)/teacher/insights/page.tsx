import { TeacherInsightsPage } from "@/features/teacher-insights/components/teacher-insights-page";
import { loadTeacherInsights } from "@/features/teacher-insights/server/teacher-insights-api";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ class_id?: string; from?: string; to?: string }> }) {
  const [{ locale }, filters] = await Promise.all([params, searchParams]);
  const data = await loadTeacherInsights(locale === "ar" ? "ar" : "en", { classId: filters.class_id, from: filters.from, to: filters.to });
  return <TeacherInsightsPage data={data} filters={filters} />;
}
