import { BookOpenCheck, CalendarDays, ChevronRight, ClipboardList, Plus } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import type { AssignmentRead } from "@/types/homework"

interface Props {
  assignments: AssignmentRead[]
  locale: string
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-secondary text-secondary-foreground",
  distributed: "bg-primary/15 text-primary",
  closed: "bg-muted text-muted-foreground",
}

export async function HomeworkAssignmentList({ assignments, locale }: Props) {
  const t = await getTranslations("teacherHomework")

  return (
    <div className="mx-auto flex w-full max-w-270 flex-col gap-5 pb-20">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <ClipboardList className="size-4" />
            <span className="text-xs font-semibold">{t("list.eyebrow")}</span>
          </div>
          <h1 className="mt-1 font-heading text-page font-bold tracking-tight">{t("list.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("list.description")}</p>
        </div>
        <Link
          href="/teacher/homework/new"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="size-4" />
          {t("list.new")}
        </Link>
      </header>

      {assignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          <BookOpenCheck className="mx-auto mb-3 size-8 opacity-40" />
          <p className="font-medium">{t("list.empty.title")}</p>
          <p className="mt-1 text-sm">{t("list.empty.description")}</p>
          <Link href="/teacher/homework/new" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}>
            {t("list.empty.cta")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {assignments.map((a) => (
            <Link
              key={a.id}
              href={`/teacher/homework/${a.id}/edit`}
              className="group rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="h-full transition-colors group-hover:border-primary/45 group-hover:bg-secondary/20">
                <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                    <BookOpenCheck className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <strong className="text-base">{a.title}</strong>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[a.status] ?? STATUS_STYLES.draft}`}>
                        {t(`status.${a.status}`)}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {t("list.questionCount", { count: a.question_count })}
                      {a.due_at && (
                        <>
                          {" · "}
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="size-3.5" />
                            {new Date(a.due_at).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
