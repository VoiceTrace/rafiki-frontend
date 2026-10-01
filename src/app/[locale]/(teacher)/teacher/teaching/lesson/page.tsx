import { getBackendAccessToken } from "@/features/auth/server/dal"
import { TeacherLessonPage } from "@/features/teacher-lesson/components/teacher-lesson-page"
import {
  getAssignment,
  listAssignments,
  listHomeworkSubmissions,
  listStudyChapters,
  listStudyLessons,
  listStudySubjects,
  listUsers,
} from "@/lib/api"

type SearchParams = {
  grade?: string
  subject_id?: string
  chapter_id?: string
  lesson_id?: string
  assignment_id?: string
  stage?: string
}

export default async function Page({ params, searchParams }: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const [{ locale }, query, token] = await Promise.all([params, searchParams, getBackendAccessToken()])
  if (!token) return <TeacherLessonPage data={{ status: "permission" }} />

  try {
    const [students, subjects] = await Promise.all([listUsers(token, "student"), listStudySubjects(token, locale)])
    const grades = [...new Set(students.filter((student) => student.is_active && student.grade_level).map((student) => student.grade_level!))].sort()
    const selectedGrade = grades.includes(query.grade ?? "") ? query.grade! : grades[0] ?? ""
    const selectedSubject = subjects.find((subject) => subject.id === query.subject_id) ?? subjects[0] ?? null
    const chapters = selectedSubject ? await listStudyChapters(token, selectedSubject.id, locale) : []
    const selectedChapter = chapters.find((chapter) => chapter.id === query.chapter_id) ?? chapters[0] ?? null
    const lessons = selectedChapter ? await listStudyLessons(token, selectedChapter.id, locale) : []
    const selectedLesson = lessons.find((lesson) => lesson.id === query.lesson_id) ?? lessons[0] ?? null
    const assignments = selectedLesson ? await listAssignments(token, selectedLesson.id) : []
    const assignmentSummary = assignments.find((assignment) => assignment.id === query.assignment_id) ?? assignments[0] ?? null
    const assignment = assignmentSummary ? await getAssignment(token, assignmentSummary.id) : null
    const submissions = assignment && assignment.status !== "draft" ? await listHomeworkSubmissions(token, assignment.id) : []

    return <TeacherLessonPage data={{
      status: "ready", grades, selectedGrade, subjects, chapters, lessons,
      selectedSubjectId: selectedSubject?.id ?? "", selectedChapterId: selectedChapter?.id ?? "",
      selectedLesson, assignments, assignment, submissions,
      activeStudentCount: students.filter((student) => student.is_active && student.grade_level === selectedGrade).length,
      initialStage: ["before", "during", "insights", "after", "homework"].includes(query.stage ?? "") ? query.stage! : "before",
    }} />
  } catch {
    return <TeacherLessonPage data={{ status: "error" }} />
  }
}
