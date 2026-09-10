import { getTranslations } from "next-intl/server";
import { LearningWeek } from "@/features/student-learn/components/learning-week";
export default async function Page() {
  const t = await getTranslations("studentLearn.week");
  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col gap-4">
      <header>
        <h1 className="font-heading text-page font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
      </header>
      <LearningWeek />
    </div>
  );
}
