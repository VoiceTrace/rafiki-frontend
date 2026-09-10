"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export function ThemePreview() {
  const t = useTranslations("themePreview");
  const locale = useLocale();
  const [pressed, setPressed] = useState(false);
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-page font-bold">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("description")}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("buttons")}</CardTitle>
            <CardDescription>{t("interactive")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button aria-pressed={pressed} onClick={() => setPressed(!pressed)}>
              {pressed ? t("pressed") : t("primary")}
            </Button>
            <Button variant="outline">{t("outline")}</Button>
            <Button variant="secondary">{t("secondary")}</Button>
            <Button variant="ghost">{t("quiet")}</Button>
            <Button disabled>{t("disabled")}</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("fields")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field>
              <FieldLabel htmlFor="theme-name">{t("input")}</FieldLabel>
              <Input id="theme-name" placeholder={t("placeholder")} />
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="theme-invalid">{t("invalid")}</FieldLabel>
              <Input
                id="theme-invalid"
                aria-invalid="true"
                placeholder={t("placeholder")}
              />
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="theme-check" />
              <FieldLabel htmlFor="theme-check">{t("checkbox")}</FieldLabel>
            </Field>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("surfaces")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-lg bg-secondary p-4 text-secondary-foreground">
              {t("secondary")}
            </div>
            <div className="rounded-lg bg-assistant p-4 text-assistant-foreground">
              {t("assistant")}
            </div>
            <div className="rounded-lg bg-success p-4 text-success-foreground">
              {t("success")}
            </div>
            <div className="rounded-lg bg-muted p-4 text-muted-foreground">
              {t("muted")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("dialog")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                {t("open")}
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                <DialogTitle>{t("dialog")}</DialogTitle>
                <DialogDescription>{t("interactive")}</DialogDescription>
                <DialogClose render={<Button />}>{t("close")}</DialogClose>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
