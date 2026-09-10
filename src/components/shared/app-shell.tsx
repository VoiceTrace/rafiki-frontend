"use client";

import {
  Bell,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  CircleHelp,
  CircleUserRound,
  GraduationCap,
  Home,
  LibraryBig,
  MessageCircleMore,
  MoreHorizontal,
  Search,
  Settings,
  Sparkles,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { cn } from "cn";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, usePathname } from "@/i18n/navigation";

type Role = "teacher" | "student";
type Item = { path: string; label: string; icon: LucideIcon };
const navigation: Record<Role, Item[]> = {
  teacher: [
    { path: "today", label: "today", icon: Home },
    { path: "teaching", label: "teaching", icon: BookOpen },
    { path: "students", label: "students", icon: UsersRound },
    { path: "resources", label: "resources", icon: LibraryBig },
    { path: "connect", label: "connect", icon: MessageCircleMore },
    { path: "insights", label: "insights", icon: ChartNoAxesCombined },
    { path: "rafiqi", label: "rafiqi", icon: Sparkles },
    { path: "courses", label: "courses", icon: GraduationCap },
  ],
  student: [
    { path: "today", label: "today", icon: Home },
    { path: "learn", label: "learn", icon: BookOpen },
    { path: "study-cave", label: "studyCave", icon: Sparkles },
    { path: "homework", label: "homework", icon: CalendarDays },
    { path: "progress", label: "progress", icon: ChartNoAxesCombined },
    { path: "resources", label: "resources", icon: LibraryBig },
    { path: "connect", label: "connect", icon: MessageCircleMore },
    { path: "rafiqi", label: "myRafiqi", icon: Sparkles },
  ],
};
const utilities: Item[] = [
  { path: "settings", label: "settings", icon: Settings },
  { path: "help", label: "help", icon: CircleHelp },
];
function isActive(pathname: string, href: string) {
  return (
    pathname === href ||
    pathname.startsWith(href + "/") ||
    (href.endsWith("/today") && pathname.endsWith("/schedule"))
  );
}
function Brand({ role, rail = false }: { role: Role; rail?: boolean }) {
  const t = useTranslations("common");
  return (
    <Link
      href={"/" + role + "/today"}
      aria-label={t("appName")}
      className="text-2xl font-bold tracking-tight text-secondary-foreground outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className={cn(rail && "md:hidden xl:inline")}>{t("appName")}</span>
      {rail && (
        <span aria-hidden="true" className="hidden md:inline xl:hidden">
          {t("appName").slice(0, 1)}
        </span>
      )}
    </Link>
  );
}
function NavigationLink({
  item,
  role,
  mode = "sidebar",
  onSelect,
}: {
  item: Item;
  role: Role;
  mode?: "sidebar" | "bottom" | "menu";
  onSelect?: () => void;
}) {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const href = "/" + role + "/" + item.path;
  const active = isActive(pathname, href);
  const Icon = item.icon;
  return (
    <Link
      href={href}
      title={t(item.label)}
      aria-label={t(item.label)}
      aria-current={active ? "page" : undefined}
      data-active={active}
      className={cn(
        "flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring motion-reduce:transition-none",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-muted",
        mode === "sidebar" && "md:justify-center xl:justify-start",
        mode === "bottom" &&
          "min-h-14 flex-col justify-center gap-1 rounded-2xl px-1 text-xs",
        mode === "bottom" &&
          (active
            ? "bg-secondary text-secondary-foreground"
            : "text-muted-foreground"),
      )}
      onClick={onSelect}
    >
      <Icon aria-hidden="true" className="size-5 shrink-0" />
      <span className={cn(mode === "sidebar" && "md:hidden xl:inline")}>
        {t(item.label)}
      </span>
    </Link>
  );
}
function NavigationSearch({
  role,
  onNavigate,
}: {
  role: Role;
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState("");
  const t = useTranslations("shell");
  const navT = useTranslations("navigation");
  const items = [
    ...navigation[role],
    ...utilities,
    { path: "schedule", label: "schedule", icon: CalendarDays },
  ];
  const results = query.trim()
    ? items.filter((item) =>
        navT(item.label)
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()),
      )
    : [];
  return (
    <div className="relative w-full">
      <label className="relative block">
        <span className="sr-only">{t("searchPlaceholder")}</span>
        <Search
          className="pointer-events-none absolute start-3 top-3 size-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={query}
          placeholder={t("searchPlaceholder")}
          className="h-10 ps-10"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
          }}
        />
      </label>
      {query.trim() && (
        <div
          className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-overlay"
          aria-live="polite"
        >
          <p className="px-3 py-2 text-xs text-muted-foreground">
            {t("navigationResults")}
          </p>
          {results.length ? (
            results.map((item) => (
              <NavigationLink
                key={item.path}
                item={item}
                role={role}
                mode="menu"
                onSelect={() => {
                  setQuery("");
                  onNavigate?.();
                }}
              />
            ))
          ) : (
            <p className="px-3 py-3 text-sm text-muted-foreground">
              {t("noResults")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
export function AppShell({
  children,
  role,
}: {
  children: ReactNode;
  role: Role;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("shell");
  const a11y = useTranslations("accessibility");
  const navT = useTranslations("navigation");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const items = navigation[role];
  const moreItems = [...items.slice(3), ...utilities];
  const moreActive = moreItems.some((item) =>
    isActive(pathname, "/" + role + "/" + item.path),
  );
  return (
    <div
      className="flex min-h-dvh bg-background text-foreground"
      data-testid="application-shell"
    >
      <a
        href="#main-content"
        className="fixed start-3 top-3 z-50 -translate-y-24 rounded-lg bg-primary px-4 py-3 text-primary-foreground focus:translate-y-0"
      >
        {a11y("skipToContent")}
      </a>
      <aside
        className="sticky top-0 hidden h-dvh w-20 shrink-0 flex-col border-e border-sidebar-border bg-sidebar px-3 py-7 text-sidebar-foreground md:flex xl:w-sidebar xl:px-4"
        data-testid="sidebar"
      >
        <div className="mb-7 flex justify-center px-3 xl:justify-start">
          <Brand role={role} rail />
        </div>
        <nav
          className="grid gap-1 overflow-y-auto"
          aria-label={a11y("primaryNavigation")}
        >
          {items.map((item) => (
            <NavigationLink item={item} role={role} key={item.path} />
          ))}
        </nav>
        <nav
          className="mt-auto grid gap-1 pt-8"
          aria-label={a11y("utilityNavigation")}
        >
          {utilities.map((item) => (
            <NavigationLink item={item} role={role} key={item.path} />
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <header
          className="sticky top-0 z-30 flex h-header items-center justify-between gap-3 border-b border-border bg-card px-4 text-card-foreground md:gap-5 md:px-6"
          data-testid="topbar"
        >
          <div className="md:hidden">
            <Brand role={role} />
          </div>
          <div className="hidden w-full max-w-lg md:block">
            <NavigationSearch role={role} key={pathname} />
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
              <DialogTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-10 md:hidden"
                  />
                }
                aria-label={t("openSearch")}
              >
                <Search />
              </DialogTrigger>
              <DialogContent
                dir={locale === "ar" ? "rtl" : "ltr"}
                showCloseButton={false}
                className="top-24 translate-y-0 overflow-visible"
              >
                <div className="flex items-center justify-between gap-4">
                  <DialogTitle>{t("searchPlaceholder")}</DialogTitle>
                  <DialogClose
                    render={<Button variant="ghost" size="icon" />}
                    aria-label={t("closeMenu")}
                  >
                    <X />
                  </DialogClose>
                </div>
                <NavigationSearch
                  role={role}
                  onNavigate={() => setSearchOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <a
              href={"/" + (locale === "ar" ? "en" : "ar") + pathname}
              data-testid="locale-switch"
              className="flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={
                locale === "ar" ? t("switchToEnglish") : t("switchToArabic")
              }
            >
              <span
                className={cn(
                  locale === "ar" && "font-semibold text-foreground",
                )}
              >
                AR
              </span>
              <span aria-hidden="true" className="text-border">
                |
              </span>
              <span
                className={cn(
                  locale === "en" && "font-semibold text-foreground",
                )}
              >
                EN
              </span>
            </a>
            <Link
              href={"/" + role + "/notifications"}
              aria-label={t("notifications")}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-10",
              )}
            >
              <Bell aria-hidden="true" />
            </Link>
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label={t(role + "Role")}
            >
              <CircleUserRound
                className="size-8 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="hidden text-xs leading-relaxed lg:block">
                <strong className="block font-semibold">{t(role)}</strong>
                <span className="text-muted-foreground">
                  {t(role + "Role")}
                </span>
              </div>
            </div>
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="min-h-[calc(100dvh-var(--spacing-header))] p-4 pb-[calc(var(--spacing-bottom-nav)+env(safe-area-inset-bottom)+1rem)] outline-none md:p-6 xl:p-8"
        >
          {children}
        </main>
      </div>
      <nav
        className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 grid grid-cols-4 rounded-3xl border border-border bg-card p-1 text-card-foreground shadow-surface md:hidden"
        aria-label={a11y("mobileNavigation")}
        data-testid="bottom-navigation"
      >
        {items.slice(0, 3).map((item) => (
          <NavigationLink
            item={item}
            role={role}
            mode="bottom"
            key={item.path}
          />
        ))}
        <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
          <DialogTrigger
            data-testid="mobile-menu-trigger"
            data-active={moreActive}
            aria-label={t("openMenu")}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
              moreActive
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground",
            )}
          >
            <MoreHorizontal className="size-5" aria-hidden="true" />
            <span>{navT("more")}</span>
          </DialogTrigger>
          <DialogContent
            showCloseButton={false}
            dir={locale === "ar" ? "rtl" : "ltr"}
            className="inset-x-0 top-auto bottom-0 mx-auto max-h-[85dvh] w-full max-w-full translate-x-0 translate-y-0 overflow-y-auto rounded-b-none rounded-t-2xl border-t border-border pb-[max(1rem,env(safe-area-inset-bottom))] shadow-overlay sm:max-w-lg data-open:animate-none data-closed:animate-none"
          >
            <div className="flex items-center justify-between gap-4">
              <DialogTitle>{navT("more")}</DialogTitle>
              <DialogClose
                render={
                  <Button variant="ghost" size="icon" className="size-11" />
                }
                aria-label={t("closeMenu")}
              >
                <X />
              </DialogClose>
            </div>
            <nav className="grid gap-1">
              {moreItems.map((item) => (
                <NavigationLink
                  item={item}
                  role={role}
                  mode="menu"
                  key={item.path}
                  onSelect={() => setMenuOpen(false)}
                />
              ))}
            </nav>
          </DialogContent>
        </Dialog>
      </nav>
    </div>
  );
}
