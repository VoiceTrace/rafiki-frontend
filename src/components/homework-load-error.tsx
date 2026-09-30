"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export function HomeworkLoadError() {
  const t = useTranslations("homeworkErrors")
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  return <div className="mx-auto grid max-w-160 gap-4 rounded-xl border p-6" role="alert">
    <p>{t("load")}</p>
    <Button disabled={pending} onClick={() => startTransition(() => router.refresh())}>{t("retry")}</Button>
  </div>
}
