# Review companion integration

Approved design: [Board 41](../design/boards/41-review-companion-chat.md). Existing After class cards host objective/key-point data and a single conversation with choice/written questions, feedback, progressive hints and completion. The old static companion confirmations are superseded. No Check-In or Deepen controls are shown.

## Server boundary

The two existing localized Study Cave pages call `loadReview` after student verification. The server-only integration reads API_URL/AUTH_API_URL and obtains the encrypted-session bearer token through the existing DAL. Only public lesson/session data is serialized into Client Components. Server Actions validate input with Zod and repeat authorization through the integration layer on every request. No new public API URL or browser token is needed.

Requires the paired backend review-companion change and its migrations. Endpoints: GET /study-lessons, GET /study-sessions/by-lesson/{lesson_id}, POST /study-sessions, GET /study-sessions/{id}, POST /study-sessions/{id}/messages. The session response includes an additive `summary` field, which is `null` until completion and contains the immutable D6 handoff afterward. This is not the legacy PR #4/D1 contract. API_URL points to the backend origin without a trailing API prefix.

## Lifecycle

Read-only page loads retrieve content and an existing session without creating one. Start review creates or resumes one permanent student/lesson session. The database enforces uniqueness. Lesson selection is URL-backed; only available backend lessons are offered through stable subject/chapter/lesson IDs. Unknown lessons, empty catalogs and unavailable services do not fabricate lesson content.

Message actions contain a UUID request ID and expected version. Failed sends retain the draft and request ID for safe retry. Conflict responses offer reload. Reopening the route restores transcript, answers, hints, selected submitted option and completion. Historical messages keep their original language; changing locale translates authored lesson/questions and interface copy.

Demo responses are labelled. Choice scoring is deterministic; written scoring is a mock keyword rule. Help can be requested via the Explain this suggestion or normal chat; help never spends an answer attempt. After three failed attempts an explanation appears. Next question advances; Finish review completes the permanent session, recomputes concept mastery, and returns the saved D6 summary. Help remains available afterward. Profile extraction and homework automation remain deferred.

## Scope

During class is removed from the Study Cave navigation. Legacy `?phase=during` opens After class. Subject/chapter/lesson controls use the backend catalog and preserve the lesson when switching sections. Before-class content and the existing homework panel remain demos. Timeline, self-check, teacher Q&A, notes/feedback and materials retain their existing frontend behavior and are not newly persisted. The old summary download uses backend objective/key points but does not export the chat transcript in this slice.

## UI composition

Keep the current Card, Button and Textarea primitives. Question choices use native radio inputs, and revealed hints use native details/summary for keyboard access. Use logical spacing and translated copy in en/ar. The approved image depicts successive states of one conversation, not three panels or tabs.

## D6 completion summary — 2026-09-24

Updated placement approved by the user: show the summary in its own full-width card below the notes/chat row. This supersedes the original nested placement described below. Keep the chat composer inside the chat card. Use an auto-fitting concept grid so a single concept fills the card. The chat log establishes a positioning boundary for hidden speaker labels, preventing those labels from extending document scroll height beyond the page and moving the sticky sidebar away.

After Finish review, the companion stays on the same page and replaces the simple completion sentence with a structured summary card. It shows the lesson, total attempts, each concept's student-friendly outcome and supportive message, whether support was used, and the backend-authored next step. It deliberately omits numeric scores, raw assessment taxonomy, confidence, and evidence-window details. English and Arabic use the same structured snapshot; the backend localizes messages for the requested locale. Older completed sessions without a summary retain the existing completion-message fallback.

The summary is read-only and backend-authoritative. Reloading or retrying completion must return the same saved summary rather than generate a second handoff. The frontend does not independently calculate mastery or start profile/homework work.

Validation: TypeScript after Next route generation; targeted ESLint; production build; live Next MCP/browser checks and the paired backend tests. See PR validation notes for actual results and environment limitations.

## Catalog sequence — 2026-09-23

The server integration loads `/study-subjects`, `/study-subjects/{id}/chapters`, and `/study-lessons?chapter_id=...` in order. Subject/chapter selection is URL-backed (`subject_id`, `chapter_id`); no lesson is auto-selected. Changing a parent clears dependent IDs. A `lesson_id` deep link resolves its parents from the API. Both localized Study Cave routes support this sequence, back/forward navigation, and reload. No session is created until Start review.

Initially chapter/lesson controls are disabled. Loading disables selector interactions and hides stale lesson content. Empty and failed catalog responses are rendered without fabricated content. Language-independent IDs keep selection stable between English and Arabic. Lesson data includes backend concept references, with no additional concept panel required by this design.

The four demo lessons are Newton’s Third Law and Balanced Forces (Physics / Forces and Motion), Kinetic Energy (Physics / Energy), and Equivalent Fractions (Mathematics / Fractions). The non-integrated Newton-specific demo cards and download stay on Newton only; other lessons show their stored objective/key points and companion, with unavailable notices for before-class/homework content. This prevents showing Newton notes/materials under a mathematics lesson.

Backend PR #3's latest catalog migration must run before this frontend version. Existing session UUIDs, history and completion survive the migration. AI stays mocked.

Catalog validation: production build, TypeScript and targeted ESLint passed; Next MCP reports no compilation/runtime errors. Browser checks confirmed initial dependent controls and parent-selection reset. The user took over the remaining manual catalog journey; full catalog browser acceptance is pending. Full repository lint retains the unrelated profile-form.tsx:41 effect error.
