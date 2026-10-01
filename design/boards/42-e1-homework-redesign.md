# Board 42 — E1 Homework redesign

## Approval

Approved 2026-10-01. This decision supersedes conflicting layout and interaction details in Boards 36–40 while preserving their manual-assessment API contract.

## Teacher lesson workspace

- Homework lives in the selected lesson workspace after Before, During, Class insights, and After.
- Subject, chapter, and lesson come from the lesson selectors. Grade comes from the teacher's active student context.
- The builder is MCQ-only: two to six unique options, exactly one correct option, a required concept tag, and up to three ordered static hints.
- Teachers can add, edit, delete, reorder, preview, save a draft, and distribute to every active student in the selected grade.
- Distribution locks the assignment.
- Distributed homework shows submission progress, average approved/graded score, students still working, concept struggles, and a per-student review flow with answer scores, optional comments, and final approval.
- Rafiqi suggestions are outside this redesign because there is no AI suggestions endpoint.

## Student flow

- Study Cave Homework shows available assignments and subject/chapter/lesson filters. `/student/homework` remains an entry redirect to this phase.
- One MCQ appears per screen. `?q=N` preserves the current question through refresh; dots allow direct navigation.
- Answers stay in client state while navigating and are persisted only on final submission.
- Hints reveal sequentially and persist through the existing API. No chat or AI control appears in homework.
- The final review lists answered and unanswered questions and uses a confirmation dialog. Submission makes the homework read-only.
- Submitted and graded work shows a waiting state. Approved work releases the score and teacher feedback; the correct answer remains hidden because the approved-results API does not return it.
- Overdue work remains submittable and is marked late in the UI from the due and submission timestamps.

## Shared requirements

English and Arabic use next-intl, RTL uses logical layout and mirrored directional icons, student work is mobile-first, option selection uses an accessible radio group, hints use an announced live region, and every mutation disables controls while saving and reports success or failure.
