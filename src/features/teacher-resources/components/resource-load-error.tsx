"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ResourceLoadError() {
  const t = useTranslations("teacherResources");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <section role="alert" className="rounded-2xl border border-destructive/30 bg-card p-5">
    <h1 className="font-heading text-page font-bold">{t("title")}</h1>
    <p className="mt-3 font-semibold">{t("loadError")}</p>
    <p className="mt-1 text-sm text-muted-foreground">{t("loadErrorHelp")}</p>
    <Button type="button" variant="outline" disabled={pending} aria-busy={pending} className="mt-4" onClick={() => startTransition(() => router.refresh())}>{t("retryLoad")}</Button>
  </section>;
}
