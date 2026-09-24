# Frontend architecture

## Purpose and scope

This living document records the React/Next.js frontend structure, component ownership decisions, and shadcn audit for Rafiqi. It was initialized on 2026-09-15 from the full component-architecture review and the approved high-value refactor work.

## Route and layout map

| Area | Entry point | Ownership |
| --- | --- | --- |
| Application root | `src/app/layout.tsx` | Global document metadata, fonts, language, and direction |
| Localized app | `src/app/[locale]/layout.tsx` | `next-intl` request provider and locale validation |
| Authentication | `src/app/[locale]/(auth)` | Auth pages framed by `features/auth` |
| Teacher app | `src/app/[locale]/(teacher)` | Authenticated teacher shell and teacher feature entry points |
| Student app | `src/app/[locale]/(student)` | Authenticated student shell and student feature entry points |
| APIs | `src/app/api` | NextAuth and current-user route handlers |

Routes should stay thin: validate route input, do server-only access work, then render a feature entry component.

## Component structure

### Shared application components

- `src/components/shared/app-shell.tsx` — client-side navigation, locale switcher, search, and mobile shell.
- `src/components/shared/empty-state-page.tsx` — shared not-found and coming-soon presentation.
- `src/components/shared/lesson-stage-tabs.tsx` — shared interactive stage control for compatible lesson flows.
- `src/components/shared/rafiqi-conversation.tsx` — shared interactive conversation composition.
- `src/components/shared/theme-preview.tsx` — development-only theme preview.

### UI primitives

`src/components/ui` contains the project’s shadcn/Base UI primitives: Button, Card, Checkbox, Dialog, Field, Input, Label, Select, Separator, Skeleton, Spinner, and Textarea.

### Feature-local structures

- `features/auth` — forms, server actions, schemas, data access, and auth framing.
- `features/student-learn` — learning map plus the schedule. The schedule is organized as a stateful `StudentSchedule` coordinator and local calendar parts in `components/calendar/`.
- `features/study-cave` — Study Cave orchestration, feature-local phase tabs, card title, question card, after-class review, and homework panel.
- `features/teacher-lesson` — lesson orchestration, preparation state, preparation status, and insight card.
- `features/today` — compatible dashboard section and schedule-list patterns for student and teacher Today surfaces.
- Role-specific feature folders own their corresponding dashboard and workflow UI.

### Client Component boundaries

Client Components are justified for application shell navigation, forms with Server Action status, dialogs, calendar interactions, editable lesson preparation, Study Cave state, live-session simulation, conversation composition, and tab controls. Server Components remain the default for route wrappers, layouts, static page composition, and server translation/data loading.

## Reuse decisions

### Implemented

- The calendar was split into focused feature-local toolbar, date utilities, event card, views, editor, and types. `StudentSchedule` retains only schedule state and orchestration.
- Study Cave route-state parsing is centralized in `features/study-cave/types.ts` and consumed by both Study Cave routes.
- Study Cave phase tabs, card title, and question card are feature-local reusable parts.
- Teacher preparation status and insight card are focused, feature-local components.

### Intentionally feature-local

- Calendar UI remains in `features/student-learn`; it has no compatible non-student consumer yet.
- Study Cave and teacher-preparation components remain feature-owned because their state models and workflows differ from other pages.
- Teacher and student live-session UI remains separate; it shares a lifecycle concept but not a compatible presentation contract.
2
### Intentionally shared

- App shell, empty-state presentation, lesson-stage tabs, Rafiqi conversation, and Today dashboard patterns have real cross-page reuse and remain shared.

## shadcn audit

### Installed primitives and current direction

The project already has the primitives needed for its current interface: buttons, cards, inputs, checkboxes, dialogs, fields, labels, selects, separators, skeletons, spinners, and textareas. New UI should compose these before introducing a new primitive.

### Custom UI that should remain custom

