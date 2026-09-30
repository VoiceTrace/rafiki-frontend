import { TeacherResourcesPage } from "@/features/teacher-resources/components/teacher-resources-page";
import { loadTeacherResources } from "@/features/teacher-resources/server/resource-api";
import { verifySession } from "@/features/auth/server/dal";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  await verifySession(safeLocale, "teacher");
  const data = await loadTeacherResources(safeLocale).catch(() => ({ resources: [], classes: [], grades: [], students: [], curriculum: {} }));
  return <TeacherResourcesPage {...data} locale={safeLocale} />;
}
