"use client";

import {
  Bell,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  CircleUserRound,
  GraduationCap,
  Home,
  LibraryBig,
  Menu,
  MessageCircleMore,
  Sparkles,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, usePathname } from "@/i18n/navigation";
import styles from "./app-shell.module.css";

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
    { path: "homework", label: "homework", icon: CalendarDays },
    { path: "progress", label: "progress", icon: ChartNoAxesCombined },
    { path: "resources", label: "resources", icon: LibraryBig },
    { path: "connect", label: "connect", icon: MessageCircleMore },
    { path: "rafiqi", label: "myRafiqi", icon: Sparkles },
  ],
};
function isActive(pathname: string, href: string) {
  return (
    pathname === href ||
    pathname.startsWith(href + "/") ||
    (href.endsWith("/today") && pathname.endsWith("/schedule"))
  );
}
function Brand({ role }: { role: Role }) {
  const t = useTranslations("common");
  return (
    <Link className={styles.brand} href={"/" + role + "/today"}>
      <span className={styles.brandMark} aria-hidden="true">
        <Sparkles />
      </span>
      <span className={styles.brandName}>{t("appName")}</span>
    </Link>
  );
}
function NavigationLink({
  item,
  role,
  compact,
  onSelect,
}: {
  item: Item;
  role: Role;
  compact?: boolean;
  onSelect?: () => void;
}) {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const href = "/" + role + "/" + item.path;
  const Icon = item.icon;
  return (
    <Link
      href={href}
      title={t(item.label)}
      aria-label={t(item.label)}
      aria-current={isActive(pathname, href) ? "page" : undefined}
      className={[
        styles.navigationLink,
        isActive(pathname, href) ? styles.active : "",
        compact ? styles.compact : "",
      ].join(" ")}
      onClick={onSelect}
    >
      <Icon aria-hidden="true" />
      <span>{t(item.label)}</span>
    </Link>
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
  const items = navigation[role];
  const moreItems = items.slice(3);
  const moreActive = moreItems.some((item) =>
    isActive(pathname, "/" + role + "/" + item.path),
  );
  const roleName = t(role);
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        {a11y("skipToContent")}
      </a>
      <aside className={styles.sidebar}>
        <Brand role={role} />
        <nav
          className={styles.sidebarNavigation}
          aria-label={a11y("primaryNavigation")}
        >
          {items.map((item) => (
            <NavigationLink item={item} role={role} key={item.path} />
          ))}
        </nav>
        <div className={styles.sidebarProfile}>
          <span className={styles.avatar} aria-hidden="true">
            <CircleUserRound />
          </span>
          <span className={styles.profileCopy}>
            <strong>{roleName}</strong>
            <small>{t(role + "Role")}</small>
          </span>
        </div>
      </aside>
      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <div className={styles.mobileBrand}>
            <Brand role={role} />
          </div>
          <nav
            className={styles.headerNavigation}
            aria-label={a11y("primaryNavigation")}
          >
            {items.slice(0, 3).map((item) => (
              <NavigationLink item={item} role={role} key={item.path} />
            ))}
          </nav>
          <div className={styles.topbarActions}>
            <a
              className={styles.localeSwitch}
              href={"/" + (locale === "ar" ? "en" : "ar") + pathname}
              aria-label={
                locale === "ar" ? t("switchToEnglish") : t("switchToArabic")
              }
            >
              <span className={locale === "en" ? styles.selectedLocale : ""}>
                EN
              </span>
              <span className={styles.localeTrack} aria-hidden="true">
                <span />
              </span>
              <span className={locale === "ar" ? styles.selectedLocale : ""}>
                ع
              </span>
            </a>
            <Link
              className={styles.iconButton}
              href={"/" + role + "/notifications"}
              aria-label={t("notifications")}
            >
              <Bell aria-hidden="true" />
            </Link>
            <div className={styles.topbarProfile}>
              <span className={styles.avatar} aria-hidden="true">
                <CircleUserRound />
              </span>
              <span>
                <strong>{roleName}</strong>
                <small>{t(role + "Role")}</small>
              </span>
            </div>
          </div>
        </header>
        <main className={styles.main} id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
      <nav
        className={styles.bottomNavigation}
        aria-label={a11y("mobileNavigation")}
      >
        {items.slice(0, 3).map((item) => (
          <NavigationLink item={item} role={role} compact key={item.path} />
        ))}
        <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
          <DialogTrigger
            className={[
              styles.navigationLink,
              styles.compact,
              moreActive ? styles.active : "",
            ].join(" ")}
            aria-label={t("openMenu")}
          >
            <Menu aria-hidden="true" />
            <span>{navT("more")}</span>
          </DialogTrigger>
          <DialogContent
            className={styles.menuDialog + " translate-x-0 translate-y-0"}
            showCloseButton={false}
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <div className={styles.mobileMenuHeader}>
              <DialogTitle>{navT("more")}</DialogTitle>
              <DialogClose
                className={styles.iconButton}
                aria-label={t("closeMenu")}
              >
                <X aria-hidden="true" />
              </DialogClose>
            </div>
            <nav>
              {moreItems.map((item) => (
                <NavigationLink
                  item={item}
                  role={role}
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