| Component or pattern | Decision | Reason |
| --- | --- | --- |
| `AppShell` | Keep custom composition | Product navigation, role-specific routes, responsive shell, and locale behavior are app-specific. |
| `RafiqiConversation` | Keep custom composition | Conversation state, prompt suggestions, attachments, and assistant/student roles are domain-specific. |
| Student calendar | Keep feature-local | The calendar view, scheduling state, and event editor are product workflow components, not generic primitives. |
| Study Cave phase flow | Keep feature-local | It combines learning phases, session access, notes, and review behavior. |

### Candidates to evaluate only when needed

| Candidate | Current decision | Condition for adoption |
| --- | --- | --- |
| Official shadcn Tabs | Defer | Adopt only if several routed/local tab controls need the same keyboard and panel behavior. Existing tab implementations are clear and fit their specific state models. |
| Official shadcn Accordion | Defer | Native `details` in the learning map is accessible and sufficient; adopt only if a shared controlled accordion is needed. |
| Official shadcn Calendar/Date Picker | Defer | The current schedule needs a full workflow calendar and uses a native date input. Evaluate only if date-range or complex date selection becomes a real requirement. |
| Existing Select primitive for the schedule recurrence field | Optional cleanup | Consider only when editing the schedule UI; the native select is currently accessible and does not justify a behavior-only replacement. |

No shadcn registry components should be installed or copied automatically. Each candidate requires approval after checking dependencies, accessibility behavior, RTL support, and visual compatibility.

## Architecture rules

- Prefer Server Components and add `"use client"` only for actual client behavior.
- Keep route files small and feature-specific UI within its feature folder.
- Promote components to `src/components/shared` only after two compatible consumers exist.
- Reuse installed UI primitives; avoid creating generic wrappers around one-off markup.
- Preserve English/LTR and Arabic/RTL behavior, `next-intl` messages, accessibility, and current visual tokens during structural refactors.
- In review mode, do not change product code; update this document only.

## Prioritized plan

### High-value

1. Keep the current calendar decomposition and use it as the pattern for future interactive feature workflows.
2. Split additional Study Cave phase panels only when their independent behavior grows; keep cross-phase state in the parent orchestrator.
3. Extract teacher preparation cards only when independently testable or reused inside that feature.

### Useful but optional

1. Convert purely static client islands to Server Components when touching their surrounding pages.
2. Evaluate shadcn registry candidates only for a demonstrated shared product need.

### Keep unchanged

1. Existing shared shell, auth framing, empty state, lesson-stage tabs, Rafiqi conversation, and Today dashboard patterns.
2. Framework special files and simple route wrappers.
3. Custom workflow components whose similarities are only visual.

## Change log

- **2026-09-15:** Initialized architecture document and shadcn audit.
- **2026-09-13:** Split student schedule into feature-local calendar components; centralized Study Cave route-state parsing; extracted focused Study Cave and teacher-preparation components.

## Review companion implementation — 2026-09-22

Approved [Board 41](../design/boards/41-review-companion-chat.md). Route pages remain server components; server/review-api owns bearer authentication and transport; Zod-validated Server Actions own mutations; ReviewCompanion owns local composer/request state. Public response types are feature-local. Backend state is authoritative and resume is URL/lesson-based.

Read-only registry audit: inspected official message, bubble and message-scroller items. Classification: compose existing Card/Button/Textarea and native radio/details elements for the approved bounded, nonstreaming mock chat. Message/bubble are optional future composition choices; message-scroller is unnecessary without streaming/anchored-history requirements. No registry components or dependencies installed. Preserve theme tokens, accessibility and en/ar logical direction.

## D6 completion handoff — 2026-09-24

`ReviewSession.summary` is an additive nullable backend field. `ReviewCompanion` renders `ReviewCompletionSummary` only for completed sessions with a saved summary and retains the previous completion sentence as the compatibility fallback. The component presents localized labels around backend-authored, student-friendly content; it does not recompute mastery, interpret assessment taxonomy, or create profile/homework state. The same component and logical-direction layout support English and Arabic.
