export type QuestionFormat = "mcq" | "short_note"

export type AssignmentStatus = "draft" | "distributed" | "closed"

export type StudentAssignmentStatus = "assigned" | "in_progress" | "submitted" | "graded" | "approved"

export interface MCQOption {
  id: string
  text: string
}

// Teacher-facing question (includes correct answer)
export interface QuestionTeacher {
  id: string
  assignment_id: string
  question_text: string
  format: QuestionFormat
  options: MCQOption[]
  concept_ref: string | null
  hints: string[]
  order: number
  correct_answer: string | null
}

// Student-facing question (no correct answer until after submission)
export interface QuestionStudent {
  id: string
  assignment_id: string
  question_text: string
  format: QuestionFormat
  options: MCQOption[]
  concept_ref: string | null
  hint_count: number
  revealed_hint_count: number
  order: number
}

export interface AssignmentRead {
  id: string
  school_id: string
  teacher_id: string
  grade_level: string
  subject: string
  chapter: string
  lesson_id: string
  title: string
  description: string | null
  status: AssignmentStatus
  due_at: string | null
  created_at: string
  updated_at: string
  question_count: number
}

export interface AssignmentWithQuestions extends AssignmentRead {
  questions: QuestionTeacher[]
}

export interface StudentAssignmentRead {
  id: string
  assignment_id: string
  grade_level: string
  subject: string
  chapter: string
  lesson_id: string
  title: string
  description: string | null
  status: StudentAssignmentStatus
  score: number | null
  due_at: string | null
  submitted_at: string | null
  question_count: number
}

export interface StudentAssignmentWithQuestions extends StudentAssignmentRead {
  questions: QuestionStudent[]
}

export interface AttemptResult {
  question_id: string
  answer: string
  teacher_score: number | null
  teacher_comment: string | null
}

export interface SubmissionResult {
  student_assignment_id: string
  status: StudentAssignmentStatus
  score: number | null
  results: AttemptResult[]
}

export interface TeacherSubmission {
  student_assignment_id: string
  student_id: string
  student_name: string
  status: StudentAssignmentStatus
  score: number | null
  submitted_at: string | null
  approved_at: string | null
  attempts: { question_id: string; question_text: string; format: QuestionFormat; answer: string; correct_answer: string | null; hints_revealed: number; teacher_score: number | null; teacher_comment: string | null }[]
}

export interface ConceptGap {
  concept_ref: string
  avg_mastery: number
  student_count: number
  confidence: "forming" | "developing" | "solid"
}

export interface GapDigestRead {
  lesson_id: string
  student_coverage: number
  total_students: number
  coverage_sufficient: boolean
  gaps: ConceptGap[]
}

// Request shapes
export interface CreateAssignmentRequest {
  grade_level: string
  subject: string
  chapter: string
  lesson_id: string
  title: string
  description?: string
  due_at?: string
}

export interface UpdateAssignmentRequest {
  grade_level?: string
  subject?: string
  chapter?: string
  title?: string
  description?: string | null
  due_at?: string | null
}

export interface AddQuestionRequest {
  question_text: string
  format: QuestionFormat
  options: MCQOption[]
  correct_answer?: string | null
  hints: string[]
  concept_ref?: string
  order?: number
}

export interface UpdateQuestionRequest {
  question_text?: string
  options?: MCQOption[]
  correct_answer?: string
  hints?: string[]
  concept_ref?: string
  order?: number
}

export interface DistributeRequest {
  due_at?: string
}

export interface AnswerInput {
  question_id: string
  answer: string
}

export interface SubmitHomeworkRequest {
  answers: AnswerInput[]
}
