import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AssignmentWithQuestions, TeacherSubmission } from "@/types/homework"

export function TeacherHomeworkResults({ assignment, submissions }: { assignment: AssignmentWithQuestions; submissions: TeacherSubmission[] }) {
  return <Card><CardHeader><CardTitle>{assignment.title}</CardTitle></CardHeader><CardContent>{submissions.length} submissions</CardContent></Card>
}
