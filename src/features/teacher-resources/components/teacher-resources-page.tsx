"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowUpDown,
  BookOpenText,
  Check,
  ChevronDown,
  ExternalLink,
  File,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  MoreHorizontal,
  Plus,
  Search,
  Video,
  X,
} from "lucide-react";

type MaterialType = "question" | "article" | "link" | "image" | "video" | "file";
type FilterType = "all" | MaterialType;
type Material = {
  id: number;
  key: "newtonsArticle" | "actionVideo" | "practiceQuestions" | "realWorldLink" | "rocketImage" | "worksheet";
  type: MaterialType;
  date: string;
  required: boolean;
  customTitle?: string;
  customDescription?: string;
};

const initialMaterials: Material[] = [
  { id: 1, key: "newtonsArticle", type: "article", date: "2026-09-12", required: true },
  { id: 2, key: "actionVideo", type: "video", date: "2026-09-11", required: true },
  { id: 3, key: "practiceQuestions", type: "question", date: "2026-09-10", required: false },
  { id: 4, key: "realWorldLink", type: "link", date: "2026-09-08", required: false },
  { id: 5, key: "rocketImage", type: "image", date: "2026-09-06", required: false },
  { id: 6, key: "worksheet", type: "file", date: "2026-09-05", required: true },
];

const typeIcons = {
  question: BookOpenText,
  article: FileText,
  link: LinkIcon,
  image: ImageIcon,
  video: Video,
  file: File,
} satisfies Record<MaterialType, typeof File>;
const typeOrder: FilterType[] = ["all", "question", "article", "link", "image", "video", "file"];

