"use client";
import {ChevronLeft,ChevronRight,Plus} from "lucide-react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {Card,CardContent,CardHeader,CardTitle} from "@/components/ui/card";
import {Link} from "@/i18n/navigation";

export function SchedulePreview(){
 const t=useTranslations("studentLearn.week");
 const schedule=[
  {time:t("timeOne"),subject:t("math"),detail:t("roomOne")},
  {time:t("timeTwo"),subject:t("physics"),detail:t("physicsDetail"),current:true},
  {time:t("timeThree"),subject:t("english"),detail:t("roomTwo")},
  {time:t("timeFour"),subject:t("computerScience"),detail:t("roomThree")},
  {time:t("timeFive"),subject:t("pe"),detail:t("sportsHall")}];
 return <Card className="self-start gap-3 py-4 shadow-surface" data-testid="learning-week-compact">
  <CardHeader className="grid grid-cols-[1fr_auto] items-center px-4"><CardTitle className="font-semibold">{t("scheduleTitle")}</CardTitle><div className="flex rounded-lg bg-muted p-1"><span className="rounded-md bg-secondary px-2.5 py-1.5 text-xs font-semibold text-secondary-foreground shadow-sm">{t("day")}</span><Link href="/student/learn?view=schedule&calendar=week" className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-card">{t("week")}</Link><Link href="/student/learn?view=schedule&calendar=month" className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-card">{t("month")}</Link></div></CardHeader>
  <CardContent className="px-3 sm:px-4"><div className="mb-3 grid grid-cols-[auto_1fr_auto] items-center gap-2"><Button variant="outline" size="icon-sm" aria-label={t("previous")}><ChevronLeft className="rtl:-scale-x-100"/></Button><strong className="text-center text-xs">{t("date")}</strong><Button variant="outline" size="icon-sm" aria-label={t("next")}><ChevronRight className="rtl:-scale-x-100"/></Button></div>
   <ol className="flex flex-col gap-1.5">{schedule.map(item=><li key={item.time+item.subject} className="grid grid-cols-[3.6rem_1fr] gap-2 text-xs"><time className="pt-2 font-medium text-muted-foreground">{item.time}</time><div className={item.current?"relative rounded-md bg-secondary px-3 py-2 ps-4":"rounded-md bg-muted px-3 py-2"}>{item.current&&<span className="absolute inset-y-0 start-0 w-1 rounded-full bg-primary"/>}<strong className="block">{item.subject}</strong><span className="block text-foreground/70">{item.detail}</span></div></li>)}</ol>
   <Button className="mt-4 w-full bg-secondary-foreground hover:bg-secondary-foreground/90" size="lg"><Plus data-icon="inline-start"/>{t("add")}</Button>
  </CardContent>
 </Card>
}
