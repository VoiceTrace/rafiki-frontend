import { BookOpenCheck, CalendarDays, ChevronRight, ClipboardList } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import type { StudentAssignmentRead } from "@/types/homework"

interface Props {
  assignments: StudentAssignmentRead[]
}

const STATUS_STYLES: Record<string, string> = {
  assigned: "bg-secondary text-secondary-foreground",
  in_progress: "bg-primary/15 text-primary",
  submitted: "bg-success/20 text-success-foreground",
}

export async function StudentHomeworkListReal({ assignments }: Props) {
  const t = await getTranslations("studentHomework")

  return (
    <div className="mx-auto flex w-full max-w-270 flex-col gap-5 pb-20" data-testid="student-homework-page">
      <header>
        <div className="flex items-center gap-2 text-primary">
          <ClipboardList className="size-4" />
          <span className="text-xs font-semibold">{t("list.eyebrow")}</span>
        </div>
        <h1 className="mt-1 font-heading text-page font-bold tracking-tight">{t("list.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">{t("list.description")}</p>
      </header>

      {assignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          <BookOpenCheck className="mx-auto mb-3 size-8 opacity-40" />
          <p className="font-medium">{t("list.empty")}</p>
        </div>
      ) : (
        <section className="grid gap-3" aria-label={t("list.label")}>
          {assignments.map((sa) => (
            <Link
              key={sa.id}
              href={`/student/homework/${sa.id}`}
              className="group rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="h-full transition-colors group-hover:border-primary/45 group-hover:bg-secondary/20">
                <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                    <BookOpenCheck className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <strong className="text-base">{sa.title}</strong>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[sa.status] ?? STATUS_STYLES.assigned}`}>
                        {t(`assignmentStatus.${sa.status}`)}
                      </span>
                      {sa.score !== null && sa.status === "submitted" && (
                        <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-semibold text-success-foreground">
                          {Math.round(sa.score * 100)}%
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {sa.question_count} {t("list.questions")}
                      {sa.due_at && (
                        <>
                          {" · "}
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="size-3.5" />
                            {new Date(sa.due_at).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </span>
                  </span>
                  {sa.status !== "submitted" && (
                    <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      )}
    </div>
  )
}