export function TeacherResourcesPage() {
  const t = useTranslations("teacherResources");
  const [materials, setMaterials] = useState(initialMaterials);
  const [selectedId, setSelectedId] = useState(1);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const gradeOptions = [t("grade10"), t("grade9"), t("grade11")];
  const subjectOptions = [t("physics"), t("mathematics"), t("biology")];
  const lessonOptions = [t("allLessons"), t("newtonsLaw"), t("forcesMotion")];
  const [grade, setGrade] = useState(t("grade10"));
  const [subject, setSubject] = useState(t("physics"));
  const [lesson, setLesson] = useState(t("allLessons"));
  const [sortNewest, setSortNewest] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeType, setActiveType] = useState<MaterialType>("question");
  const [required, setRequired] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftSource, setDraftSource] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState(false);

  const visibleMaterials = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return materials
      .filter((material) => filter === "all" || material.type === filter)
      .filter((material) => !query || `${material.customTitle ?? t(`items.${material.key}.title`)} ${t(`items.${material.key}.chapter`)}`.toLocaleLowerCase().includes(query))
      .sort((a, b) => sortNewest ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  }, [filter, materials, search, sortNewest, t]);
  const selected = materials.find((material) => material.id === selectedId) ?? visibleMaterials[0];
  const Icon = selected ? typeIcons[selected.type] : FileText;

  function openDialog() {
    setActiveType("question");
    setDraftTitle("");
    setDraftBody("");
    setDraftSource("");
    setEditingId(null);
    setRequired(false);
    setSaveMessage(false);
    setDialogOpen(true);
  }

  function saveMaterial(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId !== null) {
      setMaterials((current) => current.map((material) => material.id === editingId ? { ...material, type: activeType, required, customTitle: draftTitle, customDescription: draftBody } : material));
      setDialogOpen(false);
      setSaveMessage(true);
      return;
    }
    const newMaterial: Material = {
      id: Date.now(),
      key: "practiceQuestions",
      type: activeType,
      date: new Date().toISOString().slice(0, 10),
      required,
      customTitle: draftTitle,
      customDescription: draftBody,
    };
    setMaterials((current) => [newMaterial, ...current]);
    setSelectedId(newMaterial.id);
    setFilter("all");
    setSearch("");
    setDialogOpen(false);
    setSaveMessage(true);
  }

  return (
    <main className="mx-auto flex w-full max-w-300 flex-col gap-4 pb-20" data-testid="teacher-resources-page">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-page font-bold">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <button type="button" onClick={openDialog} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-surface transition hover:opacity-90">
          <Plus className="size-4" />{t("addMaterial")}
        </button>
      </header>

      {saveMessage && <p role="status" className="flex items-center gap-2 rounded-xl border border-success bg-success px-4 py-3 text-sm text-success-foreground"><Check className="size-4" />{t("saved")}</p>}

      <section aria-label={t("filtersLabel")} className="rounded-2xl border bg-card p-3 shadow-surface sm:p-4">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.7fr)_repeat(3,minmax(130px,1fr))]">
          <label className="flex min-h-11 items-center gap-2 rounded-xl border bg-background px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
            <Search className="size-4 shrink-0" />
            <span className="sr-only">{t("search")}</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("searchPlaceholder")} className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
          </label>
          <FilterSelect label={t("grade")} value={grade} options={gradeOptions} onChange={setGrade} />
          <FilterSelect label={t("subject")} value={subject} options={subjectOptions} onChange={setSubject} />
          <FilterSelect label={t("lesson")} value={lesson} options={lessonOptions} onChange={setLesson} />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={t("typesLabel")}>
          {typeOrder.map((type) => {
            const active = filter === type;
            const ItemIcon = type === "all" ? null : typeIcons[type];
            return <button key={type} type="button" role="tab" aria-selected={active} onClick={() => setFilter(type)} className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition ${active ? "border-secondary bg-secondary text-secondary-foreground" : "bg-card hover:bg-muted"}`}>
              {ItemIcon && <ItemIcon className="size-4" />}{t(`types.${type}`)}
            </button>;
          })}
        </div>
      </section>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.9fr)]">
        <section aria-labelledby="materials-heading" className="min-w-0 overflow-hidden rounded-2xl border bg-card shadow-surface">
          <div className="flex min-h-12 items-center justify-between gap-2 border-b px-4">
            <h2 id="materials-heading" className="text-sm font-bold">{t("materialCount", { count: visibleMaterials.length })}</h2>
            <button type="button" onClick={() => setSortNewest((value) => !value)} className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-muted-foreground hover:bg-muted" aria-label={t("sortByDate")}>
              <ArrowUpDown className="size-4" /><span>{sortNewest ? t("mostRecent") : t("oldest")}</span><ChevronDown className="size-4" />
            </button>
          </div>
          {visibleMaterials.length ? <ul className="divide-y px-2">
            {visibleMaterials.map((material) => {
              const RowIcon = typeIcons[material.type];
              const active = selected?.id === material.id;
              return <li key={material.id}>
                <button type="button" onClick={() => setSelectedId(material.id)} aria-pressed={active} className={`flex w-full items-center gap-3 rounded-xl px-2 py-3 text-start transition sm:px-3 ${active ? "bg-secondary/70" : "hover:bg-muted/70"}`}>
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-card text-primary" : "bg-muted text-primary"}`}><RowIcon className="size-5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{material.customTitle ?? t(`items.${material.key}.title`)}</span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">{t(`types.${material.type}`)} <span aria-hidden="true">·</span> {t(`items.${material.key}.chapter`)}</span>
                  </span>
                  <span className="hidden min-w-20 flex-col items-end gap-1 sm:flex">
                    <StatusPill required={material.required} label={t(material.required ? "required" : "optional")} />
                    <span className="text-[11px] text-muted-foreground">{formatDate(material.date, t("locale"))}</span>
                  </span>
                  <span aria-label={t("moreActions", { title: material.customTitle ?? t(`items.${material.key}.title`) })} className="rounded-lg p-2 text-muted-foreground"><MoreHorizontal className="size-4" /></span>
                </button>
              </li>;
            })}
          </ul> : <div className="flex min-h-56 flex-col items-center justify-center gap-2 px-6 text-center"><span className="rounded-full bg-muted p-3 text-muted-foreground"><Search className="size-5" /></span><p className="font-semibold">{t("noResults")}</p><p className="text-sm text-muted-foreground">{t("noResultsHelp")}</p></div>}
        </section>

        <section aria-labelledby="preview-heading" className="rounded-2xl border bg-card p-4 shadow-surface sm:p-5">
          <div className="flex items-center justify-between gap-3"><h2 id="preview-heading" className="text-sm font-bold">{t("preview")}</h2><button type="button" aria-label={t("morePreviewActions")} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><MoreHorizontal className="size-4" /></button></div>
          {selected ? <>
            <div className="mt-3 rounded-xl border p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2"><span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground"><Icon className="size-4 text-primary" />{t(`types.${selected.type}`)}</span><StatusPill required={selected.required} label={t(selected.required ? "required" : "optional")} /></div>
              <h3 className="mt-3 font-heading text-lg font-bold leading-snug">{selected.customTitle ?? t(`items.${selected.key}.title`)}</h3>
              {selected.type === "article" || selected.type === "video" || selected.type === "image" ? <div className="resource-art mt-3 flex min-h-28 items-center justify-center overflow-hidden rounded-lg border bg-muted p-3" aria-label={t("previewIllustration")}>
                <div className="flex w-full items-center justify-center gap-4 rounded-lg bg-card/80 p-4 text-center">
                  <span className="text-3xl" aria-hidden="true">🛹</span><span className="text-2xl font-bold text-primary" aria-hidden="true">←</span><span className="text-3xl" aria-hidden="true">🛹</span><span className="text-2xl font-bold text-info-foreground" aria-hidden="true">→</span>
                </div>
              </div> : null}
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{selected.customDescription ?? t(`items.${selected.key}.description`)}</p>
              {(selected.type === "article" || selected.type === "video") && <div className="mt-3 flex items-center gap-2 border-t pt-3 text-sm"><span className="text-muted-foreground">{t("source")}</span><span className="font-semibold">{selected.type === "article" ? "Khan Academy" : "Rafiqi classroom"}</span><ExternalLink className="size-3 text-muted-foreground" /></div>}
              <dl className="mt-3 grid gap-3 border-t pt-3 text-xs sm:grid-cols-[100px_1fr]">
                <dt className="text-muted-foreground">{t("targetAudience")}</dt><dd className="flex flex-wrap gap-2"><span className="rounded-full bg-muted px-2.5 py-1">{grade}</span><span className="rounded-full bg-muted px-2.5 py-1">{subject}</span></dd>
                <dt className="text-muted-foreground">{t("lessonContext")}</dt><dd className="text-muted-foreground">{t("chapterContext")} <span aria-hidden="true">›</span> {t(`items.${selected.key}.chapter`)}</dd>
                <dt className="text-muted-foreground">{t("added")}</dt><dd>{formatDate(selected.date, t("locale"))}</dd>
                <dt className="text-muted-foreground">{t("addedBy")}</dt><dd>{t("teacherName")}</dd>
              </dl>
            </div>
          <button type="button" onClick={() => { setActiveType(selected.type); setDraftTitle(selected.customTitle ?? t(`items.${selected.key}.title`)); setDraftBody(selected.customDescription ?? t(`items.${selected.key}.description`)); setDraftSource(""); setRequired(selected.required); setEditingId(selected.id); setDialogOpen(true); }} className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold hover:bg-muted"><FileText className="size-4" />{t("editMaterial")}</button>
          </> : <div className="py-12 text-center text-sm text-muted-foreground">{t("selectMaterial")}</div>}
        </section>
      </div>

      {dialogOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-3 sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="resource-dialog-title" className="flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border bg-card shadow-overlay">
          <header className="flex items-center justify-between border-b px-5 py-4 sm:px-8"><h2 id="resource-dialog-title" className="font-heading text-xl font-bold">{t("dialogTitle")}</h2><button type="button" onClick={() => setDialogOpen(false)} aria-label={t("closeDialog")} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X className="size-5" /></button></header>
          <form id="resource-form" onSubmit={saveMaterial} className="overflow-y-auto px-5 py-5 sm:px-8">
            <fieldset><legend className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("typeLabel")}</legend><div className="flex flex-wrap gap-2">
              {(["question", "article", "link", "image", "video", "file"] as MaterialType[]).map((type) => { const TypeIcon = typeIcons[type]; return <button type="button" key={type} onClick={() => setActiveType(type)} aria-pressed={activeType === type} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm font-semibold ${activeType === type ? "border-info-foreground bg-info text-info-foreground" : "hover:bg-muted"}`}><TypeIcon className="size-4" />{t(`types.${type}`)}</button>; })}
            </div></fieldset>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t(activeType === "question" ? "questionField" : "titleField")}<input required value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder={t(activeType === "question" ? "questionPlaceholder" : "titlePlaceholder")} className="min-h-11 rounded-xl border bg-background px-3 text-base font-normal normal-case tracking-normal text-foreground outline-none focus:ring-2 focus:ring-ring" /></label>
              <label className="grid gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t(activeType === "question" ? "answerField" : "descriptionField")}<textarea required value={draftBody} onChange={(event) => setDraftBody(event.target.value)} placeholder={t(activeType === "question" ? "answerPlaceholder" : "descriptionPlaceholder")} rows={activeType === "question" ? 3 : 2} className="rounded-xl border bg-background px-3 py-3 text-base font-normal normal-case tracking-normal text-foreground outline-none focus:ring-2 focus:ring-ring" /></label>
              {(["article", "link", "image", "video", "file"] as MaterialType[]).includes(activeType) && <label className="grid gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("sourceOrUrl")}<input value={draftSource} onChange={(event) => setDraftSource(event.target.value)} placeholder={t("urlPlaceholder")} className="min-h-11 rounded-xl border bg-background px-3 text-base font-normal normal-case tracking-normal text-foreground outline-none focus:ring-2 focus:ring-ring" /></label>}
            </div>
            <div className="my-5 border-t" />
            <fieldset><legend className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("targetLabel")}</legend><div className="grid gap-3 sm:grid-cols-2">
              <FilterSelect label={t("grade")} value={grade} options={gradeOptions} onChange={setGrade} />
              <FilterSelect label={t("subject")} value={subject} options={subjectOptions} onChange={setSubject} />
              <FilterSelect label={t("chapter")} value={t("chapterValue")} options={[t("chapterValue"), t("chapterTwo"), t("chapterFour")]} onChange={() => undefined} />
              <FilterSelect label={t("lesson")} value={lesson === t("allLessons") ? lessonOptions[1] : lesson} options={lessonOptions.slice(1)} onChange={setLesson} />
            </div></fieldset>
            <fieldset className="mt-4"><legend className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("visibilityLabel")}</legend><div className="grid gap-3 sm:grid-cols-2">
              <ChoiceButton active={!required} onClick={() => setRequired(false)}>{t("optionalChoice")}</ChoiceButton><ChoiceButton active={required} onClick={() => setRequired(true)}>{t("requiredChoice")}</ChoiceButton>
            </div></fieldset>
          </form>
          <footer className="flex justify-end gap-2 border-t px-5 py-4 sm:px-8"><button type="button" onClick={() => setDialogOpen(false)} className="min-h-10 rounded-xl bg-muted px-4 text-sm font-semibold text-muted-foreground">{t("cancel")}</button><button type="submit" form="resource-form" className="min-h-10 rounded-xl bg-info-foreground px-5 text-sm font-semibold text-white">{t(editingId === null ? "saveToLibrary" : "saveChanges")}</button></footer>
        </section>
      </div>}
    </main>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="relative flex min-h-11 min-w-0 flex-col justify-center rounded-xl border bg-background px-3 py-1 focus-within:ring-2 focus-within:ring-ring"><span className="text-[10px] leading-3 text-muted-foreground">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full appearance-none bg-transparent pe-5 text-sm font-semibold outline-none"><option value={value}>{value}</option>{options.filter((option) => option !== value).map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 translate-y-0.5 text-muted-foreground" /></label>;
}

function StatusPill({ required, label }: { required: boolean; label: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${required ? "bg-destructive/10 text-destructive" : "bg-success text-success-foreground"}`}>{label}</span>;
}

function ChoiceButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`min-h-12 rounded-xl border px-3 text-sm font-semibold transition ${active ? "border-info-foreground bg-info text-info-foreground" : "hover:bg-muted"}`}>{children}</button>;
}

function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}
