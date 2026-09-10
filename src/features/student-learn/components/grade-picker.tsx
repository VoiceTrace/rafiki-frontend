"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function GradePicker() {
  const t = useTranslations("studentLearn");
  const [grade, setGrade] = useState("10");
  return (
    <Select value={grade} onValueChange={(value) => value && setGrade(value)}>
      <SelectTrigger aria-label={t("gradeLabel")} className="h-10 min-w-32 bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {["9", "10", "11"].map((value) => (
            <SelectItem key={value} value={value}>{t("grade", { value })}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
