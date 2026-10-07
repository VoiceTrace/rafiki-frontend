"use server";
import { revalidatePath } from "next/cache";
import { addClassStudent, assignLibraryResource, createTeacherClass, loadClassRoster, saveLibraryResource, uploadLibraryResource } from "../server/resource-api";

export async function createResourceAction(input: Parameters<typeof saveLibraryResource>[0]) {
  const value = await saveLibraryResource(input);
  revalidatePath("/en/teacher/resources");
  revalidatePath("/ar/teacher/resources");
  return value;
}
export async function uploadResourceAction(form: FormData) {
  const value = await uploadLibraryResource(form);
  revalidatePath("/en/teacher/resources");
  revalidatePath("/ar/teacher/resources");
  return value;
}
export async function assignResourceAction(input: Parameters<typeof assignLibraryResource>[0]) {
  const value = await assignLibraryResource(input);
  revalidatePath("/en/teacher/resources");
  revalidatePath("/ar/teacher/resources");
  return value;
}
export async function createClassAction(input: Parameters<typeof createTeacherClass>[0], locale: string) {
  const value = await createTeacherClass(input, locale);
  revalidatePath("/en/teacher/resources");
  revalidatePath("/ar/teacher/resources");
  return value;
}
export async function loadClassRosterAction(classId: string) { return loadClassRoster(classId); }
export async function addClassStudentAction(classId: string, studentId: string) { return addClassStudent(classId, studentId); }
