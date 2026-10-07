import { ResourceLoadError } from "@/features/teacher-resources/components/resource-load-error";
import { TeacherResourcesPage } from "@/features/teacher-resources/components/teacher-resources-page";
import { loadTeacherResources } from "@/features/teacher-resources/server/resource-api";
import { verifySession } from "@/features/auth/server/dal";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  await verifySession(safeLocale, "teacher");
  const data = await loadTeacherResources(safeLocale).catch(() => null);
  if (!data) return <ResourceLoadError />;
  return <TeacherResourcesPage {...data} locale={safeLocale} />;
}
