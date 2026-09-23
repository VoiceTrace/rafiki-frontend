export type ReviewSubject = { id: string; title: string };
export type ReviewChapter = ReviewSubject & { subject_id: string };
export type ReviewLesson = { id: string; title: string; subject_id: string; chapter_id: string; concept_refs: { id: string; title: string; description: string }[]; subject: string; chapter: string; objective: string; key_points: string[] };
export type ReviewQuestion = { id: string; kind: "choice" | "written"; text: string; options: { id: string; text: string }[] };
export type ReviewEvent = { role: "assistant" | "student"; kind: "text" | "question" | "answer" | "feedback" | "hint" | "action" | "complete"; text?: string; action?: "hint" | "help" | "next"; question_id?: string; score?: number; level?: number; option_id?: string; attempt?: number };
export type ReviewSession = { id: string; lesson_id: string; lesson: ReviewLesson; version: number; mock: boolean; complete: boolean; resolved: boolean; can_hint: boolean; attempts: number; hint_level: number; current_question_id: string; total_questions: number; questions: ReviewQuestion[]; messages: ReviewEvent[] };
export type ReviewData = { subjects: ReviewSubject[]; chapters: ReviewChapter[]; subjectId?: string; chapterId?: string; lessons: ReviewLesson[]; lesson: ReviewLesson | null; session: ReviewSession | null; error: boolean };
export type ReviewCommand = { request_id: string; expected_version: number; action: "chat" | "answer" | "hint" | "help" | "next"; question_id?: string; text?: string; option_id?: string; locale: "en" | "ar" };
