"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";
import { CardTitle } from "@/components/ui/card";

export function StudyCaveCardTitle({ icon: Icon, children, tone = "text-primary" }: { icon: LucideIcon; children: ReactNode; tone?: string }) {
  return <CardTitle className="flex items-center gap-2 text-base font-bold"><Icon className={cn("size-5", tone)} aria-hidden="true" />{children}</CardTitle>;
}
