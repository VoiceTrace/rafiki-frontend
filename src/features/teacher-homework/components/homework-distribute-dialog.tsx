"use client"

import { useTransition, useState } from "react"
import { Loader2, Send } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { distributeAssignmentAction } from "../actions/homework-actions"
import type { User } from "@/types/user"

interface Props {
  assignmentId: string
  students: User[]
  disabled?: boolean
}

export function HomeworkDistributeDialog({ assignmentId, students, disabled }: Props) {
  const t = useTranslations("teacherHomework")
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [dueAt, setDueAt] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    setSelectedIds(new Set(students.map((s) => s.id)))
  }

  function clearAll() {
    setSelectedIds(new Set())
  }

  function handleDistribute() {
    if (selectedIds.size === 0) {
      setError(t("distribute.noStudents"))
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await distributeAssignmentAction(
        assignmentId,
        Array.from(selectedIds),
        dueAt || undefined,
        locale,
      )
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button disabled={disabled} size="sm" type="button">
          <Send className="size-4" />
          {t("distribute.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("distribute.title")}</DialogTitle>
          <DialogDescription>{t("distribute.description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t("distribute.selected", { count: selectedIds.size, total: students.length })}
            </span>
            <div className="flex gap-2">
              <button type="button" className="text-primary hover:underline" onClick={selectAll}>
                {t("distribute.selectAll")}
              </button>
              <span className="text-muted-foreground">·</span>
              <button type="button" className="text-muted-foreground hover:underline" onClick={clearAll}>
                {t("distribute.clearAll")}
              </button>
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto rounded-lg border border-border">
            {students.map((student) => (
              <label
                key={student.id}
                className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-secondary/30"
              >
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={selectedIds.has(student.id)}
                  onChange={() => toggle(student.id)}
                />
                <span className="text-sm font-medium">{student.full_name}</span>
              </label>
            ))}
            {students.length === 0 && (
              <p className="px-3 py-4 text-sm text-muted-foreground">{t("distribute.noStudentsAvailable")}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-semibold">{t("distribute.dueAt")}</label>
            <input
              type="datetime-local"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            {t("distribute.cancel")}
          </Button>
          <Button onClick={handleDistribute} disabled={isPending || selectedIds.size === 0}>
            {isPending && <Loader2 className="animate-spin" />}
            {t("distribute.confirm", { count: selectedIds.size })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
