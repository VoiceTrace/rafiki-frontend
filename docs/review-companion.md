# Review companion integration

Approved design: [Board 41](../design/boards/41-review-companion-chat.md). Existing After class cards host objective/key-point data and a single conversation with choice/written questions, feedback, progressive hints and completion. The old static companion confirmations are superseded. No Check-In or Deepen controls are shown.

## Server boundary

The two existing localized Study Cave pages call `loadReview` after student verification. The server-only integration reads API_URL/AUTH_API_URL and obtains the encrypted-session bearer token through the existing DAL. Only public lesson/session data is serialized into Client Components. Server Actions validate input with Zod and repeat authorization through the integration layer on every request. No new public API URL or browser token is needed.

Requires the paired backend review-companion change and its migration. Endpoints: GET /study-lessons, GET /study-sessions/by-lesson/{lesson_id}, POST /study-sessions, GET /study-sessions/{id}, POST /study-sessions/{id}/messages. This is not the legacy PR #4/D1 contract. API_URL points to the backend origin without a trailing API prefix.

## Lifecycle

Read-only page loads retrieve content and an existing session without creating one. Start review creates or resumes one permanent student/lesson session. The database enforces uniqueness. Lesson selection is URL-backed; only available backend lessons are offered (initially Newton's Third Law). Unknown lessons, empty catalogs and unavailable services do not fabricate lesson content.

Message actions contain a UUID request ID and expected version. Failed sends retain the draft and request ID for safe retry. Conflict responses offer reload. Reopening the route restores transcript, answers, hints, selected submitted option and completion. Historical messages keep their original language; changing locale translates authored lesson/questions and interface copy.

Demo responses are labelled. Choice scoring is deterministic; written scoring is a mock keyword rule. Help can be requested via the Explain this suggestion or normal chat; help never spends an answer attempt. After three failed attempts an explanation appears. Next question advances; Finish review completes the permanent session. Help remains available afterward. No production mastery/profile update is claimed.

## Scope

During class is removed from the Study Cave navigation. Legacy `?phase=during` opens After class. Subject/chapter/lesson controls use the backend catalog and preserve the lesson when switching sections. Before-class content and the existing homework panel remain demos. Timeline, self-check, teacher Q&A, notes/feedback and materials retain their existing frontend behavior and are not newly persisted. The old summary download uses backend objective/key points but does not export the chat transcript in this slice.

## UI composition

Keep the current Card, Button and Textarea primitives. Question choices use native radio inputs, and revealed hints use native details/summary for keyboard access. Use logical spacing and translated copy in en/ar. The approved image depicts successive states of one conversation, not three panels or tabs.

Validation: TypeScript after Next route generation; targeted ESLint; production build; live Next MCP/browser checks and the paired backend tests. See PR validation notes for actual results and environment limitations.
