# Board 41 — Review companion chat

Approved by the user on 2026-09-22. [Design preview](41-review-companion-chat.png).

Replace the static review confirmations inside the existing After class companion with one continuous chat: selectable questions, written answers, explanatory feedback, expandable persistent hints, help and next-question actions. The three columns are states of one conversation, not tabs. The preview's next-question example is sequential: show it only after the student requests it.

Use mock AI, visibly labelled demo responses. Help requests do not consume attempts. Keep one persistent session per authenticated student and lesson. Save questions, answers, feedback, scores and assistance. Fetch the objective and key points from backend lesson content. Support English and Arabic, including RTL. Remove During class; legacy during links open After class.

Preserve the existing cards, selectors and out-of-scope sections. No integration for materials, notes, teacher Q&A, timeline, self-check or homework in this slice. Only seeded lessons are offered by the new backend catalog.
    
This approval supersedes the static three-confirmation companion behavior in S07/AfterClassReview. The older design remains a historical reference. No new page or study-stage navigation is introduced.

## Completion extension — approved 2026-09-24

When the student selects Finish review, keep them inside the same companion and show the saved D6 completion summary. Reuse the existing card language: a positive completion header, compact concept cards, a visible support indicator when hints or explanation were used, and one clear next-step panel. Use student-friendly outcome labels only; do not expose numeric scores, assessment error codes, confidence, or evidence-window details.

The backend is authoritative for concept outcomes, supportive messages, assistance state, and the next step. The frontend only presents that immutable handoff in English or Arabic and falls back to the existing completion sentence for an older completed session with no summary. This extension adds the final state to the approved continuous conversation; it does not add a page, stage, or independent mastery calculation.
