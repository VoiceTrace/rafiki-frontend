"use client";
import { type FormEvent, useState } from "react";
import {
  Bot,
  Download,
  FileText,
  Paperclip,
  SendHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export type RafiqiMessage = { author: "rafiqi" | "student"; text: string };
type Props = {
  title: string;
  context: string;
  messages: RafiqiMessage[];
  suggestions: string[];
  placeholder: string;
  sendLabel: string;
  response: string;
  time: string;
  attachment: { name: string; meta: string };
};
export function RafiqiConversation({
  title,
  context,
  messages,
  placeholder,
  sendLabel,
  response,
  time,
  attachment,
}: Props) {
  const [thread, setThread] = useState(messages);
  const [draft, setDraft] = useState("");
  function send(value = draft) {
    const message = value.trim();
    if (!message) return;
    setThread((c) => [
      ...c,
      { author: "student", text: message },
      { author: "rafiqi", text: response },
    ]);
    setDraft("");
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    send();
  }
  return (
    <section
      className="flex min-h-[31rem] flex-col overflow-hidden rounded-xl border border-border bg-card p-4 shadow-surface sm:p-5"
      aria-label={title}
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
        <span className="sr-only">{context}</span>
        {thread.map((message, index) => (
          <div
            key={`${message.author}-${index}`}
            className={
              message.author === "student"
                ? "ms-auto flex max-w-[89%] items-start gap-2"
                : "flex max-w-[92%] items-start gap-2"
            }
          >
            {message.author === "rafiqi" ? (
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-assistant text-assistant-foreground">
                <Bot className="size-5" aria-hidden="true" />
              </span>
            ) : null}
            <div
              className={
                message.author === "student"
                  ? "rounded-xl rounded-se-sm bg-secondary px-3 py-2.5 text-sm leading-5 text-foreground"
                  : "rounded-xl rounded-ss-sm bg-assistant/70 px-3 py-2.5 text-sm leading-5 text-foreground"
              }
            >
              {message.text}
              <span className="mt-1 block text-[0.65rem] text-muted-foreground">
                {time}
              </span>
            </div>
            {message.author === "student" ? (
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-info text-sm font-semibold text-info-foreground">
                A
              </span>
            ) : null}
          </div>
        ))}
        <div className="ms-12 flex max-w-[calc(100%-3rem)] items-center gap-3 rounded-lg border border-assistant bg-assistant/35 p-3">
          <span className="grid size-9 place-items-center rounded-lg bg-destructive/10 text-destructive">
            <FileText className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block truncate text-xs">
              {attachment.name}
            </strong>
            <span className="block text-[0.65rem] text-muted-foreground">
              {attachment.meta}
            </span>
          </span>
          <Download
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="mt-4 border border-border bg-card p-1.5">
        <form className="flex gap-2" onSubmit={submit}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={attachment.name}
          >
            <Paperclip aria-hidden="true" />
          </Button>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="h-10 bg-card"
          />
          <Button type="submit" size="lg" aria-label={sendLabel}>
            <SendHorizontal className="rtl:-scale-x-100" aria-hidden="true" />
            <span>{sendLabel}</span>
          </Button>
        </form>
      </div>
    </section>
  );
}
