import { getLocale, getTranslations } from "next-intl/server";
import { EmptyStatePage } from "@/components/shared/empty-state-page";

export default async function NotFound() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("emptyStates.notFound")]);
  return <EmptyStatePage kind="not-found" locale={locale as "en" | "ar"} appName={t("appName")} title={t("title")} description={t("description")} primaryAction={t("primaryAction")} primaryHref={`/${locale}/student/today`} />;
}