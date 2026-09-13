import { notFound } from "next/navigation";
import { StudentHomeworkDetail } from "@/features/student-homework/components/student-homework-page";
import { isHomeworkId } from "@/features/student-homework/homework-data";

export default async function Page({
  params,
}: {
  params: Promise<{ homeworkId: string }>;
}) {
  const { homeworkId } = await params;
  if (!isHomeworkId(homeworkId)) notFound();
  return <StudentHomeworkDetail homeworkId={homeworkId} />;
}
