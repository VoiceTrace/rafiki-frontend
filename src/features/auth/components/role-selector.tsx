"use client"

import { GraduationCap, UserRound } from "lucide-react"
import { useTranslations } from "next-intl"

export function RoleSelector({ defaultValue = "student" }: { defaultValue?: "teacher" | "student" }) {
  const t = useTranslations("auth")

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{t("roleLabel")}</legend>
      <div className="grid grid-cols-2 gap-2">
        {(["student", "teacher"] as const).map((role) => {
          const Icon = role === "student" ? GraduationCap : UserRound
          return (
            <label key={role} className="cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="role"
                value={role}
                defaultChecked={defaultValue === role}
              />
              <span className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 text-sm font-medium transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                <Icon className="size-4" aria-hidden="true" />
                {t(role)}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

