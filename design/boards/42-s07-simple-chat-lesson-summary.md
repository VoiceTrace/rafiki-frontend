# Board 42 — S07 simple chat and lesson summary

Approved by the user on 2026-09-28. [Design preview](42-s07-simple-chat-lesson-summary.png).

Use the simple two-column composition from the original student HTML reference for the Study Cave **After class** phase. Keep the existing lesson-phase tabs exactly as implemented.

- The left column is the existing continuous Rafiqi review conversation. Present it as one spacious white card with a compact header, contained scrolling and a composer anchored at the bottom. Preserve the approved question, written-answer, hint, help, feedback, retry, completion and saved-session behavior from Board 41.
- The right column is one **Lesson summary** card. It contains six accordion sections: Key points to focus on, Material to watch & study, Your questions & answers, Notes you collected, Misconceptions you fixed, and A note from your teacher. Key points and materials start expanded; the remaining sections start collapsed.
- Use the current Rafiqi design system: orange primary actions, lavender assistant accents, sage completion states, semantic tokens, Lucide icons, shared cards and controls.
- Stack chat before summary on narrow screens. English uses LTR and Arabic uses RTL with logical spacing.
- Keep the separate immutable completion summary from Board 41 beneath the conversation when the review is finished.
- Expanding any number of Lesson summary sections must grow only the summary column. It must not stretch the chat card or create blank space between the conversation and composer.
- In the composer, Enter sends the message and Shift+Enter inserts a new line.

Backend lesson content remains authoritative for lesson key points and review-session content. The existing Newton-only demo material, notes, teacher Q&A and teacher note remain demo content and must not leak into other lessons when those sources are unavailable.

This board supersedes the previous multi-card After-class page composition. It extends Board 41's interaction contract and does not replace the original HTML snapshot.
