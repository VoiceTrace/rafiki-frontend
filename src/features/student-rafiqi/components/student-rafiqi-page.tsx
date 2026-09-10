import {
  BarChart3,
  BookOpenText,
  Flag,
  ImageIcon,
  Lightbulb,
  Pencil,
  Sparkles,
  Target,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RafiqiConversation } from "@/components/shared/rafiqi-conversation";

export async function StudentRafiqiPage() {
  const t = await getTranslations("studentRafiqi");
  const preferences = [
    {
      icon: ImageIcon,
      title: t("preferences.visual.title"),
      description: t("preferences.visual.description"),
      tone: "bg-assistant text-assistant-foreground",
    },
    {
      icon: Lightbulb,
      title: t("preferences.curious.title"),
      description: t("preferences.curious.description"),
      tone: "bg-secondary text-secondary-foreground",
    },
    {
      icon: Target,
      title: t("preferences.focused.title"),
      description: t("preferences.focused.description"),
      tone: "bg-info text-info-foreground",
    },
  ];
  const goals = [
    {
      icon: Flag,
      title: t("goals.concepts.title"),
      description: t("goals.concepts.description"),
      tone: "bg-info text-info-foreground",
    },
    {
      icon: BarChart3,
      title: t("goals.confidence.title"),
      description: t("goals.confidence.description"),
      tone: "bg-success text-success-foreground",
    },
  ];
  return (
    <div
      className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 pb-2 sm:gap-5"
      data-testid="student-rafiqi-page"
    >
      <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-page font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-2 w-fit bg-card sm:mt-0"
        >
          {t("course")}
          <BookOpenText aria-hidden="true" />
        </Button>
      </header>
      <section
        className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.03fr)_minmax(20rem,.97fr)]"
        aria-label={t("workspaceLabel")}
      >
        <RafiqiConversation
          title={t("conversation.title")}
          context={t("conversation.context")}
          messages={[
            { author: "rafiqi", text: t("conversation.opening") },
            { author: "student", text: t("conversation.studentReply") },
            { author: "rafiqi", text: t("conversation.response") },
          ]}
          suggestions={[]}
          placeholder={t("conversation.placeholder")}
          sendLabel={t("conversation.send")}
          response={t("conversation.followUp")}
          time={t("conversation.time")}
          attachment={{
            name: t("conversation.attachmentName"),
            meta: t("conversation.attachmentMeta"),
          }}
        />
        <aside className="flex min-w-0 flex-col gap-3">
          <Card className="gap-3 py-4 shadow-surface">
            <CardHeader className="flex-row items-center gap-3">
              <CardTitle className="text-card-title">
                {t("preferences.title")}
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ms-auto"
              >
                <Pencil aria-hidden="true" />
                {t("edit")}
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3">
              {preferences.map(({ icon: Icon, title, description, tone }) => (
                <div className="flex gap-3" key={title}>
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-full ${tone}`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <strong className="block text-sm">{title}</strong>
                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                      {description}
                    </p>
                  </span>
                </div>
              ))}
            </CardContent>
            <Image
              src="/images/rafiqi-learner.png"
              alt={t("preferences.illustrationAlt")}
              width={420}
              height={420}
              className="pointer-events-none -mt-20 ms-auto hidden w-52 object-contain lg:block"
            />
          </Card>
          <Card className="gap-3 py-4 shadow-surface">
            <CardHeader className="flex-row items-center gap-3">
              <CardTitle className="text-card-title">
                {t("goals.title")}
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ms-auto"
              >
                <Pencil aria-hidden="true" />
                {t("edit")}
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3">
              {goals.map(({ icon: Icon, title, description, tone }) => (
                <div className="flex gap-3" key={title}>
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-lg ${tone}`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <strong className="block text-sm">{title}</strong>
                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                      {description}
                    </p>
                  </span>
                </div>
              ))}
              <div className="mt-1 flex flex-wrap justify-between gap-2 border-t border-border pt-3">
                <Button type="button" variant="outline" size="sm">
                  {t("notQuiteMe")}
                </Button>
                <Button type="button" variant="secondary" size="sm">
                  <Sparkles aria-hidden="true" />
                  {t("discuss")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}
