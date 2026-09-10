import Image from "next/image";
import { ArrowRight, Compass, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStatePageProps = {
  kind: "not-found" | "coming-soon";
  locale?: "en" | "ar";
  appName: string;
  title: string;
  description: string;
  primaryAction: string;
  primaryHref: string;
  secondaryAction?: string;
  secondaryHref?: string;
};

export function EmptyStatePage({ kind, locale = "en", appName, title, description, primaryAction, primaryHref, secondaryAction, secondaryHref }: EmptyStatePageProps) {
  const isArabic = locale === "ar";
  const isNotFound = kind === "not-found";
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-background px-5 py-10 text-foreground sm:px-8">
      <div className="pointer-events-none absolute -start-28 top-20 size-80 rounded-full bg-secondary/65 blur-3xl" />
      <div className="pointer-events-none absolute -end-24 bottom-0 size-72 rounded-full bg-assistant/60 blur-3xl" />
      <a href={primaryHref} className="absolute start-6 top-7 text-2xl font-bold tracking-tight text-secondary-foreground outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring sm:start-10">{appName}</a>
      <section className="relative z-10 w-full max-w-2xl rounded-3xl border border-border bg-card px-6 py-10 text-center shadow-overlay sm:px-12 sm:py-14" aria-labelledby="empty-state-title">
        <div className="mx-auto mb-7 grid size-24 place-items-center rounded-3xl bg-secondary text-secondary-foreground shadow-surface">
          {isNotFound ? <Compass aria-hidden="true" className="size-12 stroke-[1.6]" /> : <div className="relative size-17 overflow-hidden rounded-2xl bg-assistant"><Image src="/images/rafiqi-learner.png" alt="" fill sizes="68px" className="object-cover" /><Sparkles aria-hidden="true" className="absolute end-1 top-1 size-4 text-primary" /></div>}
        </div>
        {isNotFound && <p className="mb-2 text-6xl font-bold leading-none tracking-[-0.08em] text-primary sm:text-7xl">404</p>}
        <h1 id="empty-state-title" className="text-page font-bold tracking-tight text-balance">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-7 text-muted-foreground text-pretty sm:text-lg">{description}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={primaryHref} className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>{primaryAction}<ArrowRight aria-hidden="true" className={cn("size-4", isArabic && "rotate-180")} /></a>
          {secondaryAction && secondaryHref && <a href={secondaryHref} className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-11 px-5")}>{secondaryAction}</a>}
        </div>
      </section>
    </main>
  );
}
