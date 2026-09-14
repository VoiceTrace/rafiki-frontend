# Board 22 - T03 lesson-preparation states, mobile Arabic RTL

![T03 lesson-preparation states mobile Arabic RTL](22-t03-lesson-preparation-mobile-arabic.png)

## Purpose

Proposed mobile Arabic RTL companion to [Board 21](21-t03-lesson-preparation-states.md). It retains the Teacher T03 Before-class content in compact expandable cards while defining bilingual responsive direction for B2, B3, and B6.

## States shown

1. Generation in progress above the existing preparation cards.
2. Generated-draft review with approval, cancel, and regeneration actions.
3. Edit/reorder and unsaved-change save/cancel controls.
4. Warm-up misconception summary with populated evidence plus compact processing, empty, and failure variants.

## Implementation rules

- Use full Arabic RTL structure, logical properties, and mirrored directional controls.
- Preserve lesson context, phase tabs, objective, questions, materials, flow, and checks; use expansion rather than removing content for a small screen.
- Keep approval, retry, save, cancel, and error actions explicit and touch friendly.
- Validate Arabic product copy with the team before release; generated text is visual direction only.

## Decision status

**Approved for the B2/B3/B6 frontend slice on 2026-09-13.** This direction is local UI only and does not authorize backend generation, saving, or student-response analysis.
