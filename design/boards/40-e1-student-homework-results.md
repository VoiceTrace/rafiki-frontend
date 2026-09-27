# Board 40 — E1 Student: Homework Results

![Homework results with score and correct/incorrect highlighting](E1-S06-student-homework-results.png)

## Purpose

Desktop reference for **E1 Student Homework** — the results view shown immediately after a student submits their MCQ answers.

## Approval

**Implemented and live (2026-09-22).** Same route as the MCQ view (`/student/homework/{studentAssignmentId}`); the component transitions to results state in-place after a successful submit.

## Required UI

2026-09-27 approved clarification: results must survive reload and return visits.
The submit-response-only restriction below is deprecated in favor of the
[manual MCQ maintenance scope](../../docs/RAFIQI_PRODUCT_AND_DESIGN_REFERENCE.md#approved-homework-maintenance-scope--2026-09-27):
an authenticated, student-owned results endpoint may return the saved feedback
after submission. Pre-submission GET responses still exclude the answer key.

### Score banner
- Green success container at top of page.
- Check-circle icon.
- "Submitted!" heading.
- Score line: `{correct} / {total} correct · {percent}%`.

### Question cards (post-submission state)
Each option within a card renders in one of three styles:

| Condition | Style |
|---|---|
| Correct answer (whether or not selected) | Green border + tint, bold text, green check-circle icon |
| Student's wrong selection | Red/destructive border + tint, red X-circle icon |
| Other unselected wrong options | Neutral border, reduced opacity (60%) |

- All option buttons are disabled (no further interaction).
- Submit button is hidden once results are shown.

### Mastery side-effect
On submission the backend writes a `MasteryRecord` per question concept, which feeds into the student's learning profile and the teacher's gap-digest view.

## Security

`correct_answer` is returned in the submit response only, never in the pre-submission GET. The client receives it as part of `SubmissionResult.results[]` and only displays it after a successful `POST /homework/me/assignments/{id}/submit`.
