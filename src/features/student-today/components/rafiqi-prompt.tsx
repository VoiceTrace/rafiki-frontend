"use client";

import { type FormEvent, useState } from "react";
import { Bot, SendHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RafiqiPrompt() {
  const t = useTranslations("studentToday");
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = prompt.trim();
    if (!value) return;
    router.push(`/student/rafiqi?prompt=${encodeURIComponent(value)}`);
  }

  const suggestions = [t("assistant.suggestionOne"), t("assistant.suggestionTwo"), t("assistant.suggestionThree")];

  return (
    <section className="grid gap-4 rounded-xl border border-assistant bg-assistant/55 p-4 shadow-surface sm:p-5 lg:grid-cols-[minmax(0,1fr)_13.5rem] lg:items-center">
      <div className="flex min-w-0 gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-card text-assistant-foreground ring-1 ring-assistant">
          <Bot className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-base font-semibold">{t("assistant.title")}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{t("assistant.description")}</p>
          <form className="mt-3 flex gap-2" onSubmit={submit}>
            <Input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={t("assistant.placeholder")}
              aria-label={t("assistant.placeholder")}
              className="h-10 bg-card"
            />
            <Button type="submit" size="lg" aria-label={t("assistant.send")}>
              <SendHorizontal data-icon="inline-end" className="rtl:-scale-x-100" />
              <span className="hidden sm:inline">{t("assistant.send")}</span>
            </Button>
          </form>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 lg:max-w-none lg:flex-col">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            type="button"
            variant="outline"
            size="sm"
            className="h-auto min-h-8 justify-start whitespace-normal bg-card px-3 py-1.5 text-start"
            onClick={() => setPrompt(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </section>
  );
}

