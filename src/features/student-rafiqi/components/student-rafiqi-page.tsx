"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  BookOpenText,
  Check,
  Flag,
  ImageIcon,
  Lightbulb,
  Pencil,
  Sparkles,
  Target,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { RafiqiConversation, type RafiqiMessage } from "@/components/shared/rafiqi-conversation";

const profileIds = ["likes", "dislikes", "learning"] as const;
const profileStorageKey = "rafiqi.profile-onboarding:v1";
const maxProfileAnswerLength = 160;

type ProfileItemId = (typeof profileIds)[number];
type ProfileConfidence = "confident" | "forming";

type ProfileItem = {
  id: ProfileItemId;
  title: string;
  value: string;
  confidence: ProfileConfidence;
  tone: string;
};

type StoredProfileItem = Pick<ProfileItem, "id" | "value" | "confidence">;

type StoredProfile = {
  version: 1;
  stage: number;
  entries: StoredProfileItem[];
};

type InitialProfileState = {
  profile: ProfileItem[];
  stage: number;
  storageNotice: string;
};

function isProfileItemId(value: unknown): value is ProfileItemId {
  return typeof value === "string" && profileIds.includes(value as ProfileItemId);
}

function isStoredProfileItem(value: unknown): value is StoredProfileItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Partial<StoredProfileItem>;
  return (
    isProfileItemId(item.id) &&
    typeof item.value === "string" &&
    (item.confidence === "confident" || item.confidence === "forming")
  );
}

function parseStoredProfile(value: unknown): StoredProfile | null {
  if (typeof value !== "object" || value === null) return null;

  const profile = value as Partial<StoredProfile>;
  if (
    profile.version !== 1 ||
    typeof profile.stage !== "number" ||
    !Number.isInteger(profile.stage) ||
    profile.stage < 0 ||
    profile.stage > profileIds.length ||
    !Array.isArray(profile.entries) ||
    !profile.entries.every(isStoredProfileItem)
  ) {
    return null;
  }

  return profile as StoredProfile;
}

function loadInitialProfile(
  profileTemplate: ProfileItem[],
  storageNotice: string,
): InitialProfileState {
  try {
    const saved = window.sessionStorage.getItem(profileStorageKey);
    const storedProfile = saved ? parseStoredProfile(JSON.parse(saved)) : null;

    if (!storedProfile) {
      return { profile: profileTemplate, stage: 0, storageNotice: "" };
    }

    const profile = profileTemplate.map((item) => {
      const savedItem = storedProfile.entries.find((entry) => entry.id === item.id);
      return savedItem ? { ...item, ...savedItem } : item;
    });
    return { profile, stage: storedProfile.stage, storageNotice: "" };
  } catch {
    return { profile: profileTemplate, stage: 0, storageNotice };
  }
}

function subscribeToHydration() {
  return () => {};
}

function getClientHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

function useHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
}

function ProfileIcon({ id }: { id: ProfileItemId }) {
  if (id === "likes") return <Sparkles className="size-5" aria-hidden="true" />;
  if (id === "dislikes") return <Lightbulb className="size-5" aria-hidden="true" />;
  return <ImageIcon className="size-5" aria-hidden="true" />;
}

function StudentRafiqiLoading({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <div
      className="mx-auto flex w-full max-w-295 flex-col gap-4 pb-2 sm:gap-5"
      aria-busy="true"
      aria-label={label}
    >
      <header>
        <h1 className="font-heading text-page font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-base text-muted-foreground">{label}</p>
      </header>
      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.03fr)_minmax(20rem,.97fr)]">
        <Skeleton className="min-h-[31rem] rounded-xl" />
        <div className="grid gap-3">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </section>
    </div>
  );
}

