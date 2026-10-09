import { verifySession } from "@/features/auth/server/dal";
import { StudentResourcesPage } from "@/features/student-resources/components/student-resources-page";
import { loadStudentResourceLibrary } from "@/features/teacher-resources/server/resource-api";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "ar" ? "ar" : "en";
  await verifySession(safeLocale, "student");
  const materials = await loadStudentResourceLibrary(safeLocale);

  return <StudentResourcesPage materials={materials ?? []} loadFailed={materials === null} />;
}
