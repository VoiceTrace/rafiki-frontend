export type QuestionFormat = "mcq"

export type AssignmentStatus = "draft" | "distributed" | "closed"

export type StudentAssignmentStatus = "assigned" | "in_progress" | "submitted"

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
  order: number
  correct_answer: string
}

// Student-facing question (no correct answer until after submission)
export interface QuestionStudent {
  id: string
  assignment_id: string
  question_text: string
  format: QuestionFormat
  options: MCQOption[]
  concept_ref: string | null
  order: number
}

export interface AssignmentRead {
  id: string
  school_id: string
  teacher_id: string
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
  selected_option: string
  is_correct: boolean
  correctness_score: number
  correct_answer: string
}

export interface SubmissionResult {
  student_assignment_id: string
  score: number
  correct_count: number
  total_count: number
  results: AttemptResult[]
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
  lesson_id: string
  title: string
  description?: string
  due_at?: string
}

export interface UpdateAssignmentRequest {
  title?: string
  description?: string
  due_at?: string
}

export interface AddQuestionRequest {
  question_text: string
  options: MCQOption[]
  correct_answer: string
  concept_ref?: string
  order?: number
}

export interface UpdateQuestionRequest {
  question_text?: string
  options?: MCQOption[]
  correct_answer?: string
  concept_ref?: string
  order?: number
}

export interface DistributeRequest {
  student_ids: string[]
  due_at?: string
}

export interface AnswerInput {
  question_id: string
  selected_option: string
}

export interface SubmitHomeworkRequest {
  answers: AnswerInput[]
}
