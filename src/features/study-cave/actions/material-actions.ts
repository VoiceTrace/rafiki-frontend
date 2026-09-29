"use server";
import { revalidatePath } from "next/cache";
import { setStudentMaterialCompletion } from "@/features/teacher-resources/server/resource-api";

export async function updateMaterialCompletion(lessonId: string, assignmentId: string, completed: boolean) {
  const result = await setStudentMaterialCompletion(lessonId, assignmentId, completed);
  revalidatePath("/en/student/study-cave");
  return result;
}
