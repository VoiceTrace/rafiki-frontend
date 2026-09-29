# Board 39 — E1 Student: MCQ Homework Quiz

![MCQ unanswered](E1-S04-student-homework-mcq.png)
![MCQ with answers selected](E1-S05-student-homework-mcq-answered.png)

## Purpose

Desktop reference for **E1 Student Homework** — the quiz-taking view where a student answers MCQ questions for a distributed assignment.

## Approval

**Implemented and live (2026-09-22).** Corresponds to route `/student/homework/{studentAssignmentId}`.

**2026-09-29 approved extension:** Homework has no chat or AI controls. Each
question exposes three teacher-authored static hints progressively, before
submission.

## Required UI

### Header
- Back arrow → `/student/homework` list.
- Assignment title and optional description.

### Question cards
- One card per question, numbered (1, 2, 3…).
- Question stem in card header.
- Options A–D as full-width buttons, each showing the letter prefix and option text.
- Clicking an option highlights it with a primary-color border and fill; previous selection for that question is cleared.
- A student can reveal hint 1, then hint 2, then hint 3. Hints are static content
  authored with the question; they do not call an AI service.

### Answer states (before submission)
- Unselected: neutral border, light secondary fill.
- Selected: primary (orange) border and tint, bold text.

### Submit button
- Full-width, at the bottom of the question list.
- **Disabled** until every question has a selection (`allAnswered`).
- Shows a loading spinner while the request is in flight.

## Security

The API endpoint `GET /homework/me/assignments/{id}` never returns `correct_answer` for any question — only question text and option text. The correct answer is only revealed after the student submits.
