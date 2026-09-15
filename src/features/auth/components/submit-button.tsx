"use client"

import { useFormStatus } from "react-dom"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  const t = useTranslations("auth")

  return (
    <Button type="submit" className="w-full" disabled={pending} aria-disabled={pending}>
      {pending ? <Spinner /> : null}
      {pending ? t("pleaseWait") : label}
    </Button>
  )
}

