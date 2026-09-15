"use client"

import { useTranslations } from "next-intl"

export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations("errorBoundary")

  return (
    <main>
      <h1>{t("title")}</h1>
      <button type="button" onClick={reset}>
        {t("retry")}
      </button>
    </main>
  )
}
