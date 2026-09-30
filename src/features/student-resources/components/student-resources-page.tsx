"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { BookOpenText, Check, Circle, Clock3, Download, ExternalLink, File, FileText, Image as ImageIcon, Link as LinkIcon, MessageCircleQuestion, Play, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import type { ResourceType, StudentMaterial } from "@/features/teacher-resources/server/resource-api";
import { updateMaterialCompletion } from "@/features/study-cave/actions/material-actions";

type Category = "all" | "article" | "video" | "image" | "question" | "link" | "file";
type Audience = "all" | "required" | "optional";
const categories: Category[] = ["all", "article", "video", "image", "question", "link", "file"];
const icons = { question: MessageCircleQuestion, article: FileText, link: LinkIcon, image: ImageIcon, video: Play, file: File } satisfies Record<ResourceType, typeof File>;

function contextKey(item: StudentMaterial) {
  return `${item.class_id ?? "class"}:${item.lesson_id}`;
}

export function StudentResourcesPage({ materials: initialMaterials, loadFailed }: { materials: StudentMaterial[]; loadFailed: boolean }) {
  const t = useTranslations("studentResources");
  const [materials, setMaterials] = useState(initialMaterials);
  const [selectedContext, setSelectedContext] = useState(() => initialMaterials[0] ? contextKey(initialMaterials[0]) : "");
  const [category, setCategory] = useState<Category>("all");
  const [audience, setAudience] = useState<Audience>("all");
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const contexts = useMemo(() => {
    const unique = new Map<string, StudentMaterial>();
    for (const item of materials) if (!unique.has(contextKey(item))) unique.set(contextKey(item), item);
    return [...unique.entries()];
  }, [materials]);
  const activeContext = contexts.find(([key]) => key === selectedContext)?.[1] ?? contexts[0]?.[1];
  const lessonMaterials = useMemo(() => materials.filter((item) => activeContext && contextKey(item) === contextKey(activeContext)), [activeContext, materials]);
  const completeCount = lessonMaterials.filter((item) => item.completed).length;
  const progress = lessonMaterials.length ? Math.round((completeCount / lessonMaterials.length) * 100) : 0;
  const filteredMaterials = useMemo(() => lessonMaterials.filter((item) => {
    const matchesCategory = category === "all" || item.type === category;
    const matchesAudience = audience === "all" || (audience === "required" ? item.required : !item.required);
    const query = search.trim().toLocaleLowerCase();
    const matchesSearch = !query || `${item.title} ${item.description} ${item.original_filename ?? ""}`.toLocaleLowerCase().includes(query);
    return matchesCategory && matchesAudience && matchesSearch;
  }), [audience, category, lessonMaterials, search]);

  function markComplete(item: StudentMaterial) {
    const next = !item.completed;
    setPendingId(item.id);
    setActionError(false);
    startTransition(async () => {
      try {
        await updateMaterialCompletion(item.lesson_id, item.id, next);
        setMaterials((current) => current.map((resource) => resource.id === item.id ? { ...resource, completed: next } : resource));
      } catch {
        setActionError(true);
      } finally {
        setPendingId(null);
      }
    });
  }

  return <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8">
    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="font-heading text-page font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">{t("subtitle")}</p>
      </div>
      {activeContext ? <label className="grid w-full gap-1.5 rounded-2xl border border-border bg-card p-3 text-xs text-muted-foreground shadow-surface md:w-[min(100%,22rem)]">
        <span>{t("lessonContext")}</span>
        <select aria-label={t("lessonContext")} className="min-h-9 w-full bg-transparent text-sm font-semibold text-foreground outline-none" value={selectedContext} onChange={(event) => setSelectedContext(event.target.value)}>
          {contexts.map(([key, item]) => <option key={key} value={key}>{item.grade_title} · {item.subject_title} · {item.lesson_title}{contexts.filter(([, candidate]) => candidate.lesson_id === item.lesson_id).length > 1 ? ` · ${item.class_name}` : ""}</option>)}
        </select>
      </label> : null}
    </header>

    {loadFailed ? <div role="alert" className="rounded-2xl border border-destructive/30 bg-card p-5 text-sm">
      <p className="font-semibold">{t("loadError")}</p><p className="mt-1 text-muted-foreground">{t("loadErrorHelp")}</p>
    </div> : materials.length === 0 ? <Card className="shadow-surface"><CardContent className="grid min-h-56 place-items-center p-6 text-center">
      <div><BookOpenText className="mx-auto size-8 text-muted-foreground" aria-hidden="true" /><h2 className="mt-3 font-semibold">{t("emptyTitle")}</h2><p className="mt-1 max-w-md text-sm text-muted-foreground">{t("emptyDescription")}</p></div>
    </CardContent></Card> : <>
      <section aria-label={t("filtersLabel")} className="grid gap-3 rounded-2xl border border-border bg-card p-3 shadow-surface sm:p-4">
        <label className="flex min-h-11 items-center gap-3 rounded-xl border border-border bg-muted/30 px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input aria-label={t("search")} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder={t("searchPlaceholder")} value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div role="group" aria-label={t("categoriesLabel")} className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`min-h-10 shrink-0 rounded-xl border px-4 text-sm font-semibold transition-colors ${category === item ? "border-primary/20 bg-primary/10 text-primary" : "border-border bg-card hover:bg-muted"}`}>{t(`categories.${item}`)}</button>)}
          </div>
          <div role="group" aria-label={t("audienceLabel")} className="flex w-full rounded-xl border border-border p-1 xl:w-auto">
            {(["all", "required", "optional"] as const).map((item) => <button key={item} type="button" aria-pressed={audience === item} onClick={() => setAudience(item)} className={`min-h-9 flex-1 rounded-lg px-3 text-sm font-medium xl:flex-none ${audience === item ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t(`audiences.${item}`)}</button>)}
          </div>
        </div>
      </section>

      <aside aria-label={t("progressTitle")} className="rounded-2xl border border-border bg-card p-3 shadow-surface xl:hidden">
        <div className="flex items-center gap-3">
          <div className="relative grid size-14 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(var(--color-primary) ${progress}%, var(--color-muted) ${progress}% 100%)` }} aria-label={t("percentage", { value: progress })} role="img">
            <div className="grid size-11 place-items-center rounded-full bg-card text-sm font-bold">{progress}%</div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold">{t("progressTitle")}</h2>
            <p className="truncate text-xs text-muted-foreground">{activeContext?.lesson_title}</p>
            <p className="text-xs text-muted-foreground">{t("progress", { completed: completeCount, total: lessonMaterials.length })}</p>
          </div>
        </div>
        <details className="mt-3 border-t border-border pt-2">
          <summary className="cursor-pointer text-xs font-semibold text-primary">{t("viewChecklist")}</summary>
          <ul className="mt-2 grid max-h-48 gap-2 overflow-y-auto">
            {lessonMaterials.map((item) => <li key={item.id} className="flex min-w-0 items-start gap-2 text-xs">
              <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${item.completed ? "bg-success text-success-foreground" : "border-2 border-border text-muted-foreground"}`}>{item.completed ? <Check className="size-3.5" aria-hidden="true" /> : null}</span>
              <span className="min-w-0"><span className="block font-medium">{t(`types.${item.type}`)} · {t(item.completed ? "completed" : "notStarted")}</span><span className="mt-0.5 block break-words text-muted-foreground">{item.title}</span></span>
            </li>)}
          </ul>
        </details>
      </aside>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <section aria-label={t("materialsLabel")}>
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="font-semibold">{t("materialCount", { count: filteredMaterials.length })}</h2>
            {activeContext ? <p className="text-xs text-muted-foreground">{activeContext.chapter_title} · {activeContext.grade_title}</p> : null}
          </div>
          {filteredMaterials.length ? <div className="grid gap-3 md:grid-cols-2">
            {filteredMaterials.map((item) => {
              const Icon = icons[item.type];
              const inlineUrl = item.download_url ? `${item.download_url}?inline=true` : null;
              return <Card key={item.id} className="min-w-0 shadow-surface">
                <CardContent className="grid h-full gap-3 p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-5" aria-hidden="true" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-info px-2.5 py-1 text-xs font-semibold text-info-foreground">{t(`types.${item.type}`)}</span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.required ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{t(item.required ? "required" : "optional")}</span>
                      </div>
                      <h3 className="mt-2 break-words text-sm font-bold leading-5">{item.title}</h3>
                      {item.description ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.description}</p> : null}
                    </div>
                  </div>
                  {item.type === "question" && item.question ? <details className="rounded-lg bg-muted/50 px-3 py-2 text-xs">
                    <summary className="cursor-pointer font-semibold">{t("showQuestion")}</summary><p className="mt-2 whitespace-pre-wrap leading-5">{item.question}</p>
                  </details> : null}
                  {item.type === "image" && inlineUrl ? <Image src={inlineUrl} alt={item.title} width={640} height={360} unoptimized className="max-h-40 w-full rounded-lg bg-muted object-contain" /> : null}
                  {item.type === "video" && inlineUrl ? <video controls preload="metadata" src={inlineUrl} aria-label={item.title} className="max-h-40 w-full rounded-lg bg-black" /> : null}
                  {item.type === "file" && inlineUrl && item.media_type === "application/pdf" ? <a href={inlineUrl} target="_blank" rel="noreferrer" className="flex min-h-10 items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium text-primary"><FileText className="size-4" aria-hidden="true" />{t("viewPdf")}</a> : null}
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                      {item.completed ? <Check className="size-4 text-success-foreground" aria-hidden="true" /> : <Clock3 className="size-4" aria-hidden="true" />}
                      <span>{t(item.completed ? "completed" : "notStarted")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.source_url ? <a href={item.source_url} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground">{t("open")}<ExternalLink className="size-3.5" aria-hidden="true" /></a> : item.download_url ? <a href={item.download_url} download={item.original_filename ?? undefined} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground">{item.type === "file" || item.type === "image" ? t("download") : t("open")}<Download className="size-3.5" aria-hidden="true" /></a> : null}
                      <button type="button" disabled={isPending} onClick={() => markComplete(item)} className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold disabled:opacity-50 ${item.completed ? "border-success/30 text-success-foreground" : "border-border hover:bg-muted"}`} aria-label={t(item.completed ? "markIncomplete" : "markComplete")}>{item.completed ? <Check className="size-3.5" aria-hidden="true" /> : <Circle className="size-3.5" aria-hidden="true" />}{pendingId === item.id ? t("saving") : t(item.completed ? "markIncomplete" : "markComplete")}</button>
                    </div>
                  </div>
                  {item.original_filename ? <p className="truncate text-[11px] text-muted-foreground">{item.original_filename}{item.byte_size ? ` · ${(item.byte_size / (1024 * 1024)).toFixed(1)} MB` : ""}</p> : null}
                </CardContent>
              </Card>;
            })}
          </div> : <div className="grid min-h-40 place-items-center rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">{t("noResults")}</div>}
          {actionError ? <p role="alert" className="mt-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{t("completionError")}</p> : null}
        </section>

        <aside aria-label={t("progressTitle")} className="hidden rounded-2xl border border-border bg-card p-4 shadow-surface xl:sticky xl:top-4 xl:block">
          <h2 className="font-heading text-base font-bold">{t("progressTitle")}</h2>
          <div className="my-4 flex items-center gap-4 sm:justify-start xl:flex-col">
            <div className="relative grid size-24 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(var(--color-primary) ${progress}%, var(--color-muted) ${progress}% 100%)` }} aria-label={t("percentage", { value: progress })} role="img">
              <div className="grid size-[4.5rem] place-items-center rounded-full bg-card text-lg font-bold">{progress}%</div>
            </div>
            <div className="min-w-0 xl:text-center">
              <p className="font-semibold">{activeContext?.lesson_title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("progress", { completed: completeCount, total: lessonMaterials.length })}</p>
            </div>
          </div>
          <ul className="grid gap-2 border-t border-border pt-3">
            {lessonMaterials.map((item) => <li key={item.id} className="flex min-w-0 items-start gap-2 text-xs">
              <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${item.completed ? "bg-success text-success-foreground" : "border-2 border-border text-muted-foreground"}`}>{item.completed ? <Check className="size-3.5" aria-hidden="true" /> : null}</span>
              <span className="min-w-0"><span className="block font-medium">{t(`types.${item.type}`)}</span><span className="mt-0.5 block break-words text-muted-foreground">{item.title}</span></span>
            </li>)}
          </ul>
        </aside>
      </div>
    </>}
  </div>;
}
