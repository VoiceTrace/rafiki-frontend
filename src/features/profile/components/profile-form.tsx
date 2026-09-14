"use client"

import { useActionState, useRef, useTransition } from "react"
import { useTranslations } from "next-intl"
import { UserRound, Camera, Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { User } from "@/types/user"
import {
  updateProfileAction,
  uploadAvatarAction,
  removeAvatarAction,
  type ProfileActionState,
} from "@/features/profile/actions/update-profile"

const idle: ProfileActionState = { status: "idle" }

export function ProfileForm({ user }: { user: User }) {
  const t = useTranslations("profile")
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  const [profileState, profileAction, profilePending] = useActionState(updateProfileAction, idle)
  const [avatarState, avatarAction, avatarPending] = useActionState(uploadAvatarAction, idle)
  const [removeState, removeAction, removePending] = useActionState(removeAvatarAction, idle)

  const avatarSrc = user.avatar_url
    ? `${process.env.NEXT_PUBLIC_API_URL}${user.avatar_url}`
    : null

  const initials = (user.full_name ?? "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()

  const anyPending = profilePending || avatarPending || removePending || isPending

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6">
      <div>
        <h1 className="font-heading text-page font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Avatar card */}
      <Card className="shadow-surface">
        <CardHeader className="px-5 pt-5">
          <CardTitle className="text-section font-bold">{t("avatar")}</CardTitle>
          <CardDescription>{t("avatarDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="flex items-center gap-5">
            <span className="relative flex size-20 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-secondary-foreground">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={t("avatarAlt")}
                  fill
                  className="rounded-full object-cover"
                  sizes="80px"
                />
              ) : (
                initials ? (
                  <span aria-hidden="true">{initials}</span>
                ) : (
                  <UserRound className="size-9" aria-hidden="true" />
                )
              )}
            </span>
            <div className="flex flex-col gap-2">
              <form action={avatarAction}>
                <input
                  ref={avatarInputRef}
                  type="file"
                  name="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  aria-label={t("uploadAvatar")}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      startTransition(() => {
                        e.target.form?.requestSubmit()
                      })
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={anyPending}
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatarPending ? (
                    <Spinner className="me-2 size-4" />
                  ) : (
                    <Camera className="me-2 size-4" aria-hidden="true" />
                  )}
                  {t("uploadAvatar")}
                </Button>
              </form>
              {user.avatar_url && (
                <form action={removeAction}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={anyPending}
                  >
                    {removePending ? (
                      <Spinner className="me-2 size-4" />
                    ) : (
                      <Trash2 className="me-2 size-4" aria-hidden="true" />
                    )}
                    {t("removeAvatar")}
                  </Button>
                </form>
              )}
            </div>
          </div>
          {avatarState.status === "error" && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {avatarState.message === "too_large"
                ? t("errorAvatarTooLarge")
                : avatarState.message === "bad_type"
                  ? t("errorAvatarType")
                  : t("errorGeneric")}
            </p>
          )}
          {avatarState.status === "success" && (
            <p role="status" className="mt-3 text-sm text-green-600">{t("avatarUpdated")}</p>
          )}
          {removeState.status === "success" && (
            <p role="status" className="mt-3 text-sm text-green-600">{t("avatarRemoved")}</p>
          )}
        </CardContent>
      </Card>

      {/* Profile info + password card */}
      <form action={profileAction}>
        <Card className="shadow-surface">
          <CardHeader className="px-5 pt-5">
            <CardTitle className="text-section font-bold">{t("personalInfo")}</CardTitle>
            <CardDescription>{t("personalInfoDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 px-5 pb-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  readOnly
                  disabled
                  className="opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="full_name">{t("fullName")}</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={user.full_name}
                  minLength={1}
                  maxLength={255}
                  required
                />
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <h2 className="mb-4 font-semibold">{t("changePassword")}</h2>
              <div className="max-w-sm space-y-1.5">
                <Label htmlFor="password">{t("newPassword")}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  minLength={8}
                  autoComplete="new-password"
                  placeholder={t("passwordPlaceholder")}
                />
                <p className="text-xs text-muted-foreground">{t("passwordHint")}</p>
              </div>
            </div>

            {profileState.status === "error" && (
              <p role="alert" className="text-sm text-destructive">{t("errorGeneric")}</p>
            )}
            {profileState.status === "success" && (
              <p role="status" className="text-sm text-green-600">{t("saved")}</p>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={anyPending}>
                {profilePending && <Spinner className="me-2 size-4" />}
                {t("save")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
