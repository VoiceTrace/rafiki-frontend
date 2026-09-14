"use client"

import { Menu } from "@base-ui/react/menu"
import { LogOut, UserRound } from "lucide-react"
import { signOut } from "next-auth/react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

interface UserMenuProps {
  user: {
    name?: string | null
    email?: string | null
    role: string
  }
  role: "teacher" | "student"
}

export function UserMenu({ user, role }: UserMenuProps) {
  const t = useTranslations("profile")

  const initials = (user.name ?? "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()

  return (
    <Menu.Root>
      <Menu.Trigger
        className="flex items-center gap-2 rounded-lg px-2 py-1 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={t("openProfileMenu")}
      >
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground"
          aria-hidden="true"
        >
          {initials || <UserRound className="size-4" />}
        </span>
        <div className="hidden text-start text-xs leading-relaxed lg:block">
          <strong className="block font-semibold">{user.name}</strong>
          <span className="capitalize text-muted-foreground">{user.role}</span>
        </div>
      </Menu.Trigger>
      <Menu.Positioner side="bottom" align="end" sideOffset={8}>
        <Menu.Popup className="z-50 min-w-48 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-overlay outline-none">
          <div className="border-b border-border px-3 py-2">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Menu.Item
            className="mt-1 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            render={<Link href={"/" + role + "/profile"} />}
          >
            <UserRound className="size-4 shrink-0" aria-hidden="true" />
            {t("viewProfile")}
          </Menu.Item>
          <Menu.Item
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => signOut({ redirectTo: "/" })}
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            {t("signOut")}
          </Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Root>
  )
}
