import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "cn";

export function DashboardSectionCard({
  icon: Icon,
  title,
  action,
  children,
  className,
  contentClassName,
}: {
  icon?: LucideIcon;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card className={cn("gap-3 py-4 shadow-surface", className)}>
      <CardHeader className="items-center px-4 sm:px-5">
        <CardTitle className="flex items-center gap-2 font-semibold">
          {Icon ? <Icon className="size-5 text-primary" aria-hidden="true" /> : null}
          {title}
        </CardTitle>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className={cn("px-4 sm:px-5", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
