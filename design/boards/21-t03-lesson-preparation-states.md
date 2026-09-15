# Board 21 - T03 lesson-preparation states

![T03 lesson-preparation states](21-t03-lesson-preparation-states.png)

## Purpose

Proposed desktop state reference for **B2 Generate lesson prep with AI**, **B3 Edit generated prep**, and **B6 Review class misconceptions**. It extends the existing **T03 · Teacher · Prepare and teach (Before class)** structure in [Board 02](02-teacher-prepare-live.png); it is not a separate generation workflow or dashboard.

## States shown

1. **Generation in progress:** a compact lavender status strip while the real T03 cards remain visible.
2. **Generated draft review:** AI-draft labels plus explicit Keep and Regenerate decisions before the draft is active.
3. **Generation failure:** an inline error and Retry action inside the affected lesson card.
4. **Edit and reorder:** inline objective editing, question controls, lesson-flow ordering, Save changes, and Cancel.
5. **Unsaved/discard:** a visible unsaved indicator and a confirmation modal before discarding edits.
6. **Warm-up misconceptions:** a compact, privacy-safe panel with ranked misconception, count, anonymized evidence, and a teaching suggestion.

## Implementation rules

- Preserve the existing T03 sidebar, header, lesson context, Before-class tab, objective, Socratic questions, materials, lesson flow, and checks.
- Keep generated content visibly labeled and teacher-controlled; do not publish it automatically.
- Place errors, progress, review, and save feedback in context rather than sending the teacher to another screen.
- A misconception item may show only approved, privacy-safe aggregation and anonymized evidence.
- This is a UI specification only. Generation, data storage, warm-up aggregation, permissions, and saving require later services.

## Decision status

**Approved for the B2/B3/B6 frontend slice on 2026-09-13.** The implementation remains local UI state only; it does not authorize generation, saving, student-data aggregation, or permissions services.
