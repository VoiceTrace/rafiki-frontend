"use client"

import { useActionState, useRef, useTransition } from "react"
import { useTranslations } from "next-intl"
import { UserRound, Camera, Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
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

  const anyPending = profilePending || avatarPending || removePending || isPending

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Avatar */}
      <section aria-labelledby="avatar-heading" className="space-y-4">
        <h2 id="avatar-heading" className="text-sm font-semibold">{t("avatar")}</h2>
        <div className="flex items-center gap-4">
          <span className="relative flex size-20 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={t("avatarAlt")}
                fill
                className="rounded-full object-cover"
                sizes="80px"
              />
            ) : (
              <UserRound className="size-9" aria-hidden="true" />
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
          <p role="alert" className="text-sm text-destructive">
            {avatarState.message === "too_large"
              ? t("errorAvatarTooLarge")
              : avatarState.message === "bad_type"
                ? t("errorAvatarType")
                : t("errorGeneric")}
          </p>
        )}
        {avatarState.status === "success" && (
          <p role="status" className="text-sm text-green-600">{t("avatarUpdated")}</p>
        )}
        {removeState.status === "success" && (
          <p role="status" className="text-sm text-green-600">{t("avatarRemoved")}</p>
        )}
      </section>

      {/* Profile info */}
      <form action={profileAction} className="space-y-5">
        <section aria-labelledby="info-heading" className="space-y-4">
          <h2 id="info-heading" className="text-sm font-semibold">{t("personalInfo")}</h2>

          <div className="space-y-1.5">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" value={user.email} readOnly disabled className="opacity-60" />
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
              aria-describedby="full_name_hint"
            />
          </div>
        </section>

        <section aria-labelledby="password-heading" className="space-y-4">
          <h2 id="password-heading" className="text-sm font-semibold">{t("changePassword")}</h2>

          <div className="space-y-1.5">
            <Label htmlFor="password">{t("newPassword")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              placeholder={t("passwordPlaceholder")}
            />
            <p id="full_name_hint" className="text-xs text-muted-foreground">{t("passwordHint")}</p>
          </div>
        </section>

        {profileState.status === "error" && (
          <p role="alert" className="text-sm text-destructive">{t("errorGeneric")}</p>
        )}
        {profileState.status === "success" && (
          <p role="status" className="text-sm text-green-600">{t("saved")}</p>
        )}

        <Button type="submit" disabled={anyPending}>
          {profilePending && <Spinner className="me-2 size-4" />}
          {t("save")}
        </Button>
      </form>
    </div>
  )
}
