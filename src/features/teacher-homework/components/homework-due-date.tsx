"use client"

import { useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"

export function HomeworkDueDate({ id, value }: { id: string; value?: string | null }) {
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!input.current) return
    const date = value ? new Date(value) : null
    input.current.value = date
      ? new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
      : ""
  }, [value])
  return <Input ref={input} id={id} name="due_at" type="datetime-local" />
}

/** Convert the browser's local wall time before the Server Action crosses time zones. */
export function normalizeDueDate(formData: FormData) {
  const value = formData.get("due_at")
  if (typeof value === "string" && value) {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) formData.set("due_at", date.toISOString())
  }
}
