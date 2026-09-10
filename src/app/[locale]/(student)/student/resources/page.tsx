import { getLocale, getTranslations } from "next-intl/server";

import { EmptyStatePage } from "@/components/shared/empty-state-page";

export default async function Page() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("emptyStates.comingSoon"),
  ]);

  return (
    <EmptyStatePage
      kind="coming-soon"
      locale={locale as "en" | "ar"}
      appName={t("appName")}
      title={t("title")}
      description={t("description")}
      primaryAction={t("primaryAction")}
      primaryHref={`/${locale}/student/today`}
      secondaryAction={t("secondaryAction")}
      secondaryHref={`/${locale}/student/learn`}
    />
  );
}