function StudentRafiqiWorkspace({ initialPrompt }: { initialPrompt?: string }) {
  const t = useTranslations("studentRafiqi");
  const profileTemplate = useMemo<ProfileItem[]>(
    () => [
      {
        id: "likes",
        title: t("profile.items.likes.title"),
        value: "",
        confidence: "forming",
        tone: "bg-assistant text-assistant-foreground",
      },
      {
        id: "dislikes",
        title: t("profile.items.dislikes.title"),
        value: "",
        confidence: "forming",
        tone: "bg-secondary text-secondary-foreground",
      },
      {
        id: "learning",
        title: t("preferences.title"),
        value: "",
        confidence: "forming",
        tone: "bg-info text-info-foreground",
      },
    ],
    [t],
  );
  const [initialState] = useState(() =>
    loadInitialProfile(profileTemplate, t("profile.storageNotice")),
  );
  const [profile, setProfile] = useState<ProfileItem[]>(initialState.profile);
  const [draftProfile, setDraftProfile] = useState<ProfileItem[]>(initialState.profile);
  const [stage, setStage] = useState(initialState.stage);
  const [isEditing, setIsEditing] = useState(false);
  const [storageNotice, setStorageNotice] = useState(initialState.storageNotice);
  const [status, setStatus] = useState("");
  const [focusRequest, setFocusRequest] = useState(0);

  function persistProfile(nextProfile: ProfileItem[], nextStage: number) {
    const entries = nextProfile.map(({ id, value, confidence }) => ({
      id,
      value,
      confidence,
    }));

    try {
      window.sessionStorage.setItem(
        profileStorageKey,
        JSON.stringify({ version: 1, stage: nextStage, entries } satisfies StoredProfile),
      );
    } catch {
      setStorageNotice(t("profile.storageNotice"));
    }
  }

  const isOnboarding = stage < profileIds.length;
  const onboardingPrompt =
    stage === 1
      ? t("onboarding.afterLikes")
      : stage === 2
        ? t("onboarding.afterDislikes")
        : t("onboarding.opening");
  const response =
    stage === 0
      ? t("onboarding.afterLikes")
      : stage === 1
        ? t("onboarding.afterDislikes")
        : stage === 2
          ? t("onboarding.complete")
          : t("conversation.followUp");
  const suggestions =
    stage === 0
      ? [
          t("onboarding.likesSuggestions.one"),
          t("onboarding.likesSuggestions.two"),
          t("onboarding.likesSuggestions.three"),
        ]
      : stage === 1
        ? [
            t("onboarding.dislikesSuggestions.one"),
            t("onboarding.dislikesSuggestions.two"),
            t("onboarding.dislikesSuggestions.three"),
          ]
        : stage === 2
          ? [
              t("onboarding.learningSuggestions.one"),
              t("onboarding.learningSuggestions.two"),
              t("onboarding.learningSuggestions.three"),
            ]
          : [];
  const messages: RafiqiMessage[] = isOnboarding
    ? [{ author: "rafiqi", text: onboardingPrompt }]
    : [
        { author: "rafiqi", text: t("conversation.opening") },
        { author: "student", text: t("conversation.studentReply") },
        { author: "rafiqi", text: t("conversation.response") },
        ...(initialPrompt?.trim()
          ? [
              { author: "student" as const, text: initialPrompt.trim() },
              { author: "rafiqi" as const, text: t("conversation.followUp") },
            ]
          : []),
      ];
  const hasDraftChanges = profile.some(
    (item, index) =>
      item.value !== draftProfile[index]?.value ||
      item.confidence !== draftProfile[index]?.confidence,
  );

  function handleOnboardingAnswer(message: string) {
    const profileId = profileIds[stage];
    if (!profileId) return;

    const answer = message.trim().slice(0, maxProfileAnswerLength);
    const nextStage = stage + 1;
    const confidence: ProfileConfidence = profileId === "dislikes" ? "forming" : "confident";
    const value =
      profileId === "likes"
        ? t("profile.items.likes.value", { answer })
        : profileId === "dislikes"
          ? t("profile.items.dislikes.value", { answer })
          : t("profile.items.learning.value", { answer });
    const nextProfile = profile.map((item) =>
      item.id === profileId ? { ...item, value, confidence } : item,
    );

    setProfile(nextProfile);
    setDraftProfile(nextProfile);
    setStage(nextStage);
    persistProfile(nextProfile, nextStage);
    setStatus(
      nextStage === profileIds.length
        ? t("onboarding.profileReady")
        : t("onboarding.profileUpdated"),
    );
  }

  function skipOnboarding() {
    setProfile(profileTemplate);
    setDraftProfile(profileTemplate);
    setStage(profileIds.length);
    persistProfile(profileTemplate, profileIds.length);
    setStatus(t("onboarding.skipped"));
  }

  function startEditing() {
    setDraftProfile(profile);
    setIsEditing(true);
    setStatus("");
  }

  function updateDraft(id: ProfileItemId, value: string) {
    setDraftProfile((current) =>
      current.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  }

  function saveProfile() {
    const nextProfile = draftProfile.map((item) => ({
      ...item,
      value: item.value.trim(),
    }));
    setProfile(nextProfile);
    setDraftProfile(nextProfile);
    setIsEditing(false);
    persistProfile(nextProfile, stage);
    setStatus(t("profile.saved"));
  }

  function cancelEditing() {
    setDraftProfile(profile);
    setIsEditing(false);
    setStatus(t("profile.cancelled"));
  }

  function focusConversation() {
    setFocusRequest((current) => current + 1);
    setStatus(t("profile.discussionReady"));
  }

  return (
    <div
      className="mx-auto flex w-full max-w-295 flex-col gap-4 pb-2 sm:gap-5"
      data-testid="student-rafiqi-page"
    >
      <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-page font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-base text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button type="button" variant="outline" className="mt-2 w-fit bg-card sm:mt-0">
          {t("course")}
          <BookOpenText aria-hidden="true" />
        </Button>
      </header>

      <section
        className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.03fr)_minmax(20rem,.97fr)]"
        aria-label={t("workspaceLabel")}
      >
        <RafiqiConversation
          title={t("conversation.title")}
          context={isOnboarding ? t("onboarding.context") : t("conversation.context")}
          messages={messages}
          suggestions={suggestions}
          placeholder={isOnboarding ? t("onboarding.placeholder") : t("conversation.placeholder")}
          sendLabel={t("conversation.send")}
          response={response}
          time={t("conversation.time")}
          attachment={
            isOnboarding
              ? undefined
              : {
                  name: t("conversation.attachmentName"),
                  meta: t("conversation.attachmentMeta"),
                }
          }
          onStudentMessage={isOnboarding ? handleOnboardingAnswer : undefined}
          focusRequest={focusRequest}
        />

        <aside className="flex min-w-0 flex-col gap-3">
          <Card className="relative overflow-hidden py-4 shadow-surface xl:min-h-[29rem]">
            <CardHeader className="relative z-10 flex-row items-start gap-3 xl:pe-44">
              <div>
                <CardTitle className="text-card-title">{t("profile.title")}</CardTitle>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {isOnboarding ? t("onboarding.profileIntro") : t("profile.description")}
                </p>
              </div>
              {isOnboarding ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ms-auto"
                  onClick={skipOnboarding}
                >
                  {t("onboarding.skip")}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ms-auto"
                  onClick={startEditing}
                >
                  <Pencil aria-hidden="true" />
                  {t("edit")}
                </Button>
              )}
            </CardHeader>
            <CardContent className="relative z-10 grid gap-3 xl:pe-44">
              {storageNotice ? (
                <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive" role="alert">
                  {storageNotice}
                </p>
              ) : null}
              {status ? (
                <p className="rounded-lg bg-success px-3 py-2 text-xs leading-5 text-success-foreground" role="status">
                  {status}
                </p>
              ) : null}

              {isEditing ? (
                <div className="grid gap-3">
                  {draftProfile.map((item) => (
                    <div className="grid gap-1.5" key={item.id}>
                      <Label className="text-xs font-semibold" htmlFor={`profile-${item.id}`}>
                        {item.title}
                      </Label>
                      <Input
                        id={`profile-${item.id}`}
                        value={item.value}
                        maxLength={maxProfileAnswerLength}
                        onChange={(event) => updateDraft(item.id, event.target.value)}
                        placeholder={t("profile.emptyValue")}
                      />
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button type="button" size="sm" onClick={saveProfile} disabled={!hasDraftChanges}>
                      <Check aria-hidden="true" />
                      {t("profile.save")}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={cancelEditing}>
                      {t("profile.cancel")}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {profile.map((item) => {
                    const isConfident = item.confidence === "confident";
                    return (
                      <div className="flex gap-3 rounded-lg border border-border/80 bg-background/60 p-3" key={item.id}>
                        <span className={`grid size-10 shrink-0 place-items-center rounded-full ${item.tone}`}>
                          <ProfileIcon id={item.id} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <strong className="text-sm">{item.title}</strong>
                            <span
                              className={
                                isConfident
                                  ? "inline-flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-[0.65rem] font-semibold text-success-foreground"
                                  : "inline-flex items-center gap-1 rounded-full bg-assistant px-2 py-0.5 text-[0.65rem] font-semibold text-assistant-foreground"
                              }
                            >
                              {isConfident ? <Check className="size-3" aria-hidden="true" /> : <Sparkles className="size-3" aria-hidden="true" />}
                              {isConfident
                                ? t("profile.status.confident")
                                : t("profile.status.forming")}
                            </span>
                          </span>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {item.value || t("profile.emptyValue")}
                          </p>
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                    <Button type="button" variant="outline" size="sm" onClick={startEditing}>
                      {t("notQuiteMe")}
                    </Button>
                    <Button type="button" variant="secondary" size="sm" onClick={focusConversation}>
                      <Sparkles aria-hidden="true" />
                      {t("discuss")}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
            <Image
              src="/images/rafiqi-learner.png"
              alt={t("preferences.illustrationAlt")}
              width={420}
              height={420}
              className="pointer-events-none absolute -bottom-12 end-0 hidden w-52 object-contain xl:block"
            />
          </Card>

          <Card className="gap-3 py-4 shadow-surface">
            <CardHeader className="flex-row items-center gap-3">
              <CardTitle className="text-card-title">{t("goals.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-success text-success-foreground">
                  <Flag className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <strong className="block text-sm">{t("goals.empty.title")}</strong>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                    {t("goals.empty.description")}
                  </p>
                </span>
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={focusConversation}>
                <Target aria-hidden="true" />
                {t("goals.empty.action")}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}

export function StudentRafiqiPage({ initialPrompt }: { initialPrompt?: string }) {
  const t = useTranslations("studentRafiqi");
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return <StudentRafiqiLoading label={t("onboarding.loading")} title={t("title")} />;
  }

  return <StudentRafiqiWorkspace initialPrompt={initialPrompt} />;
}
