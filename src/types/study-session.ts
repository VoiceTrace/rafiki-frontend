export type SessionStatus = "open" | "in_progress" | "closed"
export type SessionStage = "setup" | "review" | "check_in" | "deepen" | "wrap_up"
export type MasteryConfidence = "forming" | "developing" | "solid"

export interface StudySession {
  id: string
  school_id: string
  student_id: string
  lesson_id: string
  status: SessionStatus
  current_stage: SessionStage
  current_concept_index: number
  concepts_order: string[] | null
  summary_card: SummaryCard | null
  started_at: string
  closed_at: string | null
  updated_at: string
}

export interface SummaryCard {
  summary_text: string
  strong_concepts: string[]
  gap_concepts: string[]
  encouragement: string
}

export interface StudySessionWithQuestions extends StudySession {
  questions: Question[]
}

export interface Question {
  id: string
  session_id: string
  concept_ref: string
  stage: string
  question_text: string
  created_at: string
}

export interface Attempt {
  id: string
  question_id: string
  correctness_score: number
  error_type: string | null
  hint_level: number
  attempt_number: number
  created_at: string
}

export interface AttemptResult {
  attempt: Attempt
  feedback: string
  hint_text: string | null
  hint_level: number
  concept_confirmed: boolean
  max_attempts_reached: boolean
  session_stage: string
}

export interface MasteryRecord {
  id: string
  lesson_id: string
  concept_ref: string
  attempt_count: number
  correct_count: number
  mastery_level: number
  dominant_error_type: string | null
  confidence: MasteryConfidence
  last_attempt_at: string | null
  updated_at: string
}
